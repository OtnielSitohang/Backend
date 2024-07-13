const Pengguna = require('../models/Pengguna');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Ganti dengan secret key yang lebih kompleks untuk produksi

const login = (req, res) => {
  const { username, password } = req.body;

  Pengguna.findByUsername(username, (err, pengguna) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!pengguna) {
      return res.status(404).json({ message: 'User not found' });
    }

    pengguna.verifyPassword(password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!result) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Ensure that pengguna data is valid before constructing response
      if (!pengguna || pengguna.username === null || pengguna.nama_lengkap === null || pengguna.foto_base64 === null || pengguna.tanggal_lahir === null || pengguna.email === null || pengguna.tempat_tinggal === null || pengguna.role === null) {
        console.error('Invalid pengguna data retrieved from database');
        return res.status(500).json({ message: 'Invalid user data' });
      }

      const token = pengguna.generateJwtToken(secretKey, '1h');
      res.json({
        message: 'Anda berhasil login',
        token: token,
        data: {
          id: pengguna.id,
          username: pengguna.username,
          nama_lengkap: pengguna.nama_lengkap,
          foto_base64: pengguna.foto_base64,
          tanggal_lahir: pengguna.tanggal_lahir,
          email: pengguna.email,
          tempat_tinggal: pengguna.tempat_tinggal,
          role: pengguna.role
        }
      });
    });
  });
};
module.exports = {
  login
};