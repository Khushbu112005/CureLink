const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Get all appointments (Patients see their own, Doctors see theirs)
router.get('/', verifyToken, appointmentController.getAppointments);

// Book appointment (Only patients)
router.post('/book', verifyToken, verifyRole(['patient']), appointmentController.bookAppointment);

// Update status (Only doctors)
router.put('/:id/status', verifyToken, verifyRole(['doctor']), appointmentController.updateAppointmentStatus);

module.exports = router;
