const Pengguna = require('../models/Pengguna');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const base64js = require('base64-js');
const db = require('../config');

// Fungsi untuk membaca dan mengonversi file ke base64
function fileToBase64(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64String = base64js.fromByteArray(fileData);
  return base64String;
}

exports.register = (req, res) => {
  const { username, password, nama_lengkap, tanggal_lahir, email, tempat_tinggal, role } = req.body;

  if (role !== 'admin' && role !== 'customer') {
    return res.status(400).json({ message: 'Role must be either "admin" or "customer"' });
  }
  
  // Mengonversi foto_base64 dari file ke base64 jika ada file yang diunggah
  const foto_base64 = req.file ? `data:${req.file.mimetype};base64,${fileToBase64(req.file.path)}` : null;

  // Hash password menggunakan bcrypt
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Buat instance Pengguna baru dengan base64 foto
    const newPengguna = new Pengguna(username, hashedPassword, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role);

    // Insert pengguna baru ke database
    const insertQuery = 'INSERT INTO Pengguna (username, password, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [newPengguna.username, newPengguna.passwordHash, newPengguna.nama_lengkap, newPengguna.foto_base64, newPengguna.tanggal_lahir, newPengguna.email, newPengguna.tempat_tinggal, newPengguna.role];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting new pengguna:', err);
        return res.status(500).json({ message: 'Failed to create new pengguna' });
      }

      // Hapus file yang sudah diunggah dari sistem file (opsional)
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      // Respons sukses dan data pengguna yang baru dibuat
      res.status(201).json({
        message: 'New pengguna created successfully',
        data: {
          id: result.insertId,
          username: newPengguna.username,
          nama_lengkap: newPengguna.nama_lengkap,
          email: newPengguna.email,
          tempat_tinggal: newPengguna.tempat_tinggal,
          tanggal_lahir: newPengguna.tanggal_lahir,
          role: newPengguna.role,
          foto_base64: newPengguna.foto_base64
        }
      });
    });
  });
};

exports.updateProfile = (req, res) => {
  const { foto_base64, email, tempat_tinggal, tanggal_lahir } = req.body;
  const { id } = req.params;

  // Construct the update query based on provided fields
  let updateFields = [];
  let updateValues = [];

  if (foto_base64) {
    updateFields.push('foto_base64 = ?');
    updateValues.push(foto_base64);
  }
  if (email) {
    updateFields.push('email = ?');
    updateValues.push(email);
  }
  if (tempat_tinggal) {
    updateFields.push('tempat_tinggal = ?');
    updateValues.push(tempat_tinggal);
  }
  if (tanggal_lahir) {
    updateFields.push('tanggal_lahir = ?');
    updateValues.push(tanggal_lahir);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  // Add id for WHERE clause
  updateValues.push(id);

  // Prepare the SQL update statement
  const updateQuery = `UPDATE Pengguna SET ${updateFields.join(', ')} WHERE id = ?`;

  // Execute the update query
  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Failed to update user profile' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes applied' });
    }

    // Retrieve updated user data from the database
    const retrieveQuery = 'SELECT id, username, nama_lengkap, email, tempat_tinggal, tanggal_lahir, role, foto_base64 FROM Pengguna WHERE id = ?';
    db.query(retrieveQuery, [id], (err, rows) => {
      if (err) {
        console.error('Error retrieving updated user profile:', err);
        return res.status(500).json({ message: 'Failed to retrieve updated user profile' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send updated user data in the response
      const updatedUser = rows[0];

      res.json({
        message: 'User profile updated successfully',
        data: updatedUser  // Send updated user data in the response
      });
    });
  });
};
