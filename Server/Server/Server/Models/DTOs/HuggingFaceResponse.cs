using Newtonsoft.Json;

namespace Server.Models.DTOs
{
    public class HuggingFaceResponse
    {
        [JsonProperty("generated_text")]
        public string GeneratedText { get; set; }
    }
}
