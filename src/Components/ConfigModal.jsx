import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";

const ConfigModal = ({ open, onClose, selectedNode }) => {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    if (selectedNode) {
      // Initialize properties with the selected node's data
      setProperties(selectedNode.data.config.properties);
    }
  }, [selectedNode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProperties((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved Properties:", properties);
    // Implement your save logic here
    onClose(); // Close the modal after saving
  };

  const renderProperties = () => {
    switch (selectedNode.data.name.toLowerCase()) {
      case "fan":
      case "bulb":
        return (
          <>
            <TextField
              label="Type"
              name="type"
              value={properties.type || ""}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="AC">AC</MenuItem>
              <MenuItem value="DC">DC</MenuItem>
            </TextField>
            <TextField
              label="Power"
              name="power"
              value={properties.power || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );

      case "battery":
        return (
          <>
            <TextField
              label="Type"
              name="type"
              value={properties.type || ""}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="LiOn">LiOn</MenuItem>
              <MenuItem value="LiPo">LiPo</MenuItem>
            </TextField>
            <TextField
              label="Voltage Rating"
              name="voltageRating"
              value={properties.voltageRating || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Capacity"
              name="capacity"
              value={properties.capacity || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );

      default:
        return null; // Return null for unsupported types
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {selectedNode ? selectedNode.data.name : "Configure Node"}
      </DialogTitle>
      <DialogContent>
        {selectedNode && (
          <>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs>
                <Typography variant="body1">
                  ID: {selectedNode.data.id}
                </Typography>
              </Grid>
              <Grid item>
                <img
                  src={selectedNode.data.image}
                  alt={selectedNode.data.name}
                  style={{ width: "40px", height: "40px" }}
                />
              </Grid>
            </Grid>
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Properties:
            </Typography>
            {renderProperties()} {/* Render properties based on node type */}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigModal;
