// backend/controllers/UserController.js
import UserModel from "../models/UserModel.js";

export const getActiveUsers = async (req, res) => {
  try {
    const users = await UserModel.getActiveUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
