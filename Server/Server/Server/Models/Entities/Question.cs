using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models.Entities
{
    public class Question
    {
        public int Id { get; set; }

        [ForeignKey("Test")]
        public int TestId { get; set; }
        public virtual Test Test { get; set; }

        [Required]
        public string Text { get; set; }

        // Порядковий номер для відображення питань
        public int Order { get; set; }

        // Колекція варіантів відповідей для питання
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
