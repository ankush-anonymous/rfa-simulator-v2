import yaml from "js-yaml";

class CircuitGeneratorClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL.trim();
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
          `POST ${url} - ${response.status} ${
            response.statusText
          }: ${JSON.stringify(responseMessage)}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error(`Error during POST request: ${error.message}`);
      throw error;
    }
  }

  async generateCircuit(inputData) {
    const endpoint = "/openai/v1/chat/completions";

    // Circuit generator prompt structure
    const prompt = `Return only the JSON output in the following format without any additional text:
{
  "nodes": [
    {
      "id": "bulb1",
      "name": "Bulb",
      "image": "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535866/rfa-simulator/light-bulb_fw2try.png",
      "config": {
        "type": "load",
        "properties": {
          "type": "DC",
          "power": "24w"
        }
      }
    },
    {
      "id": "fan1",
      "name": "Fan",
      "image": "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535867/rfa-simulator/fan_uuidlu.png",
      "config": {
        "type": "load",
        "properties": {
          "type": "DC",
          "power": "36w"
        }
      }
    },
    {
      "id": "battery1",
      "name": "Battery",
      "image": "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/battery_cwuy11.png",
      "config": {
        "type": "battery",
        "properties": {
          "type": "Lion",
          "voltageRating": "24v",
          "capacity": "100Ah"
        }
      }
    },
    {
      "id": "switch1",
      "name": "Switch",
      "image": "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/switch-off_v5zt3h.png",
      "config": {
        "type": "control",
        "properties": {}
      }
    }
  ],
  "connections": [
    {
      "source": "switch1",
      "target": "bulb1"
    },
    {
      "source": "bulb1",
      "target": "fan1"
    },
    {
      "source": "fan1",
      "target": "battery1"
    },
    {
      "source": "switch1",
      "target": "battery1"
    }
  ]
}

The IDs should follow the naming convention: bulb1, fan1, battery1, switch1, and so on. For the images, use the pre-defined URLs:

- Bulb: https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535866/rfa-simulator/light-bulb_fw2try.png
- Fan: https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535867/rfa-simulator/fan_uuidlu.png
- Battery: https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/battery_cwuy11.png
- Switch: https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/switch-off_v5zt3h.png

### User Input Description
\`\`\`json
${inputData}
\`\`\`

Use the provided input description to generate nodes and connections based on the format above. Only return the JSON output.`;

    const body = {
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 6000,
      temperature: 0.5,
    };

    return this.post(endpoint, body);
  }
}

// Helper function to convert JSON data to YAML format
const convertJsonToYaml = (jsonData) => {
  try {
    return yaml.dump(jsonData);
  } catch (e) {
    console.error("Error converting JSON to YAML:", e);
    return null;
  }
};

export async function generateCircuit(inputValue) {
  const circuitGeneratorClient = new CircuitGeneratorClient(
    "https://api.groq.com",
    "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"
  );

  try {
    // Convert JSON input to YAML format
    const yamlData = convertJsonToYaml(inputValue);
    if (!yamlData) {
      throw new Error("Failed to convert input to YAML format.");
    }

    const response = await circuitGeneratorClient.generateCircuit(yamlData);

    if (response && response.choices && response.choices.length > 0) {
      const output = response.choices[0].message.content;
      console.log("Circuit JSON Output:", output);
      return output;
    } else {
      console.error("Unexpected API response format:", response);
      return null;
    }
  } catch (error) {
    console.error("Error in Circuit Generation:", error.message);
    throw error;
  }
}
