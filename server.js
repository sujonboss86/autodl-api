const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;


// -------------------------
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 AutoDL API Online</h2>
    <p>👤 Author: SUJON-BOSS</p>
    <p>✅ Server running for ${Math.floor(process.uptime())} seconds</p>
  `);
});


// -------------------------
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    author: "SUJON-BOSS",
    service: "AutoDL API",
    uptime: process.uptime()
  });
});


// -------------------------
// 🔥 DIRECT DOWNLOAD SYSTEM (NEW FIX)
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: "❌ No URL provided" });

  let fixedUrl = url.includes("shorts")
    ? url.replace("youtube.com/shorts/", "youtube.com/watch?v=")
    : url;

  const fileName = `video_${Date.now()}.mp4`;

  const cmd = `yt-dlp -f best --no-playlist -o "${fileName}" "${fixedUrl}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(err);
      return res.json({ error: "❌ Download failed" });
    }

    // 🔥 Send file directly to browser
    res.download(fileName, (downloadErr) => {
      if (downloadErr) {
        console.log(downloadErr);
      }

      // delete file after sending
      fs.unlink(fileName, () => {});
    });
  });
});


// -------------------------
app.get("/info", (req, res) => {
  res.json({
    endpoints: {
      download: "/download?url=VIDEO_LINK",
      status: "/status"
    },
    mode: "DIRECT DOWNLOAD ENABLED",
    supported: ["YouTube", "TikTok", "Facebook", "Instagram (limited)"]
  });
});


// -------------------------
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════╗
   🚀 Server Success
   👤 Author: SUJON-BOSS
   🌐 Port: ${PORT}
╚══════════════════════════════╝
  `);
});
