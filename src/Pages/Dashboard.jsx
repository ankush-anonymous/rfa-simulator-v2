import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Flow from "../Components/Flow";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  const addNode = useRef(null);
  const deleteNode = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [jsonInput, setJsonInput] = useState(null); // Store JSON input for Flow

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Flow
          addNode={addNode}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          deleteNode={deleteNode}
          setNodes={setNodes}
          jsonInput={jsonInput} // Pass JSON input to Flow
        />
      </Box>

      <Box
        sx={{
          width: "240px",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid #ddd",
        }}
      >
        <Sidebar
          addNode={addNode}
          selectedNode={selectedNode}
          deleteNode={deleteNode}
          setNodes={setNodes}
          setJsonInput={setJsonInput} // Function to update JSON input
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
