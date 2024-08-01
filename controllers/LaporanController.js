const db = require('../config'); // Pastikan Anda mengatur koneksi database di sini

// Fungsi untuk mendapatkan jumlah booking per bulan
exports.getBookingPerMonth = (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(tanggal_booking, '%Y-%m') as bulan,
      COUNT(*) as jumlah_booking
    FROM booking
    GROUP BY bulan
    ORDER BY bulan;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings per month:', err);
      return res.status(500).json({ message: 'Failed to fetch bookings per month' });
    }
    res.status(200).json(results);
  });
};

// Fungsi untuk mendapatkan jumlah booking per jenis lapangan
exports.getBookingsPerJenisLapangan = (req, res) => {
  const query = `
    SELECT 
      jl.nama as jenis_lapangan,
      COUNT(b.id) as jumlah_booking
    FROM booking b
    JOIN jenis_lapangan jl ON b.jenis_lapangan_id = jl.id
    GROUP BY jl.nama;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings per jenis lapangan:', err);
      return res.status(500).json({ message: 'Failed to fetch bookings per jenis lapangan' });
    }
    res.status(200).json(results);
  });
};

// Fungsi untuk mendapatkan pendapatan per bulan
exports.getRevenuePerMonth = (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(tanggal_booking, '%Y-%m') as bulan,
      SUM(harga) as total_pendapatan
    FROM booking
    GROUP BY bulan
    ORDER BY bulan;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching revenue per month:', err);
      return res.status(500).json({ message: 'Failed to fetch revenue per month' });
    }
    res.status(200).json(results);
  });
};

// Fungsi untuk mendapatkan jumlah pengguna baru per bulan
exports.getNewUsersPerMonth = (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as bulan,
      COUNT(*) as jumlah_pengguna_baru
    FROM pengguna
    GROUP BY bulan
    ORDER BY bulan;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching new users per month:', err);
      return res.status(500).json({ message: 'Failed to fetch new users per month' });
    }
    res.status(200).json(results);
  });
};

// Fungsi untuk mendapatkan jumlah booking berdasarkan status konfirmasi
exports.getBookingsByStatus = (req, res) => {
  const query = `
    SELECT 
      status_konfirmasi,
      COUNT(*) as jumlah_booking
    FROM booking
    GROUP BY status_konfirmasi;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings by status:', err);
      return res.status(500).json({ message: 'Failed to fetch bookings by status' });
    }
    res.status(200).json(results);
  });
};

// Fungsi untuk mendapatkan jumlah booking per pengguna
exports.getBookingsPerUser = (req, res) => {
  const query = `
    SELECT 
      p.username,
      COUNT(b.id) as jumlah_booking
    FROM booking b
    JOIN pengguna p ON b.pengguna_id = p.id
    GROUP BY p.username;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings per user:', err);
      return res.status(500).json({ message: 'Failed to fetch bookings per user' });
    }
    res.status(200).json(results);
  });
};
