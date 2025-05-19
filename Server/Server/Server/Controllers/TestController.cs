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

            TestStatus status = TestStatus.Draft;
            
            if(request.Status == "Private")
            {
                status = TestStatus.Private;
            }
            else if (request.Status == "Published")
            {
                status = TestStatus.Published;
            }

            var test = new Test
            {
                Title = request.Title,
                Description = request.Description,
                AuthorId = request.AuthorId,
                DateCreated = DateTime.UtcNow,
                Status = status,
                PDFFileId = request.PDFFileId
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
                    Status = t.Status,
                    PDFFileId = (int)t.PDFFileId,
                    Questions = t.Questions
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

        [HttpPost("generate/{PDFFileId}")]
        public async Task<IActionResult> GenerateTest(int PDFFileId)
        {
            // Find PDF file in database
            var pdfFile = await _context.PDFFiles.FindAsync(PDFFileId);
            if (pdfFile == null)
                return NotFound("PDF file not found.");

            // Create prompt for LLM
            var prompt = $@"
Generate 5 multiple-choice questions based on the text below.
Ensure the answer options are directly relevant to the context.
Return exactly one correct answer and three incorrect answers.
Provide a valid JSON object in the following structure:

{{
  ""Questions"": [
    {{
      ""QuestionText"": ""Generated question"",
      ""Answers"": [
        {{""AnswerText"": ""Correct answer"", ""IsCorrect"": true}},
        {{""AnswerText"": ""Incorrect answer 1"", ""IsCorrect"": false}},
        {{""AnswerText"": ""Incorrect answer 2"", ""IsCorrect"": false}},
        {{""AnswerText"": ""Incorrect answer 3"", ""IsCorrect"": false}}
      ]
    }}
  ]
}}

Text:
{pdfFile.ExtractedText}
";

            // Call LLM service
            string llmResponse;
            try
            {
                llmResponse = await _llmService.GenerateQuestionsAsync(prompt);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"LLM call failed: {ex.Message}");
            }

            // Clean the response (remove markdown code blocks if present)
            var cleanJson = llmResponse
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            // Deserialize directly into our DTO
            GeneratedTestDto generatedTest;
            try
            {
                generatedTest = JsonConvert.DeserializeObject<GeneratedTestDto>(cleanJson);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Failed to parse LLM response",
                    details = ex.Message,
                    rawResponse = cleanJson
                });
            }

            if (generatedTest?.Questions == null || !generatedTest.Questions.Any())
            {
                return StatusCode(500, new
                {
                    error = "No valid questions generated",
                    rawResponse = cleanJson
                });
            }

            // Return clean JSON structure
            return Ok(generatedTest);
        }
    }


    }
