const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const links = {};      // token -> true
const locations = {};  // token -> {lat,lng,time}

// Create tracking link
app.post("/create-link", (req, res) => {
  const token = uuid();
  links[token] = true;

  res.json({
    token,
    link: `https://your-frontend.netlify.app/track.html?token=${token}`
  });
});

// Receive user location
app.post("/send-location", (req, res) => {
  const { token, lat, lng } = req.body;

  if (!token || !lat || !lng) return res.status(400).json({ error: "Missing data" });
  if (!links[token]) return res.status(403).json({ error: "Invalid token" });

  locations[token] = { lat, lng, time: Date.now() };
  console.log("📍 Location received:", token, lat, lng);

  res.json({ success: true });
});

// Admin fetch all locations
app.get("/get-all-locations", (req, res) => {
  res.json(locations);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
