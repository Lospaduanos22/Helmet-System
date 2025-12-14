import express from "express";
import adminController from "../controllers/adminController.js";

const router = express.Router();

router.put("/change-student-password", (req, res) => adminController.adminChangeStudentPassword(req, res));
router.get("/lockers", (req, res) => adminController.getLockers(req, res));
router.put("/rename-locker", (req, res) => adminController.renameLocker(req, res));

export default router;