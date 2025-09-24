import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST_MYSQL,
    database: process.env.DB_DATABASE_MYSQL,
    user: process.env.DB_USER_MYSQL,
    password: process.env.DB_PASSWORD_MYSQL,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: {
        rejectUnauthorized: true
    }
})
