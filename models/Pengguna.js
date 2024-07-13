const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config'); // Import db dari config

class Pengguna {
  constructor(username, passwordHash, nama_lengkap, foto_base64, tanggal_lahir, email, tempat_tinggal, role, password) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.nama_lengkap = nama_lengkap;
    this.foto_base64 = foto_base64;
    this.tanggal_lahir = tanggal_lahir;
    this.email = email;
    this.tempat_tinggal = tempat_tinggal;
    this.role = role;
    this.password = password;
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
    const { foto_base64, email, tanggal_lahir } = profileData;
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
      if (foto_base64) {
        this.foto_base64 = foto_base64;
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
