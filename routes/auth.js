const express = require('express');
const bcrypt = require('bcryptjs');
const connection = require('../db');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: 'public' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) throw err;

            if (results.length && bcrypt.compareSync(password, results[0].password)) {
                req.session.loggedIn = true;
                req.session.email = email;
                res.redirect('/home.html');
            } else {
                res.render('login', { error: 'Invalid email or password' });
            }
        });
    } else {
        res.render('login', { error: 'Please provide both email and password' });
    }
});

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: 'public' });
});

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check if the password is at least 8 characters long
    if (password.length < 8) {
        return res.render('register', { error: 'Password must be at least 8 characters long' });
    }

    // Check if the email already exists
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.render('register', { error: 'Email already in use' });
        } else {
            // Hash the password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Insert the new user into the database
            connection.query('INSERT INTO users SET ?', { username, email, password: hashedPassword }, (err, results) => {
                if (err) throw err;
                res.redirect('/auth/login');
            });
        }
    });
});

module.exports = router;
