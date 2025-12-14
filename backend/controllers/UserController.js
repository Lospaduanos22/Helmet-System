import db from "../config/db.js";
import bcrypt from "bcrypt";

class UserController {
  async loginUser(req, res) {
    const { username, password, role } = req.body;

    try {
      const [rows] = await db.query(
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

      if (role === "student") {
        res.json({
          success: true,
          data: {
            student_id: user.student_id,
            username: user.username,
            first_login: user.first_login,
          },
        });
      } else if (role === "admin") {
        res.json({
          success: true,
          data: {
            id: user.id,
            username: user.username,
          },
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default new UserController();