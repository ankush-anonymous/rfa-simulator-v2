import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Flow from "../Components/Flow";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  const addNode = useRef(null); // Reference to addNode function
  const deleteNode = useRef(null); // Reference to deleteNode function
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node
  const [nodes, setNodes] = useState([]); // State to track all nodes

  useEffect(() => {
    // Clear localStorage on page load
    localStorage.clear();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // Full viewport height
      }}
    >
      {/* Flow component takes the remaining available space */}
      <Box
        sx={{
          flex: 1, // Flexible space, takes remaining width
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5", // Light background color for flow area
        }}
      >
        <Flow
          addNode={addNode}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          deleteNode={deleteNode}
          setNodes={setNodes} // Pass setNodes to Flow
        />
      </Box>

      {/* Sidebar component with a max width */}
      <Box
        sx={{
          width: "240px", // Max width of the sidebar
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid #ddd", // Optional border to separate sections
        }}
      >
        <Sidebar
          addNode={addNode}
          selectedNode={selectedNode}
          deleteNode={deleteNode}
          setNodes={setNodes} // Pass setNodes to Sidebar
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
