const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const connection = require('./db');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use('/auth', authRoutes);

// Serve dashboard.html directly when accessing localhost:3000
app.get('/', (req, res) => {
    res.sendFile('new.html', { root: 'public' });
});

app.get('/dashboard', (req, res) => {
    res.sendFile('dashboard.html', { root: 'public' });
});

app.post('/submit_contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(req.body);  // Log request body to check if form data is reaching the backend
    
    const sql = 'INSERT INTO ContactForm (name, email, message) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting contact form data:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Contact form submitted successfully!');
        res.redirect('/contact.html');
    });
});


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
