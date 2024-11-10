const mysql = require('mysql2');

// Use environment variables for sensitive information
const connection = mysql.createConnection({
    host: process.env.DB_HOST,        // database host
    user: process.env.DB_USER,        // MySQL username
    password: process.env.DB_PASSWORD, // MySQL password
    database: process.env.DB_NAME,     // database name
    port: process.env.DB_PORT || 3306  // default port is 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the process if there's an error
    } else {
        console.log('Connected to MySQL Database.');
    }
});

module.exports = connection;

