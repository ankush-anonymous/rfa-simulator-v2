class LangflowClient {
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

  async initiateSession(
    flowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
    tweaks = {}
  ) {
    const endpoint = `/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks: tweaks,
    });
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error("Stream Error:", event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose("Stream closed");
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(
    flowIdOrName,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks,
    stream = false,
    onUpdate,
    onClose,
    onError
  ) {
    try {
      const initResponse = await this.initiateSession(
        flowIdOrName,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );
      if (
        stream &&
        initResponse?.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url
      ) {
        const streamUrl =
          initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      onError("Error initiating session");
    }
  }
}

export async function main(
  inputValue,
  inputType = "chat",
  outputType = "chat",
  stream = false
) {
  const flowIdOrName = "7f19fc2b-e793-4757-bc9f-9bb0bdd188a3";
  const langflowClient = new LangflowClient(
    "http://127.0.0.1:7860",
    "your-api-key"
  );
  const jsonInput = JSON.parse(localStorage.getItem("flowData"));
  const tweaks = {
    "Prompt-ZrW9V": {
      Document: "",
      Question: "",
      template:
        "Do the following for the given question and make sure you only give me the json object of the final result and nothing else: \n---\n\n{Document}\n\n---\n\nQuestion:\n{Question}\n\nAnswer:\n",
    },
    "GroqModel-tiWew": {
      groq_api_base: "https://api.groq.com",
      groq_api_key: "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",
      input_value: "",
      max_tokens: null,
      model_name: "llama3-70b-8192",
      n: null,
      stream: false,
      system_message: "",
      temperature: 0.1,
    },
    "TextOutput-qEGY1": {
      input_value: "",
    },
    "TextInput-UQ7lK": {
      input_value: JSON.stringify(jsonInput),
    },
    "TextInput-9iiuh": {
      input_value:
        'You are tasked with simulating an electrical grid based on the provided JSON structure, which describes the nodes (components) and their connections in the circuit. Your goal is to analyze the components, understand their configurations, and simulate the behavior of the electrical grid.\n\n\nThe JSON consists of two main sections: **nodes** and **connections**.\n\n1. **Nodes**: Each node represents a component in the electrical grid and contains:\n   - `id`: A unique identifier for the component.\n   - `name`: The name of the component (e.g., Battery, Bulb, Fan).\n   - `config`: Configuration details about the component, including:\n     - `type`: The category of the component (e.g., battery, load).\n     - `properties`: Specific properties like power rating, voltage, and capacity.\n   - `image`: A URL to an image representing the component.\n   - `position`: The x and y coordinates for visual representation.\n\n2. **Connections**: Each connection defines a relationship between two nodes, specifying:\n   - `source`: The ID of the source node.\n   - `target`: The ID of the target node.\n\nExample Nodes:\n\n- **Battery**:\n  {\n    "id": "1",\n    "name": "Battery",\n    "config": {\n      "type": "battery",\n      "properties": {\n        "voltageRating": "12v",\n        "capacity": "50Ah"\n      }\n    },\n    "image": "https://example.com/path-to-battery-image.png",\n    "position": {\n      "x": 100,\n      "y": 100\n    }\n  }\n\n- **Bulb**:\n  {\n    "id": "2",\n    "name": "Bulb",\n    "config": {\n      "type": "load",\n      "properties": {\n        "type": "AC",\n        "power": "10w"\n      }\n    },\n    "image": "https://example.com/path-to-bulb-image.png",\n    "position": {\n      "x": 300,\n      "y": 100\n    }\n  }\n\n- **Fan**:\n  {\n    "id": "3",\n    "name": "Fan",\n    "config": {\n      "type": "load",\n      "properties": {\n        "type": "DC",\n        "power": "20w"\n      }\n    },\n    "image": "https://example.com/path-to-fan-image.png",\n    "position": {\n      "x": 300,\n      "y": 300\n    }\n  }\n\nExample Connections:\n\n- **Connection 1**: Battery to Bulb\n  {\n    "source": "1",\n    "target": "2"\n  }\n\n- **Connection 2**: Battery to Fan\n  {\n    "source": "1",\n    "target": "3"\n  }\n\nSimulation Task:\n\nGiven this structure, please provide the following:\n\n1. A detailed description of each component, including its type and properties.\n2. An explanation of how each component interacts with the others based on the connections.\n3. Any calculations that might be necessary to simulate the power distribution and load management in the circuit.\n\nExample Analysis:\n\n1. **Battery (ID: 1)**:\n   - Type: Battery\n   - Properties: Voltage Rating: 12V, Capacity: 50Ah\n   - Interactions:\n     - Supplies power to both the Bulb (ID: 2) and the Fan (ID: 3).\n\n2. **Bulb (ID: 2)**:\n   - Type: Load\n   - Properties: AC, Power: 10W\n   - Interactions:\n     - Receives power from the Battery.\n\n3. **Fan (ID: 3)**:\n   - Type: Load\n   - Properties: DC, Power: 20W\n   - Interactions:\n     - Also receives power from the Battery.\n\nConclusion:\n\nYour output should simulate the entire electrical grid scenario, allowing us to visualize the connections and understand the overall power flow through the components. The output should be in the format of a JSON file with the following fields:\n\n- **totalPowerConsumed**: The sum of the power consumed by all loads in watts (e.g., for Bulb and Fan).\n- **totalDurationOfSystem**: The duration in hours that the system can run, calculated based on the battery capacity and total power consumed.\n- **remainingBatteryCapacity**: The remaining capacity of the battery after accounting for the total power consumed.\n- **totalPowerProvided**: The total power provided by the battery, based on its voltage and capacity.\n\nExample JSON output format:\n{\n  "totalPowerConsumed": 30,\n  "totalDurationOfSystem": 1.67,\n  "remainingBatteryCapacity": 41.67,\n  "totalPowerProvided": 600\n}\n\nIn this example:\n- `totalPowerConsumed` is the sum of the bulb\'s 10W and the fan\'s 20W.\n- `totalDurationOfSystem` is calculated by dividing the battery\'s total energy (600Wh) by the total power consumed (30W).\n- `remainingBatteryCapacity` shows the remaining capacity in Ah after usage.\n- `totalPowerProvided` is the total energy capacity of the battery in watt-hours.\n',
    },
  };

  try {
    const response = await langflowClient.runFlow(
      flowIdOrName,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
      (data) => console.log("Received:", data.chunk), // onUpdate
      (message) => console.log("Stream Closed:", message), // onClose
      (error) => console.error("Stream Error:", error) // onError
    );

    if (!stream && response) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.text.message;

      console.log("Final Output:", output);
    }
  } catch (error) {
    console.error("Main Error:", error.message);
  }
}
