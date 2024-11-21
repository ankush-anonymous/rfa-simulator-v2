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

import Card from "@mui/material/Card";
import AppsIcon from "@mui/icons-material/Apps"; // For Components button
import CircularProgress from "@mui/material/CircularProgress";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // For RFA AI button
import FileUploadIcon from "@mui/icons-material/FileUpload"; // For Import JSON button
import ChatInterface from "./ChatInterface";

const drawerWidth = 300;

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
  const [activeSection, setActiveSection] = useState("components"); // Default section
  const [isLoading, setIsLoading] = useState(false);
  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCalculateClick = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false); // Stop loading
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

  const handleBotResponse = (response) => {
    console.log("Received bot response:", response);

    setJsonInput(response);
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
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Components Button */}
            <Grid item xs={4}>
              <Button
                variant={
                  activeSection === "components" ? "contained" : "outlined"
                }
                color="primary"
                onClick={() => setActiveSection("components")}
              >
                <AppsIcon /> {/* Icon for Components */}
              </Button>
            </Grid>

            {/* RFA AI Button */}
            <Grid item xs={4}>
              <Button
                variant={activeSection === "rfaAI" ? "contained" : "outlined"}
                color="secondary"
                onClick={() => setActiveSection("rfaAI")}
              >
                <AutoAwesomeIcon /> {/* Icon for RFA AI */}
              </Button>
            </Grid>

            {/* Import JSON Button */}
            <Grid item xs={4}>
              <Button
                variant={
                  activeSection === "importJSON" ? "contained" : "outlined"
                }
                color="success"
                onClick={() => setActiveSection("importJSON")}
              >
                <FileUploadIcon /> {/* Icon for Import JSON */}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Conditional Rendering of Sections */}
        {activeSection === "components" && (
          <section id="component">
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
            {/* Calculate Button, Text Area, and Import Button */}
            <Box sx={{ padding: 2 }}>
              <Button
                id="calculate-btn"
                variant="contained"
                color="success"
                onClick={handleCalculateClick} // Trigger the main function
              >
                Calculate
              </Button>

              {/* Show a loading spinner if processing */}
              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <CircularProgress color="success" />
                </Box>
              )}

              {/* Display the output in a card when available */}
              {!isLoading && output && (
                <Card
                  sx={{ marginTop: 2, padding: 2, maxWidth: 400, boxShadow: 3 }}
                >
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    Output:
                  </Typography>
                  <Divider sx={{ marginBottom: 2 }} />
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Total Power Consumed:</strong>{" "}
                    {output.totalPowerConsumed} W
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Total Duration of System:</strong>{" "}
                    {output.totalDurationOfSystem} hours
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Remaining Battery Capacity:</strong>{" "}
                    {output.remainingBatteryCapacity} %
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Power Provided:</strong>{" "}
                    {output.totalPowerProvided} W
                  </Typography>
                </Card>
              )}
            </Box>
          </section>
        )}

        {activeSection === "rfaAI" && (
          <section id="rfaAI">
            <Box sx={{ padding: 2 }}>
              <ChatInterface onBotResponse={handleBotResponse} />
            </Box>
          </section>
        )}

        {activeSection === "importJSON" && (
          <section id="importJSON">
            <Box sx={{ padding: 2 }}>
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
          </section>
        )}
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
