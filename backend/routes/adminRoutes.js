import express from "express";
import { adminChangeStudentPassword, getLockers, renameLocker } from "../controllers/adminController.js";

const router = express.Router();

// Admin resets student password
router.put("/change-student-password", adminChangeStudentPassword);

// Locker management
router.get("/lockers", getLockers);
router.put("/rename-locker", renameLocker);

export default router;
