const mysql = require('mysql');
const fs = require('fs');

// Koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'skripsibadmin' // Ganti dengan nama database Anda
});

// Path ke file gambar
const keramikImagePath = 'assets/keramik.jpg';
const karpetImagePath = 'assets/karpet.jpg';

// Membaca gambar sebagai Buffer
const keramikImageBuffer = fs.readFileSync(keramikImagePath);
const karpetImageBuffer = fs.readFileSync(karpetImagePath);

// Mengonversi gambar ke base64
const keramikBase64 = keramikImageBuffer.toString('base64');
const karpetBase64 = karpetImageBuffer.toString('base64');

// Query untuk update ke dalam database
const updateQueryKeramik = 'UPDATE lapangan SET gambar_base64 = ? WHERE jenis_lapangan_id = 1';
const updateQueryKarpet = 'UPDATE lapangan SET gambar_base64 = ? WHERE jenis_lapangan_id = 2';

// Menjalankan query untuk memperbarui data ke dalam database
db.query(updateQueryKeramik, [keramikBase64], (err, result) => {
  if (err) {
    console.error('Error updating Keramik:', err);
    return;
  }
  console.log('Updated Keramik:', result.affectedRows);
});

db.query(updateQueryKarpet, [karpetBase64], (err, result) => {
  if (err) {
    console.error('Error updating Karpet:', err);
    return;
  }
  console.log('Updated Karpet:', result.affectedRows);
});

// Menutup koneksi setelah selesai
db.end();
