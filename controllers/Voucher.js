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

  // Mengupdate voucher yang sudah ada
  exports.updateVoucher = (req, res) => {
    const id = req.params.id
    const {  kode, diskon, status, tanggal_selesai, batas_penggunaan } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: 'Voucher ID is required' });
    }
  
    let updates = [];
    let values = [];
  
    if (kode) {
      updates.push('kode = ?');
      values.push(kode);
    }
    if (diskon !== undefined) {
      updates.push('diskon = ?');
      values.push(diskon);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (tanggal_selesai) {
      updates.push('tanggal_selesai = ?');
      values.push(tanggal_selesai);
    }
    if (batas_penggunaan !== undefined) {
      updates.push('batas_penggunaan = ?');
      values.push(batas_penggunaan);
    }
  
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
  
    values.push(id);
  
    const query = `
      UPDATE voucher 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
  
    console.log('Executing query:', query);
    console.log('With values:', values);
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error updating voucher: ' + err.stack);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Voucher not found' });
      }
  
      res.status(200).json({ message: 'Voucher updated successfully' });
    });
  };
  
  