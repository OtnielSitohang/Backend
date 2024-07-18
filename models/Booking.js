const db = require('../config');

class Booking {
  constructor(pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, bukti_pembayaran, status_konfirmasi, voucher_id) {
    this.pengguna_id = pengguna_id;
    this.lapangan_id = lapangan_id;
    this.jenis_lapangan_id = jenis_lapangan_id;
    this.tanggal_booking = tanggal_booking;
    this.tanggal_penggunaan = tanggal_penggunaan;
    this.sesi = sesi;
    this.bukti_pembayaran = bukti_pembayaran;
    this.status_konfirmasi = status_konfirmasi;
    this.voucher_id = voucher_id;
  }

  static create(newBooking, result) {
    db.query("INSERT INTO booking SET ?", newBooking, (err, res) => {
      if (err) {
        console.error("Error creating Booking: ", err);
        result(err, null);
        return;
      }
      console.log("Booking created successfully.");
      result(null, { id: res.insertId, ...newBooking });
    });
  }

  static findById(bookingId, result) {
    const query = `
    SELECT b.*, p.nama_lengkap AS nama_pengguna, l.nama_lapangan, l.gambar_base64, jl.nama AS jenis_lapangan
    FROM booking b
    INNER JOIN pengguna p ON b.pengguna_id = p.id
    INNER JOIN lapangan l ON b.lapangan_id = l.id
    INNER JOIN jenis_lapangan jl ON b.jenis_lapangan_id = jl.id
  `;
    db.query(query, [bookingId], (err, res) => {
      if (err) {
        console.error("Error retrieving Booking with id ", bookingId, ": ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    });
  }
  
  
  static getAll(result) {
    const query = `
      SELECT b.*, p.nama_lengkap AS nama_pengguna, l.nama_lapangan, l.gambar_base64, jl.nama AS jenis_lapangan
      FROM booking b
      INNER JOIN pengguna p ON b.pengguna_id = p.id
      INNER JOIN lapangan l ON b.lapangan_id = l.id
      INNER JOIN jenis_lapangan jl ON b.jenis_lapangan_id = jl.id
    `;
    db.query(query, (err, res) => {
      if (err) {
        console.error("Error retrieving bookings: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  }

  static updateStatusKonfirmasi(id, result) {
    db.query(
      "UPDATE booking SET status_konfirmasi = 1 WHERE id = ?",
      [id],
      (err, res) => {
        if (err) {
          console.log("Error updating status_konfirmasi: ", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Not found Booking with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("Updated booking: ", { id: id, status_konfirmasi: 1 });
        result(null, { id: id, status_konfirmasi: 1 });
      }
    );
  }

  static async getBookings(filters) {
    const { tanggal_penggunaan, jenis_lapangan_id, status_konfirmasi } = filters;

    let query = `
      SELECT b.*, p.nama_lengkap AS nama_pengguna, l.nama_lapangan, l.gambar_base64, jl.nama AS jenis_lapangan
      FROM booking b
      INNER JOIN pengguna p ON b.pengguna_id = p.id
      INNER JOIN lapangan l ON b.lapangan_id = l.id
      INNER JOIN jenis_lapangan jl ON b.jenis_lapangan_id = jl.id
      WHERE 1=1
    `;
    
    if (tanggal_penggunaan) {
      query += ` AND b.tanggal_penggunaan = '${tanggal_penggunaan}'`;
    }
    
    if (jenis_lapangan_id) {
      query += ` AND b.jenis_lapangan_id = ${jenis_lapangan_id}`;
    }
    
    if (status_konfirmasi) {
      query += ` AND b.status_konfirmasi = ${status_konfirmasi}`;
    }
    
    query += " ORDER BY b.tanggal_penggunaan ASC, b.jenis_lapangan_id ASC, b.status_konfirmasi ASC";
    
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Booking;