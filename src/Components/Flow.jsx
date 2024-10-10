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

const nodeTypes = {
  custom: CustomNode,
};

const Flow = ({ addNode, selectedNode, setSelectedNode, deleteNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connections, setConnections] = useState([]); // State to hold all connection details

  const onConnect = useCallback(
    (params) => {
      // Create the edge first
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);

      // Find the source and target nodes by their IDs
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      // Prepare the connection details
      const connectionDetails = {
        edgeId: newEdge[0].id, // ID of the newly created edge
        source: {
          title: sourceNode.data.name,
          position: sourceNode.position,
        },
        target: {
          title: targetNode.data.name,
          position: targetNode.position,
        },
      };

      // Update the connections state
      setConnections((prevConnections) => [
        ...prevConnections,
        connectionDetails,
      ]);
      console.log("All Connections:", [...connections, connectionDetails]); // Log the updated connections
    },
    [edges, nodes, connections] // Add connections to dependencies
  );

  // Pass the addNode function to allow adding nodes dynamically
  const handleAddNode = useCallback(
    (data) => {
      const newNode = {
        id: (nodes.length + 1).toString(),
        type: "custom",
        data: { name: data.title, image: data.image },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  // Handle node click to track the selected node
  const onNodeClick = (event, node) => {
    setSelectedNode(node); // Set the selected node
  };

  // Handle node deletion
  const handleDeleteNode = () => {
    const nodeIdToDelete = selectedNode.id;

    // Remove the selected node
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));

    // Remove edges connected to the deleted node
    const edgesToDelete = edges.filter(
      (edge) => edge.source === nodeIdToDelete || edge.target === nodeIdToDelete
    );
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
      )
    );

    // Update connections by filtering out those involving the deleted node
    setConnections((prevConnections) =>
      prevConnections.filter(
        (connection) =>
          connection.source.title !== selectedNode.data.name &&
          connection.target.title !== selectedNode.data.name
      )
    );

    setSelectedNode(null); // Clear selected node after deletion
  };

  addNode.current = handleAddNode; // Set the addNode function via ref
  deleteNode.current = handleDeleteNode; // Set deleteNode function via ref

  return (
    <ReactFlowProvider>
      <div style={{ height: "100%", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick} // Track node clicks
          nodeTypes={nodeTypes}
          className="bg-teal-50"
          defaultZoom={0.75} // Set default zoom to 75%
          zoomOnPinch={true} // Enable zoom on pinch gestures
          zoomOnDoubleClick={false} // Disable zoom on double click
          fitView={false}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      {/* Display current connections in JSON format */}
    </ReactFlowProvider>
  );
};

export default Flow;
