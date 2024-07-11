const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { createLapangan, getAllLapangan } = require('../controllers/LapanganController');

// Endpoint untuk login
router.post('/login', authController.login);
router.post('/createLapangann', createLapangan)
router.get('/getLapangan', getAllLapangan)

module.exports = router;
