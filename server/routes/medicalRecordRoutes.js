const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, medicalRecordController.getMedicalRecords);
router.post('/', verifyToken, verifyRole(['doctor']), medicalRecordController.addMedicalRecord);

module.exports = router;
