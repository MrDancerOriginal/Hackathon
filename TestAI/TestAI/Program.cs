using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    private static readonly string apiKey = "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"; // Ваш API ключ Hugging Face
    private static readonly string modelUrl = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it"; // Замість gpt-3 можна використовувати іншу модель

    static async Task Main(string[] args)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

        // Створюємо запит до API для генерації питання та відповіді
        var questionRequest = new
        {
            inputs = "Generate a question and an answer and 3 fake answers : Albert Einstein was a theoretical physicist who developed the theory of relativity. He is best known for the equation E=mc^2."
        };

        var jsonRequest = Newtonsoft.Json.JsonConvert.SerializeObject(questionRequest);
        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

        // Отримуємо відповідь від моделі
        var response = await client.PostAsync(modelUrl, content);
        var responseContent = await response.Content.ReadAsStringAsync();

        // Тут ми отримуємо відповідь, яка містить згенероване питання та відповідь
        Console.WriteLine("Generated Question and Answer:");
        Console.WriteLine(responseContent);

        //// Генерація 3 фейкових питань
        //var fakeQuestionRequest = new
        //{
        //    inputs = "Generate 3 fake questions."
        //};

        //var fakeJsonRequest = Newtonsoft.Json.JsonConvert.SerializeObject(fakeQuestionRequest);
        //var fakeContent = new StringContent(fakeJsonRequest, Encoding.UTF8, "application/json");

        //var fakeResponse = await client.PostAsync(modelUrl, fakeContent);
        //var fakeResponseContent = await fakeResponse.Content.ReadAsStringAsync();

        //Console.WriteLine("\nGenerated Fake Questions:");
        //Console.WriteLine(fakeResponseContent);
    }
}
