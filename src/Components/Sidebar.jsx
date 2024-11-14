import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import config from "../util/ComponentConfig"; // Import config
import ConfigureModal from "../Components/ConfigModal"; // Import the modal
import { main } from "../util/groqCloud"; // Import the main function

const drawerWidth = 240;

const Sidebar = ({
  addNode,
  selectedNode,
  deleteNode,
  setNodes,
  setJsonInput,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [output, setOutput] = useState(""); // State to store the output
  const [textInput, setTextInput] = useState(""); // State for text area input

  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCalculateClick = async () => {
    try {
      const flowData = localStorage.getItem("flowData");
      if (!flowData) {
        console.warn("No flow data found in localStorage.");
        return;
      }

      const parsedData = JSON.parse(flowData);
      const inputValue = {
        messages: [
          {
            role: "user",
            content: `Flow data details:\n${JSON.stringify(
              parsedData,
              null,
              2
            )}`,
          },
        ],
      };

      const result = await main(inputValue);
      const jsonMatch = result.match(/```([\s\S]*?)```/);
      const jsonOutput =
        jsonMatch && jsonMatch[1]
          ? jsonMatch[1].trim()
          : "No JSON output found";

      const outputData = JSON.parse(jsonOutput);

      // Update output state with the received data
      setOutput(outputData);
    } catch (error) {
      console.error("Error during calculation:", error.message);
    }
  };

  const handleImportClick = () => {
    try {
      const parsedJson = JSON.parse(textInput);
      setJsonInput(parsedJson); // Send JSON data to Dashboard
    } catch (error) {
      console.error("Invalid JSON format", error);
    }
  };

  const renderJson = (json) => {
    return JSON.stringify(json, null, 2)
      .split("\n")
      .map((line, index) => {
        // Add basic syntax coloring by checking for certain characters
        const isKey =
          line.includes(":") && !line.includes("{") && !line.includes("}");
        const isString = line.includes(":") && line.includes('"');
        const isNumber = !line.includes(":") && /\d/.test(line);

        return (
          <Typography
            key={index}
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              margin: 0,
              fontFamily: "'Courier New', monospace",
              backgroundColor: "#f5f5f5",
              padding: "5px",
              borderRadius: "5px",
              color: isKey
                ? "#3f51b5"
                : isString
                ? "#d32f2f"
                : isNumber
                ? "#388e3c"
                : "#000",
            }}
          >
            {line}
          </Typography>
        );
      });
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

        {/* Calculate Button, Text Area, and Import Button */}
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
            <Box sx={{ marginTop: 2, maxHeight: 300, overflowY: "auto" }}>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Output:
              </Typography>
              {/* Render the formatted JSON */}
              {renderJson(output)}
            </Box>
          )}

          {/* Text Area for input */}
          <TextField
            label="Input Data"
            placeholder="Enter JSON data here"
            multiline
            rows={4}
            fullWidth
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            sx={{ marginTop: 2 }}
          />

          {/* Import Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleImportClick}
            sx={{ marginTop: 1 }}
          >
            Import
          </Button>
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
