const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Choose upload directory (supports Render Disk)
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static(UPLOAD_DIR));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/files");
});

// List files
app.get("/files", (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).send("Error reading files.");
    const list = files.map(
      (f) =>
        `<li>
           <a href="/uploads/${f}" target="_blank">${f}</a>
           <a href="/download/${f}" class="download-btn">⬇️ Download</a>
         </li>`
    );
    res.send(`
      <h2>Uploaded Files</h2>
      <ul>${list.join("")}</ul>
      <a href="/">⬅ Back to Upload</a>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f7fb; padding: 40px; }
        ul { list-style: none; padding: 0; }
        li { background: #fff; margin-bottom: 8px; padding: 10px; border-radius: 8px; }
        a { text-decoration: none; margin-right: 10px; }
        .download-btn { background:#007bff;color:#fff;padding:5px 10px;border-radius:5px; }
        .download-btn:hover { background:#0056b3; }
      </style>
    `);
  });
});

// Download route
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filePath)) res.download(filePath, req.params.filename);
  else res.status(404).send("File not found!");
});

// Start server
app.listen(PORT, () =>
  console.log(` Server running on port ${PORT}`)
);
