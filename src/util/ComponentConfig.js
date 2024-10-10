// config.js
const config = {
  fan: {
    type: "load",
    properties: {
      type: "DC",
      power: "36w",
    },
  },
  bulb: {
    type: "load",
    properties: {
      type: "DC",
      power: "24w",
    },
  },
  battery: {
    type: "battery",
    properties: {
      type: "Lion",
      voltageRating: "24v",
      capacity: "100Ah",
    },
  },
};

export default config;
