// models/Lapangan.js

const db = require('../config');

class Lapangan {
  constructor(id, jenis_lapangan_id, namaLapangan, gambarLapangan, hargaLapangan, jenis_lapangan) {
    this.id = id;
    this.jenis_lapangan_id = jenis_lapangan_id;
    this.namaLapangan = namaLapangan;
    this.gambarLapangan = gambarLapangan;
    this.hargaLapangan = hargaLapangan;
    this.jenis_lapangan = jenis_lapangan; // Menambahkan properti jenis_lapangan
  }

  static getAll(callback) {
    const query = `
      SELECT
        lapangan.id,
        lapangan.jenis_lapangan_id,
        CASE
          WHEN lapangan.jenis_lapangan_id = 1 THEN 'Keramik'
          WHEN lapangan.jenis_lapangan_id = 2 THEN 'Karpet'
        END AS jenis_lapangan, -- Ubah urutan jenis lapangan
        lapangan.nama_lapangan,
        lapangan.gambar_base64 AS gambarLapangan, -- Ubah ke camelCase
        lapangan.harga
      FROM
        lapangan
    `;
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      const lapangans = results.map(row => {
        return new Lapangan(row.id, row.jenis_lapangan_id, row.nama_lapangan, row.gambarLapangan, row.harga, row.jenis_lapangan); // Menambahkan jenis_lapangan
      });
      callback(null, lapangans);
    });
  }

  static create(jenisLapanganId, namaLapangan, gambarLapangan, hargaLapangan, callback) {
    const query = 'INSERT INTO lapangan (jenis_lapangan_id, nama_lapangan, gambar_base64, harga) VALUES (?, ?, ?, ?)';
    db.query(query, [jenisLapanganId, namaLapangan, gambarLapangan, hargaLapangan], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result.insertId);
    });
  }
}

module.exports = Lapangan;
