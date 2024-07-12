// controllers/JenisLapanganController.js

const JenisLapangan = require('../models/JenisLapangan');

const createJenisLapangan = (req, res) => {
    console.log(req.body); // Tambahkan ini untuk melihat apa yang dikirimkan dari Postman
    const { nama } = req.body;
  
    // Pastikan nama tidak kosong
    if (!nama) {
      return res.status(400).json({ message: 'Nama jenis lapangan harus diisi' });
    }
  
    // Membuat objek jenis lapangan baru
    const newJenisLapangan = new JenisLapangan({ nama });
  
    // Menyimpan jenis lapangan baru ke dalam database
    JenisLapangan.create(newJenisLapangan, (err, jenisLapanganId) => {
      if (err) {
        console.error('Error creating jenis lapangan:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'Jenis lapangan created successfully', id: jenisLapanganId });
    });
  };
  
  



const getAllJenisLapangan = (req, res) => {
  JenisLapangan.getAll((err, jenisLapangan) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(jenisLapangan);
  });
};

module.exports = {
  createJenisLapangan,
  getAllJenisLapangan
};
