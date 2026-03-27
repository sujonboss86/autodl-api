const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) return res.send("No URL provided");

  const cmd = `yt-dlp -o "video.%(ext)s" ${url}`;

  exec(cmd, (err) => {
    if (err) return res.send("Error downloading");

    const file = fs.readdirSync(".").find(f => f.startsWith("video."));
    if (!file) return res.send("File not found");

    res.download(file);
  });
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
