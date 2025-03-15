namespace Server.Models.DTOs
{
    public class CreateQuestionRequest
    {
        public string QuestionText { get; set; }
        public int Order { get; set; }
        public List<CreateAnswerRequest> Answers { get; set; }
    }
}
