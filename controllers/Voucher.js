const db = require('../config');
exports.getAllVouchers = (req, res) => {
    const query = 'SELECT * FROM voucher';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching vouchers: ' + err.stack);
        return res.status(500).json({ message: 'Server error' });
      }
  
      res.status(200).json(results);
    });
  };
  
  exports.addVoucher = (req, res) => {
    const { kode, diskon, status, tanggal_selesai, batas_penggunaan } = req.body;
    const tanggal_mulai = new Date().toISOString().slice(0, 10); // Set tanggal mulai sebagai tanggal hari ini
  
    if (!kode || !diskon || !status || !tanggal_selesai || batas_penggunaan === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    const query = `
      INSERT INTO voucher (kode, diskon, status, tanggal_mulai, tanggal_selesai, batas_penggunaan)
      VALUES (?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [kode, diskon, status, tanggal_mulai, tanggal_selesai, batas_penggunaan], (err, results) => {
      if (err) {
        console.error('Error adding voucher: ' + err.stack);
        return res.status(500).json({ message: 'Server error' });
      }
  
      res.status(201).json({ message: 'Voucher added successfully', voucherId: results.insertId });
    });
  };