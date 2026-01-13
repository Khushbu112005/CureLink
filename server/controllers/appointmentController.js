const db = require('../config/db');

exports.getAppointments = async (req, res) => {
    try {
        let query = `
            SELECT a.id, a.date, a.time, a.status, a.notes,
                   u.name as patient_name, d.specialization, du.name as doctor_name
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            JOIN doctors doc ON a.doctor_id = doc.id
            JOIN users du ON doc.user_id = du.id
        `;
        let params = [];

        if (req.userRole === 'patient') {
            query += ' WHERE a.patient_id = ?';
            params.push(req.userId);
        } else if (req.userRole === 'doctor') {
            // Find doctor id for the user
            const [doctorRes] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.userId]);
            if (doctorRes.length === 0) return res.status(404).json({ message: 'Doctor profile not found' });
            query += ' WHERE a.doctor_id = ?';
            params.push(doctorRes[0].id);
        }

        query += ' ORDER BY a.date, a.time';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.bookAppointment = async (req, res) => {
    const { doctor_id, date, time, notes } = req.body;

    if (!doctor_id || !date || !time) {
        return res.status(400).json({ message: 'Please provide doctor, date and time' });
    }

    try {
        // Prevent double booking
        const [check] = await db.query(
            'SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND time = ?',
            [doctor_id, date, time]
        );

        if (check.length > 0) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, date, time, notes) VALUES (?, ?, ?, ?, ?)',
            [req.userId, doctor_id, date, time, notes]
        );

        // Mysql doesn't return the row. Return what we know + ID.
        res.status(201).json({
            id: result.insertId,
            patient_id: req.userId,
            doctor_id,
            date,
            time,
            notes,
            status: 'pending'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'cancelled', 'completed'

    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Verify doctor owns this appointment
        const [doctorRes] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.userId]);
        if (doctorRes.length === 0) return res.status(403).json({ message: 'Unauthorized' });

        const [appointment] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
        if (appointment.length === 0) return res.status(404).json({ message: 'Appointment not found' });

        if (appointment[0].doctor_id !== doctorRes[0].id) {
            return res.status(403).json({ message: 'Unauthorized to modify this appointment' });
        }

        await db.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, id]
        );

        // Fetch updated
        const [updated] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
        res.json(updated[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
