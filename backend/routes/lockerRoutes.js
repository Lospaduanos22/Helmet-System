import express from "express";
import lockerController from "../controllers/lockerController.js";

const router = express.Router();

router.get("/", (req, res) => lockerController.getAllLockers(req, res));
router.post("/add", (req, res) => lockerController.addLocker(req, res));
router.delete("/delete/:locker_id", (req, res) => lockerController.deleteLocker(req, res));
router.post("/reserve", (req, res) => lockerController.reserveLocker(req, res));
router.post("/checkout", (req, res) => lockerController.adminCheckout(req, res));

export default router;