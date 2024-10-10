const config = {
  items: [
    {
      id: 1,
      title: "Bulb",
      image:
        "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535866/rfa-simulator/light-bulb_fw2try.png",
      config: {
        type: "load",
        properties: {
          type: "DC",
          power: "24w",
        },
      },
    },
    {
      id: 2,
      title: "Fan",
      image:
        "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535867/rfa-simulator/fan_uuidlu.png",
      config: {
        type: "load",
        properties: {
          type: "DC",
          power: "36w",
        },
      },
    },
    {
      id: 3,
      title: "Battery",
      image:
        "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/battery_cwuy11.png",
      config: {
        type: "battery",
        properties: {
          type: "Lion",
          voltageRating: "24v",
          capacity: "100Ah",
        },
      },
    },
    {
      id: 4,
      title: "Switch",
      image:
        "https://res.cloudinary.com/dsx8eh1hj/image/upload/v1728535864/rfa-simulator/switch-off_v5zt3h.png",
      config: {
        type: "control",
        properties: {},
      },
    },
  ],
};

export default config;
