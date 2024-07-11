const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config'); // Import db dari config

class Pengguna {
  constructor(username, passwordHash, namaLengkap, fotoBase64, tanggalLahir, email, tempatTinggal, role) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.namaLengkap = namaLengkap;
    this.fotoBase64 = fotoBase64;
    this.tanggalLahir = tanggalLahir;
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
}

module.exports = Pengguna;
