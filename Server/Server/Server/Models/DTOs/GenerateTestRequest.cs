namespace Server.Models.DTOs
{
    public class GenerateTestRequest
    {
        public int PDFFileId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AuthorId { get; set; }
    }
}
