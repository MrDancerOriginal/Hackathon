using Server.Models.Entities;

namespace Server.Models.DTOs
{
    public class CreateTestRequest
    {

        public string AuthorId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } = "Draft";
        public List<CreateQuestionRequest> Questions { get; set; }
        public int PDFFileId { get; set; } 
    }
}
