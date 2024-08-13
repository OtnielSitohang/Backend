const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bookField, getBookingById, getAllBookings, confirmBooking, getBookings , checkAvailability, getCustomer} = require('../controllers/BookingController');
const LapanganController = require('../controllers/LapanganController'); 
const JenisLapanganController = require('../controllers/JenisLapanganController');
const LaporanController = require('../controllers/LaporanController');
const DashboardController = require('../controllers/DashboardController');
const { getAllVouchers, addVoucher , updateVoucher} = require('../controllers/Voucher');

// Middleware untuk upload file
const upload = multer({ dest: 'uploads/' });

// Endpoint untuk lapangan
router.post('/lapangan', LapanganController.createLapangan);
router.get('/lapangan', LapanganController.getAllLapangan);

// Endpoint untuk jenis lapangan
router.get('/jenis-lapangan', JenisLapanganController.getAllJenisLapangan);
router.post('/jenis-lapangan', JenisLapanganController.createJenisLapangan);



// Endpoint untuk booking
router.post('/booking/book', bookField);
router.get('/getCustomer', getCustomer);
router.post('/lapangan/available', checkAvailability);
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
  }
);

// Laporan
router.get('/bookingspermonth', LaporanController.getBookingPerMonth);
router.get('/bookingsperjenislapangan', LaporanController.getBookingsPerJenisLapangan);
router.get('/revenuepermonth', LaporanController.getRevenuePerMonth);
router.get('/bookingsbystatus', LaporanController.getBookingsByStatus);
router.get('/newuserspermonth', LaporanController.getNewUsersPerMonth);
router.get('/bookingsperuser', LaporanController.getBookingsPerUser);

router.get('/users', DashboardController.getAllUsersWithCounts);
router.post('/resetpassword/:userId', DashboardController.resetPassword);



router.get('/getVoucher', getAllVouchers)
router.post('/addVoucher', addVoucher)
router.put('/voucher/:id', updateVoucher);

module.exports = router;
