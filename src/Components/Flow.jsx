import React, { useCallback, useState } from "react";
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

const Flow = ({ addNode, selectedNode, setSelectedNode, deleteNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: uuidv4(), // Generate unique id for edge
      };

      // 1. Add the new edge to the state
      setEdges((eds) => addEdge(newEdge, eds));

      // 2. Find the source and target nodes from the existing nodes
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

      // 3. Update connections in state
      setConnections((prevConnections) => [
        ...prevConnections,
        connectionDetails,
      ]);

      // 4. Update localStorage with connection details
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

      // 5. Save the updated data to localStorage
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

      const nodeId = uuidv4(); // Generate unique id for node

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

      // Update nodes state
      setNodes((nds) => [...nds, newNode]);

      // Save node to localStorage
      saveNodeToLocalStorage(newNode);
    },
    [setNodes]
  );

  const saveNodeToLocalStorage = (node) => {
    // Get existing data from localStorage or initialize nodes and connections arrays
    const existingData = localStorage.getItem("flowData");
    let parsedData = existingData
      ? JSON.parse(existingData)
      : { nodes: [], connections: [] };

    // Ensure both nodes and connections arrays exist
    parsedData.nodes = parsedData.nodes || [];
    parsedData.connections = parsedData.connections || [];

    // Check if node already exists, if yes update it, otherwise add a new one
    const existingNodeIndex = parsedData.nodes.findIndex(
      (n) => n.id === node.id
    );

    if (existingNodeIndex >= 0) {
      // Update existing node
      parsedData.nodes[existingNodeIndex] = {
        id: node.id,
        name: node.data.name,
        image: node.data.image,
        config: node.data.config,
        position: node.position,
      };
    } else {
      // Add new node to the nodes array
      parsedData.nodes.push({
        id: node.id,
        name: node.data.name,
        image: node.data.image,
        config: node.data.config,
        position: node.position,
      });
    }

    // Save the updated data back to localStorage
    localStorage.setItem("flowData", JSON.stringify(parsedData));
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedNodeId(node.id); // Store the selected node ID
  };

  const handleDeleteNode = () => {
    const nodeIdToDelete = selectedNode.id;

    // 1. Remove node from state
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));

    // 2. Remove edges related to this node
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
      )
    );

    // 3. Remove connections involving this node
    setConnections((prevConnections) =>
      prevConnections.filter(
        (connection) =>
          connection.source.title !== selectedNode.data.name &&
          connection.target.title !== selectedNode.data.name
      )
    );

    // 4. Remove node from localStorage
    const flowData = JSON.parse(localStorage.getItem("flowData"));

    if (flowData) {
      const updatedNodes = flowData.nodes.filter(
        (node) => node.id !== nodeIdToDelete
      );
      const updatedData = {
        ...flowData,
        nodes: updatedNodes,
      };

      // Update the localStorage with the remaining nodes
      localStorage.setItem("flowData", JSON.stringify(updatedData));
    }

    // 5. Clear selected node
    setSelectedNode(null);
  };

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
