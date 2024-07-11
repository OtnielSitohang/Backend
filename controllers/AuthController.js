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

      const token = pengguna.generateJwtToken(secretKey, '1h');
      res.json({
        message: 'Anda berhasil login',
        token: token,
        data: {
          username: pengguna.username,
          namaLengkap: pengguna.namaLengkap,
          fotoBase64: pengguna.fotoBase64,
          tanggalLahir: pengguna.tanggalLahir,
          email: pengguna.email,
          tempatTinggal: pengguna.tempatTinggal,
          role: pengguna.role
        }
      });
    });
  });
};

module.exports = {
  login
};
