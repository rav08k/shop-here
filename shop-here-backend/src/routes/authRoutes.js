import express from "express";
import userController from "../controllers/userController.js"; // Adjust path as needed

const authRouter = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email/password
 * @access  Public
 */
authRouter.post("/login", userController.loginUser);

/**
 * @route   POST /api/auth/otp/request
 * @desc    Request OTP for login via contact number
 * @access  Public
 */
authRouter.post("/otp/request", userController.requestOtp);

/**
 * @route   POST /api/auth/otp/verify
 * @desc    Verify OTP and login user
 * @access  Public
 */
authRouter.post("/otp/verify", userController.verifyOtp);


export default authRouter;