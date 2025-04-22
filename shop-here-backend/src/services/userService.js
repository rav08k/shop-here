import bcrypt from "bcrypt";
import User from "../models/usersModel.js";
import authService from "./authService.js"; // Assuming authService is in the same directory

const saltRounds = 10;

/**
 * User Service Helper Functions for Authorization
 */
const AuthHelpers = {
	/**
	 * Checks if the requesting user is authenticated and is an Admin.
	 * @param {Object} requestingUser - User object from authentication middleware.
	 * @returns {boolean} True if Admin, false otherwise.
	 */
	_isAdmin: (requestingUser) => {
		return !!requestingUser && requestingUser.role === "admin";
	},

	/**
	 * Checks if the requesting user is authenticated and is either an Admin or accessing their own resource.
	 * @param {Object} requestingUser - User object from authentication middleware.
	 * @param {number} targetUserId - The user ID of the resource being accessed.
	 * @returns {boolean} True if Admin or Self, false otherwise.
	 */
	_isSelf: (requestingUser, targetUserId) => {
		// Ensure targetUserId is treated as a number for comparison if needed
		if (requestingUser && requestingUser.user_id === Number(targetUserId))
			return true; // Accessing self is allowed
		return false; // Otherwise deny
	},
};

/**
 * User Service
 * Handles business logic related to user management and login orchestration.
 */
