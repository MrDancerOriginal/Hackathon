using Newtonsoft.Json;
using System.Text;

namespace Server.Services
{
    public class LLMService
    {
        private readonly string _apiKey = "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";
        private readonly string _modelUrl = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";

        /// <summary>
        /// Викликає модель Hugging Face, передаючи текст (prompt),
        /// та повертає результат у вигляді рядка (JSON або plain text).
        /// </summary>
        public async Task<string> GenerateQuestionsAsync(string prompt)
        {
            using (var client = new HttpClient())
            {
                // Додаємо токен авторизації
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

                // Формуємо JSON-запит
                var requestPayload = new { inputs = prompt };
                var jsonRequest = JsonConvert.SerializeObject(requestPayload);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                // Виконуємо POST-запит до моделі
                var response = await client.PostAsync(_modelUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                // Повертаємо відповідь як рядок
                return responseContent;
            }
        }
    }
}
