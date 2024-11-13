import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import config from "../util/ComponentConfig"; // Import config
import ConfigureModal from "../Components/ConfigModal"; // Import the modal
import { main } from "../util/groqCloud"; // Import the main function
// import { main } from "../util/temp"; // Import the main function

const drawerWidth = 240;

const Sidebar = ({ addNode, selectedNode, deleteNode, setNodes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [output, setOutput] = useState(""); // State to store the output

  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handler for Calculate button click
  // const handleCalculateClick = async () => {
  //   try {
  //     // Trigger the main function and capture the output
  //     const result = await main("Your input value here");
  //     // Store the output in state
  //     setOutput(result);
  //   } catch (error) {
  //     console.error("Error during calculation:", error);
  //   }
  // };

  const handleCalculateClick = async () => {
    try {
      const inputValue = "Your JSON input here"; // Replace this with actual input data
      const result = await main(inputValue);
      console.log("Received response:", result);
      // Handle the result as needed (e.g., display in the UI)
    } catch (error) {
      console.error("Error during simulation:", error.message);
    }
  };

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />
        <Divider />

        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={handleConfigureClick}
              >
                Configure
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="error"
                disabled={!selectedNode}
                onClick={() => deleteNode.current()}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box sx={{ padding: 2 }}>
          {config.items.map((item) => (
            <Button
              key={item.id}
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
              }}
              onClick={() => addNode.current(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain",
                  marginRight: "20px",
                }}
              />
              <Typography variant="subtitle1" align="center">
                {item.title}
              </Typography>
            </Button>
          ))}
        </Box>

        <Divider />

        {/* Add the Calculate button */}
        <Box sx={{ padding: 2 }}>
          <Button
            id="calculate-btn"
            variant="contained"
            color="success"
            onClick={handleCalculateClick} // Calculate button triggers the main function
          >
            Calculate
          </Button>

          {/* Display the output below the Calculate button */}
          {output && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Output:</Typography>
              <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {JSON.stringify(output, null, 2)}
              </pre>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Configure Modal */}
      <ConfigureModal
        open={isModalOpen}
        onClose={handleModalClose}
        selectedNode={selectedNode}
        setNodes={setNodes} // Pass setNodes to ConfigModal
      />
    </>
  );
};

export default Sidebar;
