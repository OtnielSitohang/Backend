const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const Booking = require('../models/Booking');
const db = require('../config'); 


// Fungsi untuk membuat booking
exports.bookField = async (req, res) => {
  try {
    // Destructure data from request body
    const { pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, foto_base64, harga, voucher_id } = req.body;

    // Insert booking with voucher_id
    const bookingQuery = `
      INSERT INTO booking (pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, foto_base64, harga, status_konfirmasi, voucher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
    `;

    // Set default value for voucher_id if not provided
    const bookingValues = [pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, foto_base64, harga, voucher_id || null];

    await db.query(bookingQuery, bookingValues);

    res.status(201).json({ success: true, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
  }
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

// Fungsi untuk mengonfirmasi booking dan mengirimkan invoice
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

// Fungsi untuk mendapatkan booking dengan filter
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


exports.checkAvailability = async (req, res) => {
  try {
    const { jenis_lapangan_id, tanggal_penggunaan, sesi } = req.body;

    // Query untuk mengecek ketersediaan lapangan
    const query = `
      SELECT id, nama_lapangan, harga
      FROM lapangan
      WHERE jenis_lapangan_id = ? 
        AND id NOT IN (
          SELECT lapangan_id
          FROM booking
          WHERE jenis_lapangan_id = ?
            AND tanggal_penggunaan = ?
            AND sesi = ?
        )
    `;
    db.query(query, [jenis_lapangan_id, jenis_lapangan_id, tanggal_penggunaan, sesi], (error, results) => {
      if (error) {
        console.error('Error checking field availability:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      
      // Menyusun data lapangan yang tersedia dengan harga
      const lapanganAvailable = results.map(({ id, nama_lapangan, harga }) => ({
        id,
        nama_lapangan,
        harga
      }));
      
      res.status(200).json(lapanganAvailable);
    });
  } catch (error) {
    console.error('Error checking field availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Fungsi untuk membuat booking
exports.bookField = async (req, res) => {
  try {
    const { pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, foto_base64, harga, voucher_id } = req.body;

    // Query untuk melakukan booking dengan data yang diterima dari request body
    const query = `
      INSERT INTO booking (pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, bukti_pembayaran, harga, status_konfirmasi, voucher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
    `;

    const values = [pengguna_id, lapangan_id, jenis_lapangan_id, tanggal_booking, tanggal_penggunaan, sesi, foto_base64, harga, voucher_id || null];

    // Jalankan query dengan data yang diterima
    await db.query(query, values);

    res.status(201).json({ success: true, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
  }
};





// Function to get all users with role 'customer'
exports.getCustomer = (req, res) => {
  db.query(
    'SELECT id, username, nama_lengkap, email FROM pengguna WHERE role = ?',
    ['customer'],
    (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err); // Log error untuk debugging
        return res.status(500).json({ message: 'Failed to fetch users' }); // Kirim respons error
      }

      // Kirim hasil query sebagai JSON
      res.status(200).json({
        users: rows
      });
    }
  );
};




