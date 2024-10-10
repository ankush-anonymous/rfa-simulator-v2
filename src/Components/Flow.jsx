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

  // Updated onConnect to use uuid for edge id
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: uuidv4(), // Generate unique id for edge
      };
      setEdges((eds) => addEdge(newEdge, eds));

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      const connectionDetails = {
        edgeId: newEdge.id, // ID of the newly created edge
        source: {
          title: sourceNode.data.name,
          position: sourceNode.position,
        },
        target: {
          title: targetNode.data.name,
          position: targetNode.position,
        },
      };

      setConnections((prevConnections) => [
        ...prevConnections,
        connectionDetails,
      ]);
      console.log("All Connections:", [...connections, connectionDetails]);
    },
    [edges, nodes, connections]
  );

  // Updated handleAddNode to use uuid for node id
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
          id: nodeId, // Add the id to the data object as well
          name: nodeConfig.title,
          image: nodeConfig.image,
          config: nodeConfig.config,
        },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setSelectedNodeId(node.id); // Store the selected node ID
  };

  const handleDeleteNode = () => {
    const nodeIdToDelete = selectedNode.id;

    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));

    const edgesToDelete = edges.filter(
      (edge) => edge.source === nodeIdToDelete || edge.target === nodeIdToDelete
    );
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete
      )
    );

    setConnections((prevConnections) =>
      prevConnections.filter(
        (connection) =>
          connection.source.title !== selectedNode.data.name &&
          connection.target.title !== selectedNode.data.name
      )
    );

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
              isSelected: node.id === selectedNodeId, // Pass isSelected prop to the node's data
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
