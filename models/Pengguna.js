const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config'); // Import db dari config

class Pengguna {
  constructor(username, passwordHash, namaLengkap, fotoBase64, tanggal_lahir, email, tempatTinggal, role) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.namaLengkap = namaLengkap;
    this.fotoBase64 = fotoBase64;
    this.tanggal_lahir = tanggal_lahir;
    this.email = email;
    this.tempatTinggal = tempatTinggal;
    this.role = role;
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM pengguna WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      const { id, username, password, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role } = results[0];
      const pengguna = new Pengguna(username, password, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role);
      pengguna.id = id;
      callback(null, pengguna);
    });
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM pengguna WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      const { username, password, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role } = results[0];
      const pengguna = new Pengguna(username, password, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role);
      pengguna.id = id;
      callback(null, pengguna);
    });
  }

  verifyPassword(password, callback) {
    console.log(`Verifying password: ${password} with hash: ${this.passwordHash}`);
    bcrypt.compare(password, this.passwordHash, (err, result) => {
      if (err) {
        return callback(err, false);
      }
      callback(null, result);
    });
  }

  generateJwtToken(secretKey, expiresIn) {
    return jwt.sign({ userId: this.id, role: this.role }, secretKey, { expiresIn });
  }

  updateProfile(profileData, callback) {
    const { fotoBase64, email, tanggal_lahir } = profileData;
    let updateFields = [];
    let updateValues = [];

    if (fotoBase64) {
      updateFields.push('foto_base64 = ?');
      updateValues.push(fotoBase64);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (tanggal_lahir) {
      updateFields.push('tanggal_lahir = ?');
      updateValues.push(tanggal_lahir);
    }

    if (updateFields.length === 0) {
      return callback(null, this); // No fields to update
    }

    updateValues.push(this.id); // Add id for WHERE clause
    const query = `UPDATE pengguna SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, updateValues, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (result.affectedRows === 0) {
        return callback(new Error('User not found or no changes applied'), null);
      }
      
      // Update object properties
      if (fotoBase64) {
        this.fotoBase64 = fotoBase64;
      }
      if (email) {
        this.email = email;
      }
      if (tanggal_lahir) {
        this.tanggal_lahir = tanggal_lahir;
      }

      callback(null, this);
    });
  }
}

module.exports = Pengguna;
