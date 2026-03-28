// ====================
// server.js (Full AutoDL API)
// ====================
const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


// -------------------------
// Root route (UptimeRobot friendly)
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 AutoDL API Online</h2>
    <p>👤 Author: SUJON-BOSS</p>
    <p>✅ Server running for ${Math.floor(process.uptime())} seconds</p>
  `);
});


// -------------------------
// Status route (JSON)
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    author: "SUJON-BOSS",
    service: "AutoDL API",
    uptime: process.uptime()
  });
});


// -------------------------
// Download route
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("❌ No URL provided");

  // unique filename
  const fileName = `video_${Date.now()}.mp4`;
  const filePath = path.join(__dirname, fileName);

  // shorts fix
  let fixedUrl = url.includes("shorts")
    ? url.replace("youtube.com/shorts/", "youtube.com/watch?v=")
    : url;

  const cmd = `yt-dlp -f "best[ext=mp4]" --no-playlist "${fixedUrl}" -o "${filePath}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(err);
      return res.send("❌ Download error");
    }

    if (!fs.existsSync(filePath)) {
      return res.send("❌ File not found");
    }

    res.download(filePath, () => {
      fs.unlinkSync(filePath); // delete after send
    });
  });
});


// -------------------------
// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════╗
   🚀 Server Success
   👤 Author: SUJON-BOSS
   🌐 Port: ${PORT}
╚══════════════════════════════╝
  `);
});
