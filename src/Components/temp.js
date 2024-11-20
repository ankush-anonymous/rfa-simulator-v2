const handleAddNodeFromJson = useCallback(
  (jsonNode) => {
    const nodeConfig = config.items.find(
      (item) => item.title.toLowerCase() === jsonNode.name.toLowerCase()
    );

    if (!nodeConfig) return;

    const newNode = {
      id: jsonNode.id,
      type: "custom",
      data: {
        id: jsonNode.id,
        name: jsonNode.name,
        image: jsonNode.image,
        config: jsonNode.config,
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setNodes((nds) => [...nds, newNode]);

    // Save to flowData in localStorage
    const flowData = JSON.parse(localStorage.getItem("flowData")) || {
      nodes: [],
      connections: [],
    };

    // Check if the node already exists in the stored data
    const existingNodeIndex = flowData.nodes.findIndex(
      (n) => n.id === newNode.id
    );
    if (existingNodeIndex >= 0) {
      flowData.nodes[existingNodeIndex] = newNode.data;
    } else {
      flowData.nodes.push({
        id: newNode.id,
        name: newNode.data.name,
        image: newNode.data.image,
        config: newNode.data.config,
      });
    }

    localStorage.setItem("flowData", JSON.stringify(flowData));
  },
  [setNodes]
);

useEffect(() => {
  if (jsonInput && jsonInput.nodes) {
    console.log(jsonInput);

    jsonInput.nodes.forEach((jsonNode) => {
      handleAddNodeFromJson(jsonNode);
    });
  }
}, [jsonInput, handleAddNodeFromJson]);

useEffect(() => {
  if (jsonInput && jsonInput.connections) {
    // Extract connections from the input
    const newEdges = jsonInput.connections.map((conn) => ({
      id: `${conn.source}-${conn.target}`,
      source: conn.source,
      target: conn.target,
      type: "step", // or any edge type you prefer
    }));

    console.log(newEdges);

    // Update edges state with new edges
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  }
}, [jsonInput, setEdges]);
