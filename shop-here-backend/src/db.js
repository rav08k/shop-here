import mysql from 'mysql2/promise'; // Import the promise-based API
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({ // Use createPool instead of createConnection
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
});

console.log('MySQL connection pool created');

export default pool;