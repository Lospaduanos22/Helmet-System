import express from "express";
import studentController from "../controllers/studentController.js";

const router = express.Router();

router.post("/create", (req, res) => studentController.createStudent(req, res));
router.get("/:student_id", (req, res) => studentController.getStudentById(req, res));
router.put("/change-password/:student_id", (req, res) => studentController.changePassword(req, res));
router.put("/update/:student_id", (req, res) => studentController.updateStudentProfile(req, res));

export default router;