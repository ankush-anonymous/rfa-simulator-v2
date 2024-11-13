class GroqCloudClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error(`Error during POST request: ${error.message}`);
      throw error;
    }
  }

  async runSimulation(inputValue) {
    const endpoint = "/openai/v1/chat/completions"; // Correct endpoint path

    const body = {
      model: "llama3-70b-8192", // Specify model as needed
      messages: [
        {
          role: "user",
          content: inputValue,
        },
      ],
      max_tokens: 2000,
      temperature: 0.1,
    };

    return this.post(endpoint, body);
  }
}

export async function main(inputValue) {
  const groqCloudClient = new GroqCloudClient(
    " https://api.groq.com", // GroqCloud API base URL
    "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" // Replace with your actual GroqCloud API key
  );

  try {
    const response = await groqCloudClient.runSimulation(inputValue);

    if (response && response.choices) {
      const output = response.choices[0].message.content;
      console.log("Final Output:", output);
      return output;
    }
  } catch (error) {
    console.error("Main Error:", error.message);
    throw error;
  }
}
