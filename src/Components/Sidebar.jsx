import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import bulbImage from "../images/light-bulb.png";
import fanImage from "../images/fan.png";
import batteryImage from "../images/battery.png";
import switchImage from "../images/switch-off.png";

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

const Sidebar = ({ addNode }) => {
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
