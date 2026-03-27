const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();


// ✅ Root route (UptimeRobot + browser test)
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 Server Success</h2>
    <p>👤 Author: SUJON-BOSS</p>
    <p>✅ API is running...</p>
  `);
});


// ✅ Status route (JSON check)
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    author: "SUJON-BOSS",
    service: "AutoDL API",
    uptime: process.uptime()
  });
});


// ✅ Download route (main system)
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) return res.send("❌ No URL provided");

  const cmd = `yt-dlp -o "video.%(ext)s" ${url}`;

  exec(cmd, (err) => {
    if (err) return res.send("❌ Error downloading");

    const file = fs.readdirSync(".").find(f => f.startsWith("video."));
    if (!file) return res.send("❌ File not found");

    res.download(file);
  });
});


// ✅ Render port fix
const PORT = process.env.PORT || 3000;


// ✅ Custom console design
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════╗
   🚀 Server Success
   👤 Author: SUJON-BOSS
   🌐 Port: ${PORT}
╚══════════════════════════════╝
  `);
});
