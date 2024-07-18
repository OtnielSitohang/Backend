const fs = require('fs');
const Booking = require('../models/Booking');

// Fungsi untuk membuat booking
exports.createBooking = (req, res) => {
  const { pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, status_konfirmasi, voucher_id } = req.body;

  // Konversi file yang diunggah ke base64
  const filePath = req.file.path;
  const fileData = fs.readFileSync(filePath);
  const bukti_pembayaran = fileData.toString('base64');

  // Hapus file setelah dikonversi ke base64
  fs.unlinkSync(filePath);

  const newBooking = new Booking(pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, bukti_pembayaran, status_konfirmasi, voucher_id);

  Booking.create(newBooking, (err, data) => {
    if (err) {
      console.error("Error creating Booking: ", err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Booking."
      });
    } else {
      res.send(data);
    }
  });
};

// Fungsi untuk mendapatkan booking berdasarkan ID
exports.getBookingById = (req, res) => {
  Booking.findById(req.params.bookingId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Booking with id ${req.params.bookingId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Booking with id " + req.params.bookingId
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Fungsi untuk mendapatkan semua booking
exports.getAllBookings = (req, res) => {
  Booking.getAll((err, data) => {
    if (err) {
      console.error("Error retrieving bookings: ", err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving bookings."
      });
    } else {
      res.send(data);
    }
  });
};

exports.confirmBooking = (req, res) => {
  Booking.updateStatusKonfirmasi(req.params.bookingId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Booking with id ${req.params.bookingId}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Booking with id " + req.params.bookingId
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.getBookings = async (req, res) => {
  try {
    const filters = {
      tanggal_penggunaan: req.query.tanggal_penggunaan,
      jenis_lapangan_id: req.query.jenis_lapangan_id,
      status_konfirmasi: req.query.status_konfirmasi,
    };
    
    const results = await Booking.getBookings(filters);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};