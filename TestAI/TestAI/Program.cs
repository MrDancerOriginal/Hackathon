using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    private static readonly string groqApiKey = "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"; // Replace with your GroqCloud API key
    private static readonly string groqUrl = "https://api.groq.com/openai/v1/chat/completions"; // GroqCloud API endpoint

    static async Task Main(string[] args)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {groqApiKey}");

        // Create the prompt for Groq
        var prompt = $@"
Generate a single multiple-choice question based on the text below.
Ensure the answer options are directly relevant to the context.
Return exactly one correct answer and three incorrect answers.
Provide a valid JSON object in the following structure:

{{
  ""Questions"": [
    {{
      ""QuestionText"": ""Generated question"",
      ""Answers"": [
        {{""AnswerText"": ""Correct answer"", ""IsCorrect"": true}},
        {{""AnswerText"": ""Incorrect answer 1"", ""IsCorrect"": false}},
        {{""AnswerText"": ""Incorrect answer 2"", ""IsCorrect"": false}},
        {{""AnswerText"": ""Incorrect answer 3"", ""IsCorrect"": false}}
      ]
    }}
  ]
}}

Text:
Albert Einstein was a theoretical physicist who developed the theory of relativity. He is best known for the equation E=mc^2.
";

        // Create the request payload for Groq
        var request = new
        {
            model = "meta-llama/llama-4-scout-17b-16e-instruct", // or "llama3-70b-8192"
            messages = new[]
            {
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            response_format = new { type = "json_object" },
            temperature = 0.7
        };

        var jsonRequest = JsonConvert.SerializeObject(request);
        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

        // Get response from Groq
        var response = await client.PostAsync(groqUrl, content);
        var responseContent = await response.Content.ReadAsStringAsync();

        // Parse the response
        try
        {
            dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);
            string generatedContent = jsonResponse.choices[0].message.content;

            Console.WriteLine("Generated Question and Answer:");
            Console.WriteLine(generatedContent);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error parsing response:");
            Console.WriteLine(responseContent);
            Console.WriteLine(ex.Message);
        }
    }
}