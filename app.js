// Import modul Express
const express = require("express");

// Buat aplikasi Express
const app = express();

// Tentukan port yang akan digunakan
const port = 3000;

// Buat rute untuk halaman utama
app.get("/", (req, res) => {
  res.send("Halo, ini adalah aplikasi Node.js di localhost!");
});

// Jalankan server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
