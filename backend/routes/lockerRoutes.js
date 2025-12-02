import express from "express";
import {
  getAllLockers,
  addLocker,
  deleteLocker,
  reserveLocker,
  adminCheckout,
} from "../controllers/lockerController.js";

const router = express.Router();

// GET /api/lockers - Get all lockers
router.get("/", getAllLockers);
// POST /api/lockers/add - Add a new locker (Admin)
router.post("/add", addLocker);
// DELETE /api/lockers/delete/:locker_id - Delete a locker (Admin)
router.delete("/delete/:locker_id", deleteLocker);
// POST /api/lockers/reserve - Reserve a locker (Student)
router.post("/reserve", reserveLocker);
// POST /api/lockers/checkout - Release a locker (Admin)
router.post("/checkout", adminCheckout);

export default router;