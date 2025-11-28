import { pool } from "../config/db.js";
import bcrypt from "bcrypt";


// ---------------- CREATE STUDENT ----------------
// ---------------- CREATE STUDENT ----------------
export const createStudent = async (req, res) => {
  const { student_id, username } = req.body; // password removed

  if (!student_id || !username) {
    return res.status(400).json({ success: false, message: "Student ID and username are required" });
  }

  try {
    // Use student_id as default password
    const hashedPassword = await bcrypt.hash(student_id, 10);

    await pool.query(
      "INSERT INTO students (student_id, username, password, first_login) VALUES (?, ?, ?, 1)",
      [student_id, username, hashedPassword]
    );

    res.json({ success: true, message: "Student account created successfully" });
  } catch (err) {
    console.error("CREATE STUDENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- GET STUDENT BY ID ----------------
export const getStudentById = async (req, res) => {
  const { student_id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT student_id, username, first_login FROM students WHERE student_id = ?",
      [student_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, student: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- CHANGE PASSWORD ----------------

export const changePassword = async (req, res) => {
  const { student_id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ success: false, message: "New password is required" });

  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE student_id = ?", [student_id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Student not found" });

    const student = rows[0];

    if (student.first_login === 0) {
      if (!oldPassword) return res.status(400).json({ success: false, message: "Old password is required" });
      const valid = await bcrypt.compare(oldPassword, student.password);
      if (!valid) return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE students SET password = ?, first_login = 0 WHERE student_id = ?",
      [hashedPassword, student_id]
    );

    res.json({ success: true, message: "Password changed successfully" });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err); // log full error
    res.status(500).json({ success: false, message: "Server error", detail: err.message });
  }
};

// ---------------- UPDATE PROFILE ----------------
export const updateStudentProfile = async (req, res) => {
  const { student_id } = req.params;
  const { username, password, oldPassword } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE student_id = ?",
      [student_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Student not found" });

    const student = rows[0];

    let updateQuery = "UPDATE students SET username = ?";
    const params = [username || student.username];

    if (password) {
      if (!oldPassword)
        return res.json({
          success: false,
          message: "Enter old password to change password",
        });

      const valid = await bcrypt.compare(oldPassword, student.password);
      if (!valid)
        return res.json({ success: false, message: "Old password is incorrect" });

      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password = ?, first_login = 0";
      params.push(hashedPassword);
    }

    updateQuery += " WHERE student_id = ?";
    params.push(student_id);

    await pool.query(updateQuery, params);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }

  
};
