const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const LapanganController = require('../controllers/LapanganController'); // Pastikan path dan nama file sesuai
const JenisLapanganController = require('../controllers/JenisLapanganController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Endpoint untuk login
router.post('/login', authController.login);

// Endpoint untuk lapangan
router.post('/createLapangan', LapanganController.createLapangan);
router.get('/getLapangan', LapanganController.getAllLapangan);

// Endpoint untuk jenis lapangan
router.get('/jenis-lapangan', JenisLapanganController.getAllJenisLapangan);
router.post('/jenis-lapangan', JenisLapanganController.createJenisLapangan);

module.exports = router;
