const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// Routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- MySQL CONNECTION ---------- */
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sakec@1234',
    database: process.env.DB_NAME || 'curelink'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
    } else {
        console.log('✅ MySQL connected successfully');
    }
});
/* ------------------------------------ */

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'CureLink API is running 🚀',
        database: 'MySQL Connected',
        port: PORT
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

// Server start
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
