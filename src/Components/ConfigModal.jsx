import React, { useState, useEffect } from "react";
import { Box, Modal, TextField, Typography, Button } from "@mui/material";

const ConfigModal = ({ open, onClose, selectedNode, onSave }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      // Set the current config values when the modal opens
      setConfig(selectedNode.data.config.properties);
    }
  }, [selectedNode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(selectedNode.id, config);
    onClose(); // Close the modal after saving
  };

  if (!selectedNode) return null;

  const { id, data } = selectedNode;
  const { name, image, config: nodeConfig } = data;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Configure Node
        </Typography>

        <Box mt={2}>
          <Typography variant="body1">ID: {id}</Typography>
          <Typography variant="body1">Type: {nodeConfig.type}</Typography>

          <Box mt={2}>
            <img
              src={image}
              alt={name}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </Box>

          <Box mt={2}>
            <Typography variant="body1">Properties:</Typography>

            {/* Render input fields based on node type */}
            {nodeConfig.properties.type && (
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={config.type || ""}
                onChange={handleChange}
                margin="normal"
              />
            )}
            {nodeConfig.properties.power && (
              <TextField
                fullWidth
                label="Power"
                name="power"
                value={config.power || ""}
                onChange={handleChange}
                margin="normal"
              />
            )}
            {nodeConfig.properties.voltageRating && (
              <TextField
                fullWidth
                label="Voltage Rating"
                name="voltageRating"
                value={config.voltageRating || ""}
                onChange={handleChange}
                margin="normal"
              />
            )}
            {nodeConfig.properties.capacity && (
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                value={config.capacity || ""}
                onChange={handleChange}
                margin="normal"
              />
            )}
          </Box>

          <Box mt={3}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfigModal;
