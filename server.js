// ====================
// server.js (Full AutoDL API - FIXED VERSION)
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
// Download route (ALL PLATFORM SUPPORT)
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: "❌ No URL provided" });

  // Shorts fix
  let fixedUrl = url.includes("shorts")
    ? url.replace("youtube.com/shorts/", "youtube.com/watch?v=")
    : url;

  // UNIVERSAL COMMAND (no mp4 force)
  const cmd = `yt-dlp -f best --no-playlist -g "${fixedUrl}"`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log("❌ ERROR:", err);
      console.log("❌ STDERR:", stderr);
      return res.json({ error: "❌ Download failed" });
    }

    if (!stdout) {
      return res.json({ error: "❌ No data returned" });
    }

    // multiple links handle
    const links = stdout.trim().split("\n");

    res.json({
      status: true,
      author: "SUJON-BOSS",
      data: {
        video: links[0] || null,
        audio: links[1] || null
      }
    });
  });
});


// -------------------------
// Info route (optional)
app.get("/info", (req, res) => {
  res.json({
    endpoints: {
      download: "/download?url=VIDEO_LINK",
      status: "/status"
    },
    supported: [
      "YouTube",
      "TikTok",
      "Facebook",
      "Instagram (limited)"
    ]
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
