// controllers/LapanganController.js

const Lapangan = require('../models/Lapangan');
const fs = require('fs');

const getAllLapangan = (req, res) => {
  Lapangan.getAll((err, lapangan) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(lapangan);
  });
};


const createLapangan = (req, res) => {
  const { jenis_lapangan_id, nama_lapangan, gambar_base64, harga } = req.body;

  // Jika jenis_lapangan_id 1 atau 2, gunakan data yang sudah ada
  if (jenis_lapangan_id == 1 || jenis_lapangan_id == 2) {
    let gambarPath;
    if (jenis_lapangan_id == 1) {
      gambarPath = 'assets/keramik.jpg'; // Path gambar keramik
    } else if (jenis_lapangan_id == 2) {
      gambarPath = 'assets/karpet.jpg'; // Path gambar karpet
    }

    // Konversi gambar menjadi base64
    const gambarData = fs.readFileSync(gambarPath);
    const gambarBase64 = gambarData.toString('base64');

    // Simpan ke database dengan data yang sudah ada
    Lapangan.create(jenis_lapangan_id, nama_lapangan, gambarBase64, harga, (err, insertId) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'Lapangan created successfully', id: insertId });
    });

  } else {
    // Pastikan semua data diperoleh
    if (!nama_lapangan || !gambar_base64 || !harga) {
      return res.status(400).json({ message: 'Semua data harus diisi' });
    }

    // Konversi gambar dari base64 ke buffer
    const gambarBuffer = Buffer.from(gambar_base64, 'base64');

    // Simpan data baru ke database
    Lapangan.create(jenis_lapangan_id, nama_lapangan, gambarBuffer, harga, (err, insertId) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'Lapangan created successfully', id: insertId });
    });
  }
};



module.exports = {
  getAllLapangan,
  createLapangan,
};
