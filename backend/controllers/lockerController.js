import { pool } from "../config/db.js";

// 1. Get All Lockers
export const getAllLockers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.*, s.username as student_name 
      FROM lockers l 
      LEFT JOIN students s ON l.student_id = s.student_id
      ORDER BY locker_number ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Add Locker (Admin Only)
export const addLocker = async (req, res) => {
  const { locker_number } = req.body;
  try {
    await pool.query("INSERT INTO lockers (locker_number) VALUES (?)", [locker_number]);
    res.json({ success: true, message: "Locker added successfully" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: "Locker number already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Delete Locker (Admin Only)
export const deleteLocker = async (req, res) => {
  const { locker_id } = req.params;
  try {
    await pool.query("DELETE FROM lockers WHERE locker_id = ?", [locker_id]);
    res.json({ success: true, message: "Locker deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Student Reserve (Reserve a specific slot)
export const reserveLocker = async (req, res) => {
  const { locker_id, student_id } = req.body;

  try {
    // Check if student already has ANY locker
    const [active] = await pool.query(
      "SELECT * FROM lockers WHERE student_id = ? AND status = 'occupied'",
      [student_id]
    );

    if (active.length > 0) {
      return res.status(400).json({ success: false, message: "You already have a locker reserved." });
    }

    // Check availability
    const [locker] = await pool.query("SELECT * FROM lockers WHERE locker_id = ?", [locker_id]);
    if (!locker[0] || locker[0].status !== 'available') {
      return res.status(400).json({ success: false, message: "Locker is not available." });
    }

    // Reserve it
    await pool.query(
      "UPDATE lockers SET status = 'occupied', student_id = ? WHERE locker_id = ?",
      [student_id, locker_id]
    );

    // Log history
    await pool.query(
      "INSERT INTO deposits (locker_id, student_id, action_type) VALUES (?, ?, 'deposit')",
      [locker_id, student_id]
    );

    res.json({ success: true, message: "Locker reserved successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Admin Checkout (Release the locker)
export const adminCheckout = async (req, res) => {
  const { locker_id } = req.body;

  try {
    // Get locker info first to know who was using it (for logging)
    const [locker] = await pool.query("SELECT * FROM lockers WHERE locker_id = ?", [locker_id]);
    
    if (!locker[0] || locker[0].status !== 'occupied') {
      return res.status(400).json({ success: false, message: "Locker is not currently occupied." });
    }

    const student_id = locker[0].student_id;

    // Release locker
    await pool.query(
      "UPDATE lockers SET status = 'available', student_id = NULL WHERE locker_id = ?",
      [locker_id]
    );

    // Log history
    await pool.query(
      "INSERT INTO deposits (locker_id, student_id, action_type) VALUES (?, ?, 'retrieve')",
      [locker_id, student_id]
    );

    res.json({ success: true, message: "Locker checked out successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};