// backend/models/UserModel.js
import { pool } from "../config/db.js";

export default class UserModel {
  static async getActiveUsers() {
    const query = "SELECT * FROM users WHERE status = ?";
    const [rows] = await pool.execute(query, ["active"]);
    return rows;
  }
}
