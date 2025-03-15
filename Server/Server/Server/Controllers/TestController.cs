using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Server.Data;
using Server.Models.DTOs;
using Server.Models.Entities;
using Server.Services;
using System.Text;
using UglyToad.PdfPig;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly LLMService _llmService;

        public TestController(AppDbContext context, IWebHostEnvironment env, LLMService llmService)
        {
            _context = context;
            _env = env;
            _llmService = llmService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTest([FromBody] CreateTestRequest request)
        {
            if (string.IsNullOrEmpty(request.AuthorId) || string.IsNullOrEmpty(request.Title))
            {
                return BadRequest("AuthorId та Title є обов'язковими полями.");
            }

            var test = new Test
            {
                Title = request.Title,
                Description = request.Description,
                AuthorId = request.AuthorId,
                DateCreated = DateTime.UtcNow,
                Status = request.Status
            };

            if (request.Questions != null && request.Questions.Any())
            {
                foreach (var q in request.Questions)
                {
                    var question = new Question
                    {
                        Text = q.QuestionText,
                        Order = q.Order,
                    };

                    if (q.Answers != null && q.Answers.Any())
                    {
                        foreach (var a in q.Answers)
                        {
                            question.Answers.Add(new Answer
                            {
                                Text = a.AnswerText,
                                IsCorrect = a.IsCorrect
                            });
                        }
                    }

                    test.Questions.Add(question);
                }
            }

            _context.Tests.Add(test);
            await _context.SaveChangesAsync();

            return Ok(new { testId = test.Id, message = "Тест успішно створено." });
        }

        /// <summary>
        /// Повертає список тестів, створених користувачем з заданим userId.
        /// </summary>
        /// <param name="userId">Ідентифікатор користувача</param>
        /// <returns>Список тестів у форматі TestSummaryDto</returns>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTestsByUser(string userId)
        {
            var tests = await _context.Tests
                .Where(t => t.AuthorId == userId)
                .Select(t => new TestSummaryDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    DateCreated = t.DateCreated,
                    Status = t.Status
                })
                .ToListAsync();

            if (tests == null || tests.Count == 0)
                return NotFound("No tests found for this user.");

            return Ok(tests);
        }

        [HttpGet("cat")]
        public async Task<IActionResult> GetTest()
        {
            var user = new { id = 1, name = "Bob", status = "success" };
            return Ok(user);
        }



        /// <summary>
        /// Приймає PDF-файл, конвертує його в текст і зберігає в БД (PDFFile).
        /// Повертає ідентифікатор збереженого файлу.
        /// </summary>
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Файл не завантажено або він порожній.");

            if (!file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Невірний формат файлу. Потрібен PDF.");

            // Створюємо каталог для збереження (якщо не існує)
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Генеруємо унікальне ім'я файлу та зберігаємо його
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Конвертуємо PDF у текст
            string extractedText;
            try
            {
                extractedText = ExtractTextFromPdf(filePath);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"Помилка при конвертації PDF: {ex.Message}");
            }

            // Зберігаємо запис у БД
            var pdfFile = new PdfFile
            {
                FileName = file.FileName,
                FilePath = filePath,
                ExtractedText = extractedText,
                UploadedDate = DateTime.UtcNow
            };

            _context.PDFFiles.Add(pdfFile);
            await _context.SaveChangesAsync();

            return Ok(new { pdfFileId = pdfFile.Id, message = "Файл завантажено та конвертовано у текст." });
        }

        /// <summary>
        /// Метод, що зчитує весь текст з PDF за допомогою PdfPig.
        /// </summary>
        private string ExtractTextFromPdf(string filePath)
        {
            var builder = new StringBuilder();
            using (var document = PdfDocument.Open(filePath))
            {
                foreach (var page in document.GetPages())
                {
                    builder.AppendLine(page.Text);
                }
            }
            return builder.ToString();
        }

        /// <summary>
        /// Використовує збережений текст із PDF (pdfFileId), викликає модель Hugging Face,
        /// створює тест із питаннями та зберігає його у БД.
        /// </summary>
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateTest([FromBody] GenerateTestRequest request)
        {
            // Шукаємо PDF-файл у БД
            var pdfFile = await _context.PDFFiles.FindAsync(request.PDFFileId);
            if (pdfFile == null)
                return NotFound("PDF файл не знайдено.");

            // Формуємо prompt для моделі
            // Hugging Face модель може повертати довільний текст, тому зазвичай
            // доводиться додавати у prompt прохання повернути результат у JSON-форматі
            var prompt = $"Generate a question and an answer and 3 fake answers : {pdfFile.ExtractedText}";

            string llmResponse;
            try
            {
                // Виклик LLMService
                llmResponse = await _llmService.GenerateQuestionsAsync(prompt);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"Помилка при виклику LLM: {ex.Message}");
            }

            // Залежно від моделі Hugging Face, відповідь може бути:
            // 1) В JSON-форматі (і тоді можна розпарсити через JSON)
            // 2) Просто текст, який доведеться розбирати вручну
            // Нижче приклад, якщо модель поверне щось, що можна десеріалізувати
            GeneratedTestDto generatedTest;
            try
            {
                generatedTest = JsonConvert.DeserializeObject<GeneratedTestDto>(llmResponse);
            }
            catch
            {
                // Якщо модель повернула не JSON, можна просто повернути сирий текст
                return Ok(new
                {
                    rawResponse = llmResponse,
                    message = "Модель повернула не JSON-формат. Адаптуйте парсинг."
                });
            }

            // Створюємо тест на основі згенерованих даних
            var test = new Test
            {
                Title = request.Title,
                Description = request.Description,
                AuthorId = request.AuthorId,
                DateCreated = DateTime.UtcNow,
                Status = TestStatus.Draft,
                PDFFileId = pdfFile.Id
            };

            int order = 1;
            if (generatedTest.Questions != null)
            {
                foreach (var q in generatedTest.Questions)
                {
                    var question = new Question
                    {
                        Text = q.QuestionText,
                        Order = order++
                    };

                    // Додаємо відповіді
                    if (q.Answers != null)
                    {
                        foreach (var a in q.Answers)
                        {
                            question.Answers.Add(new Answer
                            {
                                Text = a.AnswerText,
                                IsCorrect = a.IsCorrect
                            });
                        }
                    }

                    test.Questions.Add(question);
                }
            }

            _context.Tests.Add(test);
            await _context.SaveChangesAsync();

            return Ok(new { testId = test.Id, message = "Тест успішно згенеровано." });
        }
    }


}
