const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, role, specialization } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if user exists
        const [userCheck] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userCheck.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        const newUserId = result.insertId;

        // If doctor, add to doctors table
        if (role === 'doctor') {
            await db.query(
                'INSERT INTO doctors (user_id, specialization) VALUES (?, ?)',
                [newUserId, specialization || 'General']
            );
        }

        // Create token
        const token = jwt.sign({ id: newUserId, role: role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            token,
            user: {
                id: newUserId,
                name: name,
                email: email,
                role: role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check for user
        const [userResult] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userResult.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const user = userResult[0];

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
