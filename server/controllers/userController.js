const db = require('../config/db');

exports.getAllDoctors = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.id, u.name, d.specialization, d.availability
            FROM doctors d
            JOIN users u ON d.user_id = u.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, name, email FROM users WHERE role = 'patient'
        `);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
