// backend/controllers/adminController.js
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

// ------------------------
// Admin changes student password
// ------------------------
export const adminChangeStudentPassword = async (req, res) => {
  const { student_id, newPassword } = req.body;

  if (!student_id || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Student ID and password (min 8 chars) required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.query(
      "UPDATE students SET password = ?, first_login = 0 WHERE student_id = ?",
      [hashedPassword, student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student password changed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------------
// Locker management (simple example using DB table 'lockers')
// ------------------------

// GET lockers
export const getLockers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lockers ORDER BY id ASC");
    res.json({ success: true, lockers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RENAME locker
export const renameLocker = async (req, res) => {
  const { locker_id, newName } = req.body;
  if (!locker_id || !newName) {
    return res.status(400).json({ success: false, message: "Locker ID and new name required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE lockers SET name = ? WHERE id = ?",
      [newName, locker_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Locker not found" });
    }

    res.json({ success: true, message: "Locker renamed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
