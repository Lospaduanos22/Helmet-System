import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

// =====================
// CREATE STUDENT
// =====================
export const createStudent = async (req, res) => {
  const { student_id, username, createdBy } = req.body;

  if (!student_id || !username || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id]
    );

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: "Student ID already exists",
      });
    }

    // Password defaults to student_id
    const hashedPassword = await bcrypt.hash(student_id, 10);

    await pool.query(
      "INSERT INTO students (student_id, username, password, created_by) VALUES (?, ?, ?, ?)",
      [student_id, username, hashedPassword, createdBy]
    );

    res.json({
      success: true,
      message: "Student created successfully. Default password is the Student ID.",
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// GET STUDENT BY ID
// =====================
export const getStudentById = async (req, res) => {
  const { student_id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT student_id, username, first_login FROM students WHERE student_id = ?",
      [student_id]
    );

    if (rows.length === 0)
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    res.json({ success: true, student: rows[0] });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================
// CHANGE PASSWORD
// =====================
export const changePassword = async (req, res) => {
  const { student_id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE students SET password = ?, first_login = 0 WHERE student_id = ?",
      [hashedPassword, student_id]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
