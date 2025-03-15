namespace Server.Models.DTOs
{
    public class CreateAnswerRequest
    {
        public string AnswerText { get; set; }
        public bool IsCorrect { get; set; }
    }
}
