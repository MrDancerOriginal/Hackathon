using System.ComponentModel.DataAnnotations;

namespace Server.Models.Entities
{
    public class PdfFile
    {
        [Key]
        public int Id { get; set; }

        // Назва файлу, як завантажено користувачем
        [Required]
        public string FileName { get; set; }

        // Шлях до файлу у файловій системі (якщо зберігаємо його на диску)
        public string FilePath { get; set; }

        // Текст, витягнутий із PDF (конвертований для подальшого запиту до LLM)
        public string ExtractedText { get; set; }

        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
    }
}
