const express = require('express');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./route/authRoutes'); // Import route untuk autentikasi
const mainRoutes = require('./route/mainRoutes'); // Import route untuk fitur utama
const config = require('./config'); // Konfigurasi koneksi database

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "192.168.3.125";

// Middleware untuk menangani JSON dan URL-encoded data
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Middleware CORS
app.use(cors());

// Gunakan rute
app.use('/auth', authRoutes);
app.use('/api', mainRoutes); // Prefix untuk rute utama

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Jalankan server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
