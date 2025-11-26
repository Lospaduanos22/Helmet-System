// backend/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",   // use 'localhost' for SSH tunnel
  user: process.env.DB_USER,                  // your DB username
  password: process.env.DB_PASSWORD,          // your DB password
  database: process.env.DB_NAME,              // your DB name
  port: process.env.DB_PORT || 3306,          // specify port (important!)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
