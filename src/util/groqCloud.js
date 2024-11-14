import yaml from "js-yaml";

class GroqCloudClient {
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

  async runSimulation(inputData) {
    const endpoint = "/openai/v1/chat/completions";

    // Include the prompt structure
    const prompt = `
    You are tasked with simulating an electrical grid based on the provided YAML structure, which describes the nodes (components) and their connections in the circuit. Your goal is to analyze the components, understand their configurations, and simulate the behavior of the electrical grid.
    
    The YAML consists of two main sections: **nodes** and **connections**.
    
    1. **Nodes**: Each node represents a component in the electrical grid and contains:
       - \`id\`: A unique identifier for the component.
       - \`name\`: The name of the component (e.g., Battery, Bulb, Fan).
       - \`config\`: Configuration details about the component, including:
         - \`type\`: The category of the component (e.g., battery, load).
         - \`properties\`: Specific properties like power rating, voltage, and capacity.
       - \`image\`: A URL to an image representing the component.
       - \`position\`: The x and y coordinates for visual representation.
    
    2. **Connections**: Each connection defines a relationship between two nodes, specifying:
       - \`source\`: The ID of the source node.
       - \`target\`: The ID of the target node.
    
    Example Nodes:
    
    - **Battery**:
      \`\`\`yaml
      id: 1
      name: Battery
      config:
        type: battery
        properties:
          voltageRating: "12v"
          capacity: "50Ah"
      image: "https://example.com/path-to-battery-image.png"
      position:
        x: 100
        y: 100
      \`\`\`
    
    - **Bulb**:
      \`\`\`yaml
      id: 2
      name: Bulb
      config:
        type: load
        properties:
          type: AC
          power: "10w"
      image: "https://example.com/path-to-bulb-image.png"
      position:
        x: 300
        y: 100
      \`\`\`
    
    - **Fan**:
      \`\`\`yaml
      id: 3
      name: Fan
      config:
        type: load
        properties:
          type: DC
          power: "20w"
      image: "https://example.com/path-to-fan-image.png"
      position:
        x: 300
        y: 300
      \`\`\`
    
    Example Connections:
    
    - **Connection 1**: Battery to Bulb
      \`\`\`yaml
      source: 1
      target: 2
      \`\`\`
    
    - **Connection 2**: Battery to Fan
      \`\`\`yaml
      source: 1
      target: 3
      \`\`\`
    
    Simulation Task:
    
    Given this structure, please provide the following:
    
    1. A detailed description of each component, including its type and properties.
    2. An explanation of how each component interacts with the others based on the connections.
    3. Any calculations that might be necessary to simulate the power distribution and load management in the circuit.
    
    Example Analysis:
    
    1. **Battery (ID: 1)**:
       - Type: Battery
       - Properties: Voltage Rating: 12V, Capacity: 50Ah
       - Interactions:
         - Supplies power to both the Bulb (ID: 2) and the Fan (ID: 3).
    
    2. **Bulb (ID: 2)**:
       - Type: Load
       - Properties: AC, Power: 10W
       - Interactions:
         - Receives power from the Battery.
    
    3. **Fan (ID: 3)**:
       - Type: Load
       - Properties: DC, Power: 20W
       - Interactions:
         - Also receives power from the Battery.
    
    Conclusion:
    
    Your output should simulate the entire electrical grid scenario, allowing us to visualize the connections and understand the overall power flow through the components. The output should be in the format of a JSON file with the following fields:
    
    - **totalPowerConsumed**: The sum of the power consumed by all loads in watts (e.g., for Bulb and Fan).
    - **totalDurationOfSystem**: The duration in hours that the system can run, calculated based on the battery capacity and total power consumed.
    - **remainingBatteryCapacity**: The remaining capacity of the battery after accounting for the total power consumed.
    - **totalPowerProvided**: The total power provided by the battery, based on its voltage and capacity.
    
    Example JSON output format:
    {
      "totalPowerConsumed": 30,
      "totalDurationOfSystem": 1.67,
      "remainingBatteryCapacity": 41.67,
      "totalPowerProvided": 600
    }
    
    In this example:
    - \`totalPowerConsumed\` is the sum of the bulb's 10W and the fan's 20W.
    - \`totalDurationOfSystem\` is calculated by dividing the battery's total energy (600Wh) by the total power consumed (30W).
    - \`remainingBatteryCapacity\` shows the remaining capacity in Ah after usage.
    - \`totalPowerProvided\` is the total energy capacity of the battery in watt-hours.
    
    Now, calculate for the following data and only return the json output and no additional text only specify above given paramenters:
    \`\`\`yaml
    ${inputData}
    \`\`\`
    `;

    const body = {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 6000,
      temperature: 0.1,
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

export async function main(inputValue) {
  const groqCloudClient = new GroqCloudClient(
    "https://api.groq.com",
    "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"
  );

  try {
    // Convert JSON input to YAML format
    const yamlData = convertJsonToYaml(inputValue);
    if (!yamlData) {
      throw new Error("Failed to convert input to YAML format.");
    }

    const response = await groqCloudClient.runSimulation(yamlData);

    if (response && response.choices && response.choices.length > 0) {
      const output = response.choices[0].message.content;
      console.log("Final Output:", output);
      return output;
    } else {
      console.error("Unexpected API response format:", response);
      return null;
    }
  } catch (error) {
    console.error("Main Error:", error.message);
    throw error;
  }
}
