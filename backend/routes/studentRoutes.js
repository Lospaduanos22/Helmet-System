import express from "express";
import { createStudent, getStudentById, changePassword, updateStudentProfile } from "../controllers/studentController.js";

const router = express.Router();

// Create student
router.post("/create", createStudent);

// Get student by ID
router.get("/:student_id", getStudentById);

// Change password
router.put("/change-password/:student_id", changePassword);

// Update profile (username and/or password)
router.put("/update/:student_id", updateStudentProfile);

export default router;
