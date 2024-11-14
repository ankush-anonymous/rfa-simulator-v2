import React, { useCallback, useState, useRef, useEffect } from "react";
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
import { v4 as uuidv4 } from "uuid"; // Import uuid
import config from "../util/ComponentConfig";

const nodeTypes = {
  custom: CustomNode,
};

const Flow = ({
  addNode,
  selectedNode,
  setSelectedNode,
  deleteNode,
  connectionString,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Object to track counts of each node type for custom ID generation
  const nodeTypeCounts = useRef({});

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`, // Create a unique ID based on source and target
        type: "step",
      };

      // Add the new edge to the state
      setEdges((eds) => addEdge(newEdge, eds));

      // Add the connection in readable format to the local storage flowData
      const flowData = JSON.parse(localStorage.getItem("flowData")) || {
        nodes: [],
        connections: [],
      };

      // Format the connection string
      const connectionString = `${params.source} -> ${params.target}`;

      // Avoid duplicates by checking if the connection already exists
      if (!flowData.connections.includes(connectionString)) {
        flowData.connections.push(connectionString);
      }

      // Save updated flowData back to localStorage
      localStorage.setItem("flowData", JSON.stringify(flowData));

      console.log("Updated Connections:", flowData.connections);
    },
    [edges]
  );

  const handleAddNode = useCallback(
    (data) => {
      // Get the node configuration based on the title
      const nodeConfig = config.items.find(
        (item) => item.title.toLowerCase() === data.title.toLowerCase()
      );

      if (!nodeConfig) {
        console.error(`No configuration found for node type: ${data.title}`);
        return;
      }

      // Generate a unique ID based on title and increment count
      const nodeType = data.title.toLowerCase();
      nodeTypeCounts.current[nodeType] =
        (nodeTypeCounts.current[nodeType] || 0) + 1;
      const nodeId = `${nodeType}${nodeTypeCounts.current[nodeType]}`;

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
      saveNodeToLocalStorage(newNode); // Save to localStorage
    },
    [setNodes]
  );

  const saveNodeToLocalStorage = (node) => {
    const existingData = localStorage.getItem("flowData");
    let parsedData = existingData
      ? JSON.parse(existingData)
      : { nodes: [], connections: [] };

    parsedData.nodes = parsedData.nodes || [];
    parsedData.connections = parsedData.connections || [];

    const existingNodeIndex = parsedData.nodes.findIndex(
      (n) => n.id === node.id
    );

    if (existingNodeIndex >= 0) {
      parsedData.nodes[existingNodeIndex] = {
        id: node.id,
        name: node.data.name,
        image: node.data.image,
        config: node.data.config,
        position: node.position,
      };
    } else {
      parsedData.nodes.push({
        id: node.id,
        name: node.data.name,
        image: node.data.image,
        config: node.data.config,
        position: node.position,
      });
    }

    localStorage.setItem("flowData", JSON.stringify(parsedData));
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedNodeId(node.id);
  };

  const handleDeleteNode = () => {
    const nodeIdToDelete = selectedNode.id;

    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
      )
    );

    const flowData = JSON.parse(localStorage.getItem("flowData"));
    if (flowData) {
      const updatedNodes = flowData.nodes.filter(
        (node) => node.id !== nodeIdToDelete
      );
      localStorage.setItem(
        "flowData",
        JSON.stringify({ ...flowData, nodes: updatedNodes })
      );
    }

    setSelectedNode(null);
  };

  addNode.current = handleAddNode;
  deleteNode.current = handleDeleteNode;

  const handleParseConnections = useCallback(() => {
    const flowData = JSON.parse(localStorage.getItem("flowData")) || {
      nodes: [],
      connections: [],
    };

    // Split connections using a more robust method
    const parsedConnections = connectionString
      .split(" ")
      .filter((conn) => conn.trim()) // Remove empty strings
      .map((conn) => conn.split("->").map((str) => str.trim()));

    parsedConnections.forEach(([source, target]) => {
      let sourceNode = nodes.find((node) => node.id === source);
      let targetNode = nodes.find((node) => node.id === target);

      if (!sourceNode) {
        sourceNode = {
          id: source,
          type: "custom",
          data: { label: source },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
        setNodes((nds) => [...nds, sourceNode]);
      }

      if (!targetNode) {
        targetNode = {
          id: target,
          type: "custom",
          data: { label: target },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
        setNodes((nds) => [...nds, targetNode]);
      }

      const newEdge = {
        source,
        target,
        id: `${source}-${target}`,
        type: "step",
      };

      if (!flowData.connections.includes(`${source} -> ${target}`)) {
        flowData.connections.push(`${source} -> ${target}`);
        setEdges((eds) => addEdge(newEdge, eds));
      }
    });

    localStorage.setItem("flowData", JSON.stringify(flowData));
  }, [connectionString, nodes, setEdges, setNodes]);

  // Call handleParseConnections after importing new input
  useEffect(() => {
    if (connectionString) handleParseConnections();
  }, [connectionString, handleParseConnections]);

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
          defaultZoom={0.75}
          zoomOnPinch
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
