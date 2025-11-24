const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");

const config = require("./config.json");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(bodyParser.json());

const buffers = new Map();
function getISTDateString() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  return ist.toISOString().split("T")[0];
}
function storePoint(data) {
  const { vehicle_id, lat, lon, timestamp } = data;
  if (!buffers.has(vehicle_id)) buffers.set(vehicle_id, []);
  buffers.get(vehicle_id).push({ lat, lon, timestamp });
}

app.post("/track", (req, res) => {
  const body = req.body;

  if (!body.vehicle_id || !body.lat || !body.lon || !body.timestamp) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  storePoint(body);
  io.emit("position", body);

  res.json({ ok: true });
});

function writeGeoJSON() {
  const dateStr = getISTDateString();
  const filePath = path.join(config.persistDir, `${dateStr}.json`);

  const features = [];

  for (const [vehicle_id, pts] of buffers.entries()) {
    pts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    pts.forEach((p) => {
      features.push({
        type: "Feature",
        properties: { vehicle_id, timestamp: p.timestamp },
        geometry: {
          type: "Point",
          coordinates: [p.lon, p.lat],
        },
      });
    });
    features.push({
      type: "Feature",
      properties: { vehicle_id, path: true },
      geometry: {
        type: "LineString",
        coordinates: pts.map((p) => [p.lon, p.lat]),
      },
    });
  }

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  fs.writeFileSync(filePath, JSON.stringify(geojson, null, 2));
  console.log("GeoJSON updated:", filePath);
}
setInterval(writeGeoJSON, config.writeIntervalSeconds * 1000);
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
