import React from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import bulbImage from "../images/light-bulb.png";
import fanImage from "../images/fan.png";
import batteryImage from "../images/battery.png";
import switchImage from "../images/switch-off.png";

const drawerWidth = 240; // Sidebar width

const items = [
  {
    id: 1,
    title: "Bulb",
    image: bulbImage,
  },
  {
    id: 2,
    title: "Fan",
    image: fanImage,
  },
  {
    id: 3,
    title: "Battery",
    image: batteryImage,
  },
  {
    id: 4,
    title: "Switch",
    image: switchImage,
  },
];

const Sidebar = () => {
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
              flexDirection: "row", // Align items horizontally within the button
              alignItems: "center",
              justifyContent: "flex-start", // Ensure content starts from the left
              width: "100%", // Full width of sidebar
              padding: "10px", // Padding inside the button for better spacing
              marginBottom: "10px", // Spacing between buttons
            }}
            onClick={() => console.log(`${item.title} clicked!`)} // Handle click event
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "40px", // Optimal width for the image
                height: "40px", // Optimal height for the image
                objectFit: "contain", // Ensure image fits properly
                marginRight: "20px", // Space between image and text
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
