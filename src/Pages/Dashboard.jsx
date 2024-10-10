import React, { useRef } from "react";
import { Box } from "@mui/material";
import Flow from "../Components/Flow"; // Assuming Flow is in the same directory
import Sidebar from "../Components/Sidebar"; // Assuming Sidebar is in the same directory

const Dashboard = () => {
  const addNode = useRef(null); // Create a ref to store the addNode function

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
        {/* Pass the addNode ref to the Flow component */}
        <Flow addNode={addNode} />
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
        {/* Pass the addNode ref to the Sidebar component */}
        <Sidebar addNode={addNode} />
      </Box>
    </Box>
  );
};

export default Dashboard;