const userService = {
	/**
	 * Orchestrates user login by calling the AuthService.
	 * @param {string} email - User's email.
	 * @param {string} password - User's plaintext password.
	 * @returns {Promise<Object>} On success: { token, user: { userId, email, role, firstName } }
	 * @throws {Error} If login fails.
	 */
	loginUser: async (email, password) => {
		return await authService.loginUser(email, password);
	},

	/**
	 * Orchestrates OTP request by calling AuthService.
	 * @param {string} contact - The user's contact number.
	 * @returns {Promise<boolean>} True if OTP request was processed successfully.
	 * @throws {Error} If request fails.
	 */
	requestOtp: async (contact) => {
		return await authService.requestOtp(contact);
	},

	/**
	 * Orchestrates OTP verification and login by calling AuthService.
	 * @param {string} contact - The user's contact number.
	 * @param {string} otp - The OTP submitted by the user.
	 * @returns {Promise<Object>} On success: { token, user: { userId, email, role, firstName } }
	 * @throws {Error} If verification fails.
	 */
	verifyOtpAndLogin: async (contact, otp) => {
		return await authService.verifyOtpAndLogin(contact, otp);
	},

	/**
	 * Registers a new user. Allows 'Customer' or 'Seller' role from input, defaults to 'Customer'.
	 * Throws error if an invalid/disallowed role is explicitly provided.
	 * Handles password hashing and basic validation.
	 * @param {Object} userData - Raw user data from request { email, password, first_name, ... role? }.
	 * @returns {Promise<Object>} Object containing the new user's ID.
	 * @throws {Error} If validation fails or user already exists.
	 */
	registerUser: async (userData) => {
		const { email, password, first_name, last_name, contact, address, role } =
			userData;

		// Basic Input Validation
		if (!email || !password || !first_name || !last_name) {
			throw new Error(
				"Missing required fields: email, password, first_name, last_name are required."
			);
		}
		if (!/\S+@\S+\.\S+/.test(email)) {
			throw new Error("Invalid email format.");
		}
		if (password.length < 8) {
			throw new Error("Password must be at least 8 characters long.");
		}

		// Role Validation and Assignment
		const allowedRoles = ["customer", "seller", "admin"];
		let roleToSet = "customer"; // Default role

		if (role) {
			if (allowedRoles.includes(role)) {
				roleToSet = role;
			} else {
				throw new Error(
					`Invalid role specified. Allowed roles are: ${allowedRoles.join(
						", "
					)}`
				);
			}
		}

		try {
			// Use efficient existence checks from the model
			if (await User.checkEmailExists(email)) {
				throw new Error("Email already registered.");
			}
			if (contact && (await User.checkContactExists(contact))) {
				throw new Error("Contact number already registered.");
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			// Prepare data for DB using the determined role
			const userDataForDb = {
				email: email,
				password: hashedPassword,
				first_name: first_name,
				last_name: last_name,
				contact: contact,
				address: address,
				role: roleToSet,
				is_active: true,
			};

			// Create user
			const result = await User.create(userDataForDb);

			return { userId: result.insertId };
		} catch (error) {
			console.error("Error in userService.registerUser:", error.message);
			if (
				error.message.includes("already registered") ||
				error.message.includes("Invalid") ||
				error.message.includes("Missing required fields")
			) {
				throw error;
			}
			throw new Error("User registration failed due to server error.");
		}
	},

	/**
	 * Gets all users (Admin only).
	 * @param {Object} requestingUser - Info about the user making the request.
	 * @returns {Promise<Array>} Array of user objects (password excluded).
	 * @throws {Error} If unauthorized or fetch fails.
	 */
	getAllUsers: async (requestingUser) => {
		// Use helper for authorization check
		if (!AuthHelpers._isAdmin(requestingUser)) {
			throw new Error("Unauthorized: Admin access required.");
		}

		try {
			return await User.getAll();
		} catch (error) {
			console.error("Error in userService.getAllUsers:", error);
			throw new Error("Failed to fetch users.");
		}
	},

	/**
	 * Gets a single user by ID (Admin or self).
	 * @param {number} userId - The ID of the user to fetch.
	 * @param {Object} requestingUser - Info about the user making the request.
	 * @returns {Promise<Object|null>} User object or null if not found.
	 * @throws {Error} If unauthorized or fetch fails.
	 */
	getUserById: async (userId, requestingUser) => {
		// Use helper for authorization check
		if (
			!AuthHelpers._isAdmin(requestingUser, userId) ||
			!AuthHelpers._isSelf(requestingUser, userId)
		) {
			throw new Error("Unauthorized to view this user profile.");
		}

		try {
			const user = await User.getById(userId);
			if (!user) {
				throw new Error("User not found");
			}
			return user;
		} catch (error) {
			console.error(
				`Error in userService.getUserById for ID ${userId}:`,
				error.message
			);
			if (
				error.message === "User not found" ||
				error.message.includes("Unauthorized")
			) {
				throw error;
			}
			throw new Error("Failed to fetch user.");
		}
	},

	/**
	 * Updates a user's profile (Admin or self).
	 * @param {number} userIdToUpdate - The ID of the user being updated.
	 * @param {Object} updateData - Data to update.
	 * @param {Object} requestingUser - Info about the user making the request (from JWT for auth check).
	 * @returns {Promise<boolean>} True if update was successful.
	 * @throws {Error} If validation, authorization, or update fails.
	 */
	updateUserProfile: async (userIdToUpdate, updateData, requestingUser) => {
		// Use helper for authorization check
		if (!AuthHelpers._isSelf(requestingUser, userIdToUpdate)) {
			throw new Error("Unauthorized to update this user profile.");
		}

		// Basic Input Validation for updatable fields
		const allowedUpdates = {};
		if (updateData.first_name !== undefined) {
			if (
				typeof updateData.first_name !== "string" ||
				updateData.first_name.trim() === ""
			) {
				throw new Error("Invalid first name.");
			}
			if (updateData.first_name.trim() !== requestingUser.first_name) {
				allowedUpdates.first_name = updateData.first_name.trim();
			}
		}
		if (updateData.last_name !== undefined) {
			if (
				typeof updateData.last_name !== "string" ||
				updateData.last_name.trim() === ""
			) {
				throw new Error("Invalid last name.");
			}
			if (updateData.last_name.trim() !== requestingUser.last_name) {
				allowedUpdates.last_name = updateData.last_name.trim();
			}
		}
		if (updateData.contact !== undefined) {
			if (typeof updateData.contact !== "string") {
				throw new Error("Invalid contact number.");
			}

			if (
				requestingUser.contact !== updateData.contact.trim() &&
				(await User.checkContactExists(updateData.contact.trim()))
			) {
				throw new Error("Invalid : Phone number is registered with other user");
			}
            if (updateData.contact.trim() !== requestingUser.contact) {
                allowedUpdates.contact = updateData.contact;
            }
		}
		if (updateData.email !== undefined) {
			if (typeof updateData.email !== "string") {
				throw new Error("Invalid contact number.");
			}
			if (!/\S+@\S+\.\S+/.test(updateData.email)) {
				throw new Error("Invalid email format.");
			}

			if (
				requestingUser.email !== updateData.email.trim() &&
				(await User.checkEmailExists(updateData.email.trim()))
			) {
				throw new Error("Invalid : Email is registered with other user");
			}
            if (updateData.email.trim() !== requestingUser.email) {
                allowedUpdates.email = updateData.email;
            }
		}
		if (updateData.address !== undefined) {
			if (typeof updateData.address !== "string") {
				throw new Error("Invalid address.");
			}
            if (updateData.address.trim() !== requestingUser.address) {
                allowedUpdates.address = updateData.address;
            }
		}

		if (Object.keys(allowedUpdates).length === 0) {
			throw new Error("No valid fields provided for update or no changes are made.");
		}

		try {
			const result = await User.update(userIdToUpdate, allowedUpdates);

			if (result.affectedRows === 0) {
				throw new Error("User not found for update.");
			}
			return true;
		} catch (error) {
			console.error(
				`Error in userService.updateUserProfile for ID ${userIdToUpdate}:`,
				error.message
			);
			if (
				error.message.includes("Unauthorized") ||
				error.message.includes("Invalid") ||
				error.message.includes("No valid fields") ||
				error.message.includes("User not found")
			) {
				throw error;
			}
			throw new Error("User update failed due to server error.");
		}
	},

	/**
	 * Soft deletes (deactivates) a user (Admin only).
	 * @param {number} userIdToDelete - The ID of the user to deactivate.
	 * @param {Object} requestingUser - Info about the user making the request (for auth check).
	 * @returns {Promise<boolean>} True if deactivation was successful.
	 * @throws {Error} If authorization fails or user not found.
	 */
	deactivateUser: async (userIdToDelete, requestingUser) => {
		// Use helper for authorization check
		if (!AuthHelpers._isAdmin(requestingUser)) {
			throw new Error(
				"Unauthorized: Admin access required to deactivate users."
			);
		}
		// Additional check: Prevent admin self-deactivation
		if (requestingUser.userId === userIdToDelete) {
			throw new Error("Admin cannot deactivate their own account.");
		}

		try {
			const result = await User.softDelete(userIdToDelete);
			if (result.affectedRows === 0) {
				throw new Error("User not found for deactivation.");
			}
			return true;
		} catch (error) {
			console.error(
				`Error in userService.deactivateUser for ID ${userIdToDelete}:`,
				error.message
			);
			if (
				error.message.includes("Unauthorized") ||
				error.message.includes("Admin cannot deactivate") ||
				error.message.includes("User not found")
			) {
				throw error;
			}
			throw new Error("User deactivation failed due to server error.");
		}
	},

	/**
	 * Reactivates a user (Admin only).
	 * @param {number} userIdToReactivate - The ID of the user to reactivate.
	 * @param {Object} requestingUser - Info about the user making the request.
	 * @returns {Promise<boolean>} True if reactivation was successful.
	 * @throws {Error} If authorization fails or user not found.
	 */
	reactivateUser: async (userIdToReactivate, requestingUser) => {
		// Use helper for authorization check
		if (!AuthHelpers._isAdmin(requestingUser)) {
			throw new Error(
				"Unauthorized: Admin access required to reactivate users."
			);
		}

		try {
			const result = await User.reactivate(userIdToReactivate);
			if (result.affectedRows === 0) {
				throw new Error("User not found for reactivation.");
			}
			return true;
		} catch (error) {
			console.error(
				`Error in userService.reactivateUser for ID ${userIdToReactivate}:`,
				error.message
			);
			if (
				error.message.includes("Unauthorized") ||
				error.message.includes("User not found")
			) {
				throw error;
			}
			throw new Error("User reactivation failed due to server error.");
		}
	},
};

export default userService;
