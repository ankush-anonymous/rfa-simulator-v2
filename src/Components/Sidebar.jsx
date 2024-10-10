import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import config from "../util/ComponentConfig"; // Import config

const drawerWidth = 240;

const Sidebar = ({ addNode, selectedNode, deleteNode }) => {
  return (
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

      {/* Add "Configure" and "Delete" buttons */}
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedNode}
              onClick={() => console.log("Configure clicked!")}
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
            onClick={() => addNode.current(item)} // Use addNode ref to pass data
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
    </Drawer>
  );
};

export default Sidebar;
