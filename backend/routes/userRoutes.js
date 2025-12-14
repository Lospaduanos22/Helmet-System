import express from "express";
import userController from "../controllers/UserController.js";

const router = express.Router();

router.post("/login", (req, res) => userController.loginUser(req, res));

export default router;