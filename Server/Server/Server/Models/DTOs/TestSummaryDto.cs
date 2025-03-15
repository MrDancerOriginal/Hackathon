using Server.Models.Entities;

namespace Server.Models.DTOs
{
    public class TestSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public TestStatus Status { get; set; }
    }
}
