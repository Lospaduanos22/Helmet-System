import { pool } from "./config/db.js";

async function test() {
  try {
    const [rows] = await pool.query("SELECT NOW()"); // simple query to test connection
    console.log("Connection OK", rows);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

test();
