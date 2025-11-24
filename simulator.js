const axios = require("axios");
const config = require("./config.json");

const vehicles = ["veh-101", "veh-102", "veh-103"];

function randomDelta() {
  return (Math.random() - 0.5) * 0.001;
}

async function sendData(vehicle_id, lat, lon) {
  try {
    await axios.post(`http://localhost:${config.port}/track`, {
      vehicle_id,
      lat,
      lon,
      timestamp: new Date().toISOString(),
    });

    console.log("Sent:", vehicle_id);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

vehicles.forEach((vehicle) => {
  let lat = 17.436 + Math.random() * 0.01;
  let lon = 78.447 + Math.random() * 0.01;

  setInterval(() => {
    lat += randomDelta();
    lon += randomDelta();
    sendData(vehicle, lat, lon);
  }, 1000 + Math.random() * 4000); 
});
