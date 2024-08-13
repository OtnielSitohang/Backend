const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { register, updateProfile, changePassword } = require('../controllers/penggunaController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Endpoint untuk login
router.post('/login', authController.login);

// Endpoint untuk register
router.post('/register', upload.single('foto_base64'), register);

// Endpoint untuk mengubah password
router.put('/ubahPassword/:id', changePassword);

// Endpoint untuk update profil pengguna
router.put('/pengguna/:id', updateProfile);

module.exports = router;
