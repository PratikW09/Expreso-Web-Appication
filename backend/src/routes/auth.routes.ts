import express, { Router } from "express";
import { registerUser } from './../controller/auth.controller';

// import { verifyJWT } from "../middleware/authMiddleware";

const router: Router = express.Router();

// ✅ User Registration
router.post("/register", registerUser);

// // ✅ User Login
// router.post("/login", loginUser);

// // ✅ Get Profile Details (Protected)
// router.get("/profile", verifyJWT, getUserDetails);

// // ✅ Logout
// router.post("/logout", verifyJWT, logoutUser);

export default router;
