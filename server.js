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
*/
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let locations = {};
let activeUsers = new Set();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

/* TRACK PAGE */
app.get("/track", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/google_map.html"));
});

/* ADMIN PAGE */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

/* CREATE TRACK LINK */
app.post("/create-link", (req, res) => {
  const token = Math.random().toString(36).slice(2, 10);
  res.json({ link: `/track?token=${token}` });
});

/* RECEIVE LOCATION */
app.post("/send-location", (req, res) => {
  const { token, lat, lng, acc } = req.body;
  if (!token) return res.sendStatus(400);

  locations[token] = {
    lat,
    lng,
    acc,
    time: Date.now()
  };

  activeUsers.add(token);
  console.log("📍 Location:", token, lat, lng, acc);
  res.sendStatus(200);
});

/* ADMIN FETCH */
app.get("/get-all-locations", (req, res) => {
  res.json(locations);
});

/* CLEAN DISCONNECTED USERS */
setInterval(() => {
  const now = Date.now();
  for (const t in locations) {
    if (now - locations[t].time > 60000) {
      delete locations[t];
      activeUsers.delete(t);
    }
  }
}, 15000);

/* START SERVER */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
