using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace Server.Models.Entities
{
    public class Test
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        public string Description { get; set; }

        // Зв'язок з користувачем, що створив тест (foreign key до AspNetUsers)
        [Required]
        public string AuthorId { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        // Статус тесту (чернетка, опубліковано, приватний)
        public TestStatus Status { get; set; } = TestStatus.Draft;

        // Колекція питань, пов'язаних з тестом
        public int? PDFFileId { get; set; }
        [ForeignKey("PDFFileId")]
        public virtual PdfFile PDFFile { get; set; }

        // Колекція питань, що належать даному тесту
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();


    }

    public enum TestStatus
    {
        Draft,
        Published,
        Private
    }

}
