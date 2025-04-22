import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/usersModel.js'; // Use the refactored User model

// Ensure dotenv is configured (usually in your main server file)
dotenv.config(); // Might not be needed here if configured globally

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_DEFAULT_SECRET_KEY';

/**
 * Express middleware to authenticate requests using JWT.
 * Verifies the token, checks if the user exists and is active,
 * and attaches the user object to req.user.
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) {
        // No token provided
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            console.error('JWT Verification Error:', err.name, err.message);
            // Token is invalid (expired, wrong signature, etc.)
            return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
        }
        console.log("auth payload",payload)

        // Token is valid, payload contains { userId, role, iat, exp }
        try {
            // Check if user exists and is active in the database
            const activeUser = await User.findActiveById(payload.userId);

            if (!activeUser) {
                // User not found OR is inactive
                return res.status(403).json({ error: 'Forbidden: User not found or inactive' });
            }

            // Attach the active user object (excluding password) to the request
            req.user = activeUser;
            next(); // Proceed to the next middleware or route handler

        } catch (dbError) {
            console.error('Auth Middleware DB Error:', dbError);
            return res.status(500).json({ error: 'Internal Server Error during authentication' });
        }
    });
};

export default authenticateToken;