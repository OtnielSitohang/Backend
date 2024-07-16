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
    db.query("SELECT * FROM booking WHERE id = ?", [bookingId], (err, res) => {
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
    db.query("SELECT * FROM booking", (err, res) => {
      if (err) {
        console.error("Error retrieving bookings: ", err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  }
}

module.exports = Booking;
