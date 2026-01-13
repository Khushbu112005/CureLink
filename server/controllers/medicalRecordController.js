const db = require('../config/db');

exports.getMedicalRecords = async (req, res) => {
    try {
        let query = `
            SELECT mr.id, mr.diagnosis, mr.prescription, mr.visit_date,
                   u.name as patient_name, du.name as doctor_name
            FROM medical_records mr
            JOIN users u ON mr.patient_id = u.id
            LEFT JOIN doctors d ON mr.doctor_id = d.id
            LEFT JOIN users du ON d.user_id = du.id
        `;
        let params = [];

        if (req.userRole === 'patient') {
            query += ' WHERE mr.patient_id = ?';
            params.push(req.userId);
        } else if (req.userRole === 'doctor') {
            const { patient_id } = req.query;
            if (patient_id) {
                query += ' WHERE mr.patient_id = ?';
                params.push(patient_id);
            } else {
                const [doctorRes] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.userId]);
                if (doctorRes.length > 0) {
                    query += ' WHERE mr.doctor_id = ?';
                    params.push(doctorRes[0].id);
                }
            }
        }

        query += ' ORDER BY mr.visit_date DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addMedicalRecord = async (req, res) => {
    const { patient_id, diagnosis, prescription, visit_date } = req.body;

    if (!patient_id || !diagnosis || !prescription) {
        return res.status(400).json({ message: 'Please provide patient, diagnosis and prescription' });
    }

    try {
        const [doctorRes] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.userId]);
        if (doctorRes.length === 0) return res.status(403).json({ message: 'Only doctors can add records' });

        const doctor_id = doctorRes[0].id;

        const [result] = await db.query(
            'INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription, visit_date) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, diagnosis, prescription, visit_date || new Date()]
        );

        res.status(201).json({
            id: result.insertId,
            patient_id,
            doctor_id,
            diagnosis,
            prescription,
            visit_date: visit_date || new Date()
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
