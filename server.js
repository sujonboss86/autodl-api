// ====================
// server.js (API + download)
// ====================
const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------
// Download route (direct stream)
// -------------------------
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("No URL provided");

  const output = `video_${Date.now()}.%(ext)s`;
  const cmd = `yt-dlp -o "${output}" ${url}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) return res.status(500).send("Download failed: " + error.message);

    const file = fs.readdirSync(".").find(f => f.startsWith("video_"));
    if (!file) return res.status(500).send("File not found");

    // Direct download stream
    res.download(path.join(__dirname, file), file, (err) => {
      if (err) console.error(err);
      fs.unlinkSync(file); // clean up after sending
    });
  });
});

// -------------------------
// Start server
// -------------------------
app.listen(PORT, () => console.log(`✅ AutoDL API running on port ${PORT}`));
