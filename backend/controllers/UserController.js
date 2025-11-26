// backend/controllers/userController.js
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM ${role}s WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Send minimal user data back
    res.json({ success: true, data: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
