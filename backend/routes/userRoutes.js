// backend/routes/userRoutes.js
import express from "express";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Pick table based on role (admins or students)
    const table = role === "admin" ? "admins" : "students";

    const [rows] = await pool.query(
      "SELECT * FROM ?? WHERE username = ?",
      [table, username]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: "Wrong credentials" });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong credentials" });
    }

    // Successful login
    return res.json({ success: true, data: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
