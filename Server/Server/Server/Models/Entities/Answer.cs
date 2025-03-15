using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models.Entities
{
    public class Answer
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public virtual Question Question { get; set; }

        [Required]
        public string Text { get; set; }

        // Позначення, чи є відповідь правильною
        public bool IsCorrect { get; set; }
    }
}
