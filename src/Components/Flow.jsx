import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import CustomNode from "./CustomNode";
import config from "../util/ComponentConfig";

const nodeTypes = {
  custom: CustomNode,
};

const Flow = ({
  addNode,
  selectedNode,
  setSelectedNode,
  deleteNode,
  jsonInput,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeCounts, setNodeCounts] = useState({}); // Track counts for each node type

  // Generate a sequential ID based on the node title (e.g., fan1, battery2)
  const generateNodeId = (title) => {
    const currentCount = nodeCounts[title] || 0;
    const newCount = currentCount + 1;
    setNodeCounts((prevCounts) => ({
      ...prevCounts,
      [title]: newCount,
    }));
    return `${title.toLowerCase()}${newCount}`;
  };

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: generateNodeId("edge"),
        type: "step",
      };
      setEdges((eds) => addEdge(newEdge, eds));

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      const connectionDetails = {
        edgeId: newEdge.id,
        source: {
          id: sourceNode.id,
          title: sourceNode.data.name,
          position: sourceNode.position,
        },
        target: {
          id: targetNode.id,
          title: targetNode.data.name,
          position: targetNode.position,
        },
      };

      setConnections((prevConnections) => [
        ...prevConnections,
        connectionDetails,
      ]);

      const flowData = JSON.parse(localStorage.getItem("flowData")) || {
        nodes: [],
        connections: [],
      };
      const updatedFlowData = {
        ...flowData,
        connections: [
          ...flowData.connections,
          { source: sourceNode.id, target: targetNode.id },
        ],
      };
      localStorage.setItem("flowData", JSON.stringify(updatedFlowData));
      console.log("All Connections:", [...connections, connectionDetails]);
    },
    [edges, nodes, connections]
  );

  const handleAddNode = useCallback(
    (data) => {
      const nodeConfig = config.items.find(
        (item) => item.title.toLowerCase() === data.title.toLowerCase()
      );

      if (!nodeConfig) {
        console.error(`No configuration found for node type: ${data.title}`);
        return;
      }

      const nodeId = generateNodeId(nodeConfig.title); // Generate custom id

      const newNode = {
        id: nodeId,
        type: "custom",
        data: {
          id: nodeId,
          name: nodeConfig.title,
          image: nodeConfig.image,
          config: nodeConfig.config,
        },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => [...nds, newNode]);
      saveNodeToLocalStorage(newNode);
    },
    [setNodes, nodeCounts]
  );

  const saveNodeToLocalStorage = (node) => {
    const flowData = JSON.parse(localStorage.getItem("flowData")) || {
      nodes: [],
      connections: [],
    };

    // Format the node data according to the required format
    const {
      id,
      data: { name, image, config },
    } = node;
    const formattedNode = { id, name, image, config };

    // Check if the node already exists in the stored data and update it, otherwise add it
    const existingNodeIndex = flowData.nodes.findIndex((n) => n.id === node.id);
    if (existingNodeIndex >= 0) {
      flowData.nodes[existingNodeIndex] = formattedNode;
    } else {
      flowData.nodes.push(formattedNode);
    }

    localStorage.setItem("flowData", JSON.stringify(flowData));
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedNodeId(node.id);
  };

  const handleDeleteNode = () => {
    const nodeIdToDelete = selectedNode.id;

    // Update nodes and edges by removing those associated with the deleted node
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
      )
    );

    // Remove connections associated with the deleted node
    setConnections((prevConnections) =>
      prevConnections.filter(
        (connection) =>
          connection.source.id !== nodeIdToDelete &&
          connection.target.id !== nodeIdToDelete
      )
    );

    // Update localStorage data
    const flowData = JSON.parse(localStorage.getItem("flowData"));
    if (flowData) {
      const updatedNodes = flowData.nodes.filter(
        (node) => node.id !== nodeIdToDelete
      );
      const updatedConnections = flowData.connections.filter(
        (connection) =>
          connection.source !== nodeIdToDelete &&
          connection.target !== nodeIdToDelete
      );
      const updatedData = {
        ...flowData,
        nodes: updatedNodes,
        connections: updatedConnections,
      };
      localStorage.setItem("flowData", JSON.stringify(updatedData));
    }

    setSelectedNode(null);
  };

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
    if (jsonInput) {
      // Ensure that jsonInput has nodes and connections as arrays
      const nodes = Array.isArray(jsonInput.nodes) ? jsonInput.nodes : [];
      const connections = Array.isArray(jsonInput.connections)
        ? jsonInput.connections
        : [];

      // Clear the flowData from localStorage when new jsonInput is detected
      localStorage.removeItem("flowData");

      // Clear the existing nodes and edges state before updating
      setNodes([]); // Clear existing nodes
      setEdges([]); // Clear existing edges

      // Process nodes
      nodes.forEach((jsonNode) => {
        handleAddNodeFromJson(jsonNode);
      });

      // Process connections
      const newEdges = connections.map((conn) => ({
        id: `${conn.source}-${conn.target}`,
        source: conn.source,
        target: conn.target,
        type: "step", // or any edge type you prefer
      }));

      // Update edges state with new edges
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);

      // After updating nodes and edges, update flowData in localStorage
      const updatedFlowData = {
        nodes: [...nodes], // use nodes from jsonInput
        connections: [...connections], // use connections from jsonInput
      };

      localStorage.setItem("flowData", JSON.stringify(updatedFlowData));
    }
  }, [jsonInput, handleAddNodeFromJson, setEdges]);

  addNode.current = handleAddNode;
  deleteNode.current = handleDeleteNode;

  return (
    <ReactFlowProvider>
      <div style={{ height: "100%", width: "100%" }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isSelected: node.id === selectedNodeId,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          className="bg-teal-50"
          defaultzoom={0.75}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          fitView={false}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default Flow;
