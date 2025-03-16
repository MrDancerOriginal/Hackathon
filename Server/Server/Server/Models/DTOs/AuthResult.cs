namespace Server.Models.DTOs
{
    public class AuthResult
    {
        public string Id { get; set; }
        public string Token { get; set; }
        public bool Result { get; set; }
        public List<string> Errors { get; set; }
    }
}
