import express from "express";
import { createStudent, getStudentById, changePassword } from "../controllers/studentController.js";

const router = express.Router();

router.post("/create", createStudent);
router.get("/:student_id", getStudentById);
router.put("/change-password/:student_id", changePassword);

export default router;
