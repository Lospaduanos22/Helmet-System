import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  // Wrapper for query to match the diagram's +query() method
  async query(sql, params) {
    return this.pool.query(sql, params);
  }

  // Helper to get a raw connection (needed for transactions)
  async getConnection() {
    return this.pool.getConnection();
  }
}

const db = new Database();
export default db;