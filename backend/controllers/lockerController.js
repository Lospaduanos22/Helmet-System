import { pool } from "../config/db.js";

// 1. Get All Lockers
export const getAllLockers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.*, s.username as student_name 
      FROM lockers l 
      LEFT JOIN students s ON l.student_id = s.student_id
      ORDER BY l.locker_id ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Add Locker Cluster (Creates 25 slots: Name-1 to Name-25)
export const addLocker = async (req, res) => {
  const { locker_number } = req.body; // This acts as the Cluster Name (e.g., "Bunzel")
  
  if (!locker_number) {
    return res.status(400).json({ success: false, message: "Locker cluster name is required" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Create 25 slots for this locker cluster
    for (let i = 1; i <= 25; i++) {
      // Format: "Bunzel-1", "Bunzel-2", etc.
      const slotName = `${locker_number}-${i}`; 
      await connection.query("INSERT INTO lockers (locker_number) VALUES (?)", [slotName]);
    }

    await connection.commit();
    res.json({ success: true, message: `Locker cluster '${locker_number}' (25 slots) added successfully` });
  } catch (err) {
    await connection.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: "A locker cluster with this name already exists." });
    }
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// 3. Delete Locker (Individual Slot or cleanup)
export const deleteLocker = async (req, res) => {
  const { locker_id } = req.params;
  try {
    await pool.query("DELETE FROM lockers WHERE locker_id = ?", [locker_id]);
    res.json({ success: true, message: "Locker slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Student Reserve
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

// 5. Admin Checkout
export const adminCheckout = async (req, res) => {
  const { locker_id } = req.body;

  try {
    const [locker] = await pool.query("SELECT * FROM lockers WHERE locker_id = ?", [locker_id]);
    
    if (!locker[0] || locker[0].status !== 'occupied') {
      return res.status(400).json({ success: false, message: "Locker is not currently occupied." });
    }

    const student_id = locker[0].student_id;

    await pool.query(
      "UPDATE lockers SET status = 'available', student_id = NULL WHERE locker_id = ?",
      [locker_id]
    );

    await pool.query(
      "INSERT INTO deposits (locker_id, student_id, action_type) VALUES (?, ?, 'retrieve')",
      [locker_id, student_id]
    );

    res.json({ success: true, message: "Locker checked out successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};