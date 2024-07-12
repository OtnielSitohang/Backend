const Lapangan = require('../models/Lapangan');
const fs = require('fs');
const path = require('path');


const getAllLapangan = (req, res) => {
    Lapangan.getAll((err, lapangan) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(lapangan);
    })
};

const createLapangan = (req, res) => {
    const { jenis_lapangan_id, namaLapangan, gambarLapangan, hargaLapangan } = req.body;
  
    // Tentukan harga dan gambar berdasarkan jenis_lapangan_id
    let harga;
    let gambarBase64;
  
    switch (jenis_lapangan_id) {
      case 1: // Existing jenis_lapangan_id for keramik
        harga = 100000;
        gambarBase64 = getBase64FromPath('assets/keramik.jpg');
        break;
      case 2: // Existing jenis_lapangan_id for karpet
        harga = 150000;
        gambarBase64 = getBase64FromPath('assets/karpet.jpg');
        break;
      default: // Handling jenis_lapangan_id for new jenis lapangan
        // Assume gambarLapangan is already in base64 format
        harga = hargaLapangan;
        gambarBase64 = gambarLapangan;
        break;
    }
  
    // Buat lapangan baru
    Lapangan.create(jenis_lapangan_id, namaLapangan, gambarBase64, harga, (err, insertId) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'Lapangan created successfully', id: insertId });
    });
  };
  
  // Fungsi untuk mengambil base64 dari path gambar
  const getBase64FromPath = (imagePath) => {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      return imageBuffer.toString('base64');
    } catch (err) {
      throw new Error('Error reading image file');
    }
  };
  
  module.exports = createLapangan;
  

module.exports = {
  getAllLapangan,
  createLapangan,
};
