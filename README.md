# Vehicle Tracking Backend

## Project Summary
This project is a lightweight backend service that receives realtime GPS location updates from vehicle IoT units, broadcasts those updates to connected web clients using Socket.io, and writes a daily GeoJSON file every 5 seconds. Each GeoJSON file stores timestamped Point features and a LineString path for each vehicle, using IST-based daily filenames.

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
2. Create config file
bash
Copy code
cp config.example.json config.json
3. Create output directory
bash
Copy code
mkdir data
Run Commands
Start the backend server
bash
Copy code
npm start
Start the IoT simulator (in a separate terminal)
bash
Copy code
npm run sim
Open realtime WebSocket client
Open the HTML file in your browser:

Copy code
ws-client.html
