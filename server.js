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
// Download route (direct stream)
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ No URL provided");

  const output = `video_${Date.now()}.%(ext)s`;
  const cmd = `yt-dlp -o "${output}" ${url}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ yt-dlp error:", error.message);
      return res.status(500).send("❌ Download failed: " + error.message);
    }

    // Find downloaded file
    const file = fs.readdirSync(".").find(f => f.startsWith("video_"));
    if (!file) return res.status(500).send("❌ File not found");

    // Direct download stream
    res.download(path.join(__dirname, file), file, (err) => {
      if (err) console.error(err);
      fs.unlinkSync(file); // cleanup after sending
    });
  });
});

// -------------------------
// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════╗
   🚀 AutoDL API Server Online
   👤 Author: SUJON-BOSS
   🌐 Port: ${PORT}
╚══════════════════════════════╝
  `);
});
