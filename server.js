const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;


// ---------------- ROOT
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 AutoDL API Online</h2>
    <p>👤 Author: SUJON-BOSS</p>
  `);
});


// ---------------- STATUS
app.get("/status", (req, res) => {
  res.json({ status: "online" });
});


// ---------------- 🔥 BOT MODE (JSON RETURN)
app.get("/api/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: "No URL" });

  const fileName = `video_${Date.now()}.mp4`;

  exec(`yt-dlp -f best -o "${fileName}" "${url}"`, (err) => {
    if (err) {
      return res.json({ error: "Download failed" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/file/${fileName}`;

    res.json({
      status: true,
      data: {
        video: fileUrl
      }
    });
  });
});


// ---------------- 🔥 BROWSER MODE (DIRECT DOWNLOAD)
app.get("/download", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("No URL");

  const fileName = `video_${Date.now()}.mp4`;

  exec(`yt-dlp -f best -o "${fileName}" "${url}"`, (err) => {
    if (err) return res.send("Download failed");

    res.download(fileName, () => {
      fs.unlink(fileName, () => {});
    });
  });
});


// ---------------- STATIC FILE SERVER
app.use("/file", express.static(path.join(__dirname)));


// ---------------- START
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
