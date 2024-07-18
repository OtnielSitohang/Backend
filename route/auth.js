const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const LapanganController = require('../controllers/LapanganController'); 
const JenisLapanganController = require('../controllers/JenisLapanganController');
const multer = require('multer');
const { createBooking, getBookingById, getAllBookings, confirmBooking, getBookings } = require('../controllers/BookingController');
const { register, updateProfile } = require('../controllers/penggunaController');

const upload = multer({ dest: 'uploads/' });

// Endpoint untuk login
router.post('/login', authController.login);

//Endpoint untuk Register
router.post('/register', upload.single('foto_base64'), register);
// Endpoint untuk update profil pengguna
router.put('/pengguna/:id', updateProfile);

// Endpoint untuk lapangan
router.post('/lapangan', LapanganController.createLapangan);
router.get('/lapangan', LapanganController.getAllLapangan);

// Endpoint untuk jenis lapangan
router.get('/jenis-lapangan', JenisLapanganController.getAllJenisLapangan);
router.post('/jenis-lapangan', JenisLapanganController.createJenisLapangan);



// Endpoint untuk booking
router.post('/booking', upload.single('bukti_pembayaran'), createBooking);
router.get('/booking/:bookingId', getBookingById);
router.get('/booking', getAllBookings);
router.put("/bookings/confirm/:bookingId", confirmBooking);
router.get('/bookings', async (req, res) => {
    try {
      const filters = {
        tanggal_penggunaan: req.query.tanggal_penggunaan,
        jenis_lapangan_id: req.query.jenis_lapangan_id,
        status_konfirmasi: req.query.status_konfirmasi,
      };
      
      const results = await getBookings(filters);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
