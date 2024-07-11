// controllers/LapanganController.js

const Lapangan = require('../models/Lapangan');

const getAllLapangan = (req, res) => {
  Lapangan.getAll((err, lapangan) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(lapangan);
  });
};

const createLapangan = (req, res) => {
  const { jenisLapangan, namaLapangan, gambarLapangan, hargaLapangan } = req.body;
  let jenis_lapangan_id;

  // Tentukan jenis_lapangan_id berdasarkan jenisLapangan
  if (jenisLapangan.toLowerCase() === 'keramik') {
    jenis_lapangan_id = 1;
  } else if (jenisLapangan.toLowerCase() === 'karpet') {
    jenis_lapangan_id = 2;
  } else {
    return res.status(400).json({ message: 'Jenis lapangan tidak valid' });
  }

  Lapangan.create(jenis_lapangan_id, namaLapangan, gambarLapangan, hargaLapangan, (err, insertId) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'Lapangan created successfully', id: insertId });
  });
};

module.exports = {
  getAllLapangan,
  createLapangan,
};
