const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/doctors', verifyToken, userController.getAllDoctors);
router.get('/patients', verifyToken, verifyRole(['doctor', 'admin']), userController.getAllPatients);

module.exports = router;
