import userService from '../services/userService.js'; // Adjust path as needed

/**
 * User Controller
 * Handles incoming HTTP requests related to users, interacts with services,
 * and sends HTTP responses.
 */
const userController = {

    /**
     * Handles user login requests (email/password).
     * POST /api/auth/login
     */
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
            // Call the user service (which calls auth service)
            const result = await userService.loginUser(email, password);
            res.status(200).json({ message: 'Login successful', ...result });
        } catch (error) {
            console.error('Login controller error:', error.message);
            if (error.message === 'Invalid credentials') {
                return res.status(401).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error during login.' });
        }
    },

     /**
     * Handles OTP request for login.
     * POST /api/auth/otp/request
     */
    requestOtp: async (req, res) => {
        const { contact } = req.body;
        if (!contact) {
            return res.status(400).json({ error: 'Contact number is required.' });
        }
        try {
            await userService.requestOtp(contact);
            res.status(200).json({ message: 'OTP sent successfully if user exists.' }); // Avoid confirming user existence here
        } catch (error) {
             console.error('Request OTP controller error:', error.message);
             if (error.message.includes('User not registered')) {
                 // Still return a generic message to avoid revealing registered numbers
                 return res.status(200).json({ message: 'OTP sent successfully if user exists.' });
             }
              if (error.message.includes('Failed to send OTP')) {
                 return res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
              }
             res.status(500).json({ error: error.message || 'Internal server error during OTP request.' });
        }
    },

    /**
     * Handles OTP verification and login.
     * POST /api/auth/otp/verify
     */
    verifyOtp: async (req, res) => {
        const { contact, otp } = req.body;
        if (!contact || !otp) {
            return res.status(400).json({ error: 'Contact number and OTP are required.' });
        }
        try {
            const result = await userService.verifyOtpAndLogin(contact, otp);
            res.status(200).json({ message: 'Login successful', ...result });
        } catch (error) {
             console.error('Verify OTP controller error:', error.message);
             if (error.message.includes('Invalid or expired OTP')) {
                 return res.status(401).json({ error: 'Invalid or expired OTP.' });
             }
             if (error.message.includes('User not found')) {
                  return res.status(404).json({ error: 'User not found for this contact.' });
             }
             res.status(500).json({ error: error.message || 'Internal server error during OTP verification.' });
        }
    },


    /**
     * Handles user registration requests.
     * POST /api/users/register
     */
    registerUser: async (req, res) => {
        try {
            const result = await userService.registerUser(req.body);
            res.status(201).json({ message: 'User registered successfully', userId: result.userId });
        } catch (error) {
            console.error('Registration controller error:', error.message);
            if (error.message.includes('already registered') || error.message.includes('Invalid') || error.message.includes('Missing required fields')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error during registration.' });
        }
    },

    /**
     * Handles fetching all users (likely admin-only).
     * GET /api/users
     * Assumes authentication & authorization middleware has already run.
     */
    getAllUsers: async (req, res) => {
        try {
            // Pass requesting user info from middleware to service for auth check
            const users = await userService.getAllUsers(req.user);
            res.status(200).json(users);
        } catch (error) {
            console.error('GetAllUsers controller error:', error.message);
             if (error.message.includes('Unauthorized')) {
                 return res.status(403).json({ error: error.message });
             }
            res.status(500).json({ error: error.message || 'Failed to fetch users.' });
        }
    },

    /**
     * Handles fetching a single user by ID.
     * GET /api/users/:id
     * Assumes authentication middleware provides req.user.
     */
    getUserById: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user;

        try {
            const user = await userService.getUserById(Number(id), requestingUser);
            res.status(200).json(user);
        } catch (error) {
            console.error(`GetUserById controller error for ID ${id}:`, error.message);
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Unauthorized') || error.message.includes('Authentication required')) {
                 return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Failed to fetch user.' });
        }
    },

    /**
     * Handles updating a user's profile.
     * PUT /api/users/:id or PATCH /api/users/:id
     * Assumes authentication middleware provides req.user.
     */
    updateUser: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user;

        if (!requestingUser) {
             return res.status(401).json({ error: 'Authentication required.' });
        }

        try {
            await userService.updateUserProfile(Number(id), req.body, requestingUser);
            res.status(200).json({ message: 'User profile updated successfully.' });
        } catch (error) {
            console.error(`UpdateUser controller error for ID ${id}:`, error.message);
            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({ error: error.message });
            }
             if (error.message.includes('not found') ) {
                 return res.status(404).json({ error: 'User not found.' });
             }
             if (error.message.includes('Invalid') || error.message.includes('No valid fields')) {
                 return res.status(400).json({ error: error.message });
             }
            res.status(500).json({ error: error.message || 'Failed to update user profile.' });
        }
    },

    /**
     * Handles soft deleting (deactivating) a user.
     * DELETE /api/users/:id
     * Assumes authentication middleware provides req.user.
     */
    deleteUser: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user;

        if (!requestingUser) {
             return res.status(401).json({ error: 'Authentication required.' });
        }

        try {
            await userService.deactivateUser(Number(id), requestingUser);
            res.status(200).json({ message: 'User deactivated successfully.' });
        } catch (error) {
            console.error(`DeleteUser controller error for ID ${id}:`, error.message);
             if (error.message.includes('Unauthorized')) {
                 return res.status(403).json({ error: error.message });
             }
             if (error.message.includes('not found')) {
                 return res.status(404).json({ error: 'User not found.' });
             }
             if (error.message.includes('Admin cannot deactivate')) {
                 return res.status(400).json({ error: error.message });
             }
            res.status(500).json({ error: error.message || 'Failed to deactivate user.' });
        }
    },

     /**
     * Handles reactivating a user.
     * PUT /api/users/:id/reactivate (Example route)
     * Assumes authentication middleware provides req.user.
     */
    reactivateUser: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user;

        if (!requestingUser) {
             return res.status(401).json({ error: 'Authentication required.' });
        }

        try {
            await userService.reactivateUser(Number(id), requestingUser);
            res.status(200).json({ message: 'User reactivated successfully.' });
        } catch (error) {
            console.error(`ReactivateUser controller error for ID ${id}:`, error.message);
             if (error.message.includes('Unauthorized')) {
                 return res.status(403).json({ error: error.message });
             }
             if (error.message.includes('not found')) {
                 return res.status(404).json({ error: 'User not found.' });
             }
            res.status(500).json({ error: error.message || 'Failed to reactivate user.' });
        }
    }
};

export default userController;