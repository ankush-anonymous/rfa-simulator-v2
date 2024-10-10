import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const drawerWidth = 240;

const items = [
  {
    id: 1,
    title: "Bulb",
    image:
      " https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535866/rfa-simulator/light-bulb_fw2try.png",
  },
  {
    id: 2,
    title: "Fan",
    image:
      "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535867/rfa-simulator/fan_uuidlu.png",
  },
  {
    id: 3,
    title: "Battery",
    image:
      "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/battery_cwuy11.png",
  },
  {
    id: 4,
    title: "Switch",
    image:
      "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/switch-off_v5zt3h.png",
  },
];

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
              disabled={!selectedNode} // Disable if no node is selected
              onClick={() => console.log("Configure clicked!")}
            >
              Configure
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="error"
              disabled={!selectedNode} // Disable if no node is selected
              onClick={() => deleteNode.current()}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box sx={{ padding: 2 }}>
        {items.map((item) => (
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
