import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';
// TODO: Import library/utility for generating random OTPs
// TODO: Import library/client for Fast2sms API calls
// TODO: Import mechanism for temporary OTP storage (e.g., Redis client, DB model)

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_DEFAULT_SECRET_KEY';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;

/**
 * Authentication Service
 * Handles user login (password & OTP) and potentially other auth-related tasks.
 */
const authService = {
    /**
     * Logs in a user with email and password.
     * @param {string} email - User's email.
     * @param {string} password - User's plaintext password.
     * @returns {Promise<Object>} On success: { token, user: { userId, email, role, firstName } }
     * @throws {Error} If login fails (e.g., invalid credentials, user not found/inactive).
     */
    loginUser: async (email, password) => {
        try {
            const user = await User.findActiveByEmail(email);

            if (!user) {
                throw new Error('Invalid Email');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid Password');
            }

            const payload = {
                userId: user.user_id,
                role: user.role
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            return {
                token: token,
                user: {
                    userId: user.user_id,
                    email: user.email,
                    role: user.role,
                    firstName: user.first_name
                }
            };

        } catch (error) {
            console.error('Error in authService.loginUser:', error.message);
            if (error.message.includes('Invalid')) {
                throw error;
            }
            throw new Error('Login failed due to server error.');
        }
    },

    /**
     * Handles the first step of OTP login: requesting an OTP.
     * @param {string} contact - The user's contact number.
     * @returns {Promise<boolean>} True if OTP request was processed successfully.
     * @throws {Error} If user not found, validation fails, or SMS sending fails.
     */
    requestOtp: async (contact) => {
        // TODO: Add validation for contact number format
        if (!contact) {
             throw new Error('Contact number is required.');
        }

        try {
            const user = await User.findByContact(contact);
            if (!user || !user.is_active) {
                throw new Error('User not registered or inactive with this contact number.');
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString().substring(0, OTP_LENGTH);

            // IMPORTANT: Replace with actual storage (Redis recommended, or DB table)
            console.log(`Generated OTP for ${contact}: ${otp}`); // Log for dev only!
            // Example: await otpStore.set(`otp:${contact}`, otp, 'EX', OTP_EXPIRY_MINUTES * 60);

            // IMPORTANT: Replace with actual Fast2sms API call
            console.log(`---> SIMULATING SENDING OTP ${otp} to ${contact} via Fast2sms <---`);

            return true;

        } catch (error) {
            console.error('Error in authService.requestOtp:', error.message);
            if (error.message.includes('User not registered') || error.message.includes('Contact number is required')) {
                throw error;
            }
             if (error.message.includes('Failed to send OTP')) {
                 throw error;
             }
            throw new Error('OTP request failed due to server error.');
        }
    },

    /**
     * Handles the second step of OTP login: verifying OTP and logging in.
     * @param {string} contact - The user's contact number.
     * @param {string} otp - The OTP submitted by the user.
     * @returns {Promise<Object>} On success: { token, user: { userId, email, role, firstName } }
     * @throws {Error} If verification fails (invalid OTP, expired, user not found).
     */
    verifyOtpAndLogin: async (contact, otp) => {
        // TODO: Add validation for contact number and OTP format
        if (!contact || !otp) {
            throw new Error('Contact number and OTP are required.');
        }

        try {
            // IMPORTANT: Replace with actual retrieval/check from storage (Redis/DB)
            console.log(`---> SIMULATING Verification for ${contact} with OTP ${otp} <---`);
            const isOtpValid = true; // Replace with actual check against stored OTP & expiry
            if (!isOtpValid) {
                 throw new Error('Invalid or expired OTP.');
            }

            const user = await User.findByContact(contact);
            if (!user || !user.is_active) {
                throw new Error('User not found or inactive.');
            }

            const payload = {
                userId: user.user_id,
                role: user.role
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // IMPORTANT: Invalidate the used OTP in storage here

            return {
                token: token,
                user: {
                    userId: user.user_id,
                    email: user.email,
                    role: user.role,
                    firstName: user.first_name
                }
            };

        } catch (error) {
            console.error('Error in authService.verifyOtpAndLogin:', error.message);
            if (error.message.includes('Invalid or expired OTP') || error.message.includes('required') || error.message.includes('User not found')) {
                throw error;
            }
            throw new Error('OTP verification failed due to server error.');
        }
    }
};

export default authService;