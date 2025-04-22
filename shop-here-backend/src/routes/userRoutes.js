import express from "express";
import userController from "../controllers/userController.js"; // Adjust path as needed
import authenticateToken from "../middleware/authenticate.js"; // Adjust path as needed

const userRouter = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
userRouter.post("/register", userController.registerUser); // Changed from createNewUser

/**
 * @route   GET /api/users
 * @desc    Get all users (requires auth, likely admin only)
 * @access  Private (Admin) - Requires further authorization middleware
 */
userRouter.get("/", authenticateToken, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (requires auth, admin or self)
 * @access  Private (Admin or Self) - Requires further authorization middleware or relies on service check
 */
userRouter.get("/:id", authenticateToken, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile (requires auth, admin or self)
 * @access  Private (Admin or Self) - Requires further authorization middleware or relies on service check
 */
userRouter.put("/:id", authenticateToken, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Deactivate (soft delete) user (requires auth, likely admin only)
 * @access  Private (Admin) - Requires further authorization middleware
 */
userRouter.delete("/:id", authenticateToken, userController.deleteUser); // Calls controller which uses soft delete service

/**
 * @route   PUT /api/users/:id/reactivate
 * @desc    Reactivate a user (requires auth, likely admin only)
 * @access  Private (Admin) - Requires further authorization middleware
 */
userRouter.put("/:id/reactivate", authenticateToken, userController.reactivateUser);


export default userRouter;