using Newtonsoft.Json;
using System.Text;

namespace Server.Services
{
    public class LLMService
    {
        private readonly string _apiKey = "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"; // Замініть на ваш Groq API ключ
        private readonly string _apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        private readonly string _modelName = "meta-llama/llama-4-scout-17b-16e-instruct"; // Або "llama3-70b-8192"

        /// <summary>
        /// Викликає модель GroqCloud, передаючи промпт,
        /// та повертає результат у вигляді рядка (JSON або plain text).
        /// </summary>
        public async Task<string> GenerateQuestionsAsync(string prompt)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

                // Формуємо запит у форматі Groq API
                var requestPayload = new
                {
                    model = _modelName,
                    messages = new[]
                    {
                        new
                        {
                            role = "user",
                            content = prompt
                        }
                    },
                    response_format = new { type = "json_object" }, // Забезпечуємо JSON відповідь
                    temperature = 0.7 // Контролюємо креативність
                };

                var jsonRequest = JsonConvert.SerializeObject(requestPayload);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                // Виконуємо запит
                var response = await client.PostAsync(_apiUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"Groq API error: {response.StatusCode}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();

                // Витягуємо вміст відповіді
                try
                {
                    dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);
                    return jsonResponse.choices[0].message.content.ToString();
                }
                catch
                {
                    // Якщо не вдалося розпарсити, повертаємо оригінальну відповідь
                    return responseContent;
                }
            }
        }
    }
}