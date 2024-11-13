import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";

const parseTextToFlowData = (text) => {
  // Example parsing function: "NodeA -> NodeB" creates a connection
  const lines = text.split("\n");
  const nodes = [];
  const edges = [];

  lines.forEach((line, index) => {
    const [source, target] = line.split("->").map((s) => s.trim());
    if (source && target) {
      // Create nodes and edges
      const sourceNode = {
        id: source,
        data: { label: source },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
      };
      const targetNode = {
        id: target,
        data: { label: target },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
      };

      nodes.push(sourceNode);
      nodes.push(targetNode);

      edges.push({
        id: `${source}-${target}`,
        source: source,
        target: target,
      });
    }
  });

  return {
    nodes: Array.from(new Set(nodes.map(JSON.stringify))).map(JSON.parse),
    edges,
  };
};

const TextToFlow = () => {
  const [textInput, setTextInput] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleTextChange = (event) => setTextInput(event.target.value);

  const generateFlow = () => {
    const { nodes, edges } = parseTextToFlowData(textInput);
    setNodes(nodes);
    setEdges(edges);
  };

  return (
    <div style={{ height: 500 }}>
      <textarea
        value={textInput}
        onChange={handleTextChange}
        placeholder="Enter text to create flow..."
      />
      <button onClick={generateFlow}>Generate Flow</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
};

export default TextToFlow;
