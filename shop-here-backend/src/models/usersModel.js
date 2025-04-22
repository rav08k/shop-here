import pool from '../db.js'; // Assuming db.js exports the mysql2 connection pool

/**
 * User Model
 * Handles database operations for the users table.
 */
const User = {
    /**
     * Retrieves all users (active and inactive).
     * Excludes password hash.
     * @returns {Promise<Array>} A promise that resolves to an array of user objects.
     */
    getAll: async () => {
        const query = `
            SELECT user_id, email, contact, first_name, last_name, address, role, created_at, updated_at, is_active
            FROM users
        `;
        try {
            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            console.error('Error in User.getAll:', error);
            throw error; // Re-throw error for handling in service/controller layer
        }
    },

    /**
     * Retrieves a single user by their ID, regardless of active status.
     * Excludes password hash.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object or null if not found.
     */
    getById: async (id) => {
        const query = `
            SELECT user_id, email, contact, first_name, last_name, address, role, created_at, updated_at, is_active
            FROM users
            WHERE user_id = ?
        `;
        try {
            const [rows] = await pool.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null; // Return single object or null
        } catch (error) {
            console.error(`Error in User.getById for ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Retrieves a single *active* user by their ID.
     * Excludes password hash.
     * @param {number} id - The ID of the active user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the active user object or null if not found/inactive.
     */
    findActiveById: async (id) => {
        const query = `
            SELECT user_id, email, contact, first_name, last_name, address, role, created_at, updated_at, is_active
            FROM users
            WHERE user_id = ? AND is_active = true
        `;
        try {
            const [rows] = await pool.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error in User.findActiveById for ID ${id}:`, error);
            throw error;
        }
    },


    /**
     * Retrieves a single user by their email, regardless of active status.
     * Includes password hash for authentication purposes.
     * @param {string} email - The email of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object (including password) or null if not found.
     */
    getByEmail: async (email) => {
        const query = `
            SELECT user_id, email, contact, password, first_name, last_name, address, role, created_at, updated_at, is_active
            FROM users
            WHERE email = ?
        `;
        try {
            const [rows] = await pool.execute(query, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error in User.getByEmail for email ${email}:`, error);
            throw error;
        }
    },

     /**
     * Retrieves a single *active* user by their email.
     * Includes password hash for authentication purposes.
     * Commonly used for login.
     * @param {string} email - The email of the active user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the active user object (including password) or null if not found/inactive.
     */
    findActiveByEmail: async (email) => {
        const query = `
            SELECT user_id, email, contact, password, first_name, last_name, address, role, created_at, updated_at, is_active
            FROM users
            WHERE email = ? AND is_active = true
        `;
        try {
            const [rows] = await pool.execute(query, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error in User.findActiveByEmail for email ${email}:`, error);
            throw error;
        }
    },

    /**
     * Retrieves a single user by their contact number, regardless of active status.
     * Includes password hash for authentication purposes (e.g., OTP login flow).
     * @param {string} contact - The contact number of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object (including password) or null if not found.
     */
    findByContact: async (contact) => {
        const query = `
            SELECT user_id, email, contact, password, first_name, last_name, address, role, created_at, updated_at, is_active
            FROM users
            WHERE contact = ?
        `;
        try {
            const [rows] = await pool.execute(query, [contact]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error in User.findByContact for contact ${contact}:`, error);
            throw error;
        }
    },

    /**
     * Checks if an email already exists in the users table.
     * @param {string} email - The email to check.
     * @returns {Promise<boolean>} True if the email exists, false otherwise.
     */
    checkEmailExists: async (email) => {
        const query = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
        try {
            const [rows] = await pool.execute(query, [email]);
            return rows.length > 0;
        } catch (error) {
            console.error(`Error checking email existence for ${email}:`, error);
            throw error;
        }
    },

    /**
     * Checks if a contact number already exists in the users table.
     * @param {string} contact - The contact number to check.
     * @returns {Promise<boolean>} True if the contact exists, false otherwise.
     */
    checkContactExists: async (contact) => {
        const query = "SELECT 1 FROM users WHERE contact = ? LIMIT 1";
        try {
            const [rows] = await pool.execute(query, [contact]);
            return rows.length > 0;
        } catch (error) {
            console.error(`Error checking contact existence for ${contact}:`, error);
            throw error;
        }
    },

    /**
     * Creates a new user.
     * Assumes password hashing and validation occur in the service layer.
     * Assumes created_at/updated_at are handled by DB defaults.
     * @param {Object} userData - An object containing user data (e.g., { email, password, first_name, ... }).
     * @returns {Promise<Object>} A promise that resolves to the result object from the database operation (contains insertId, affectedRows, etc.).
     */
    create: async (userData) => {
        const fields = Object.keys(userData);
        const placeholders = fields.map(() => '?').join(', ');
        const query = `INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders})`;
        try {
            const [result] = await pool.execute(query, Object.values(userData));
            return result;
        } catch (error) {
            console.error('Error in User.create:', error);
            throw error;
        }
    },

    /**
     * Updates an existing user by ID.
     * Assumes validation occurs in the service layer.
     * Assumes updated_at is handled by DB default ON UPDATE.
     * @param {number} id - The ID of the user to update.
     * @param {Object} userData - An object containing the fields to update (e.g., { first_name: 'New', contact: '123' }).
     * @returns {Promise<Object>} A promise that resolves to the result object from the database operation.
     */
    update: async (id, userData) => {
        const fields = Object.keys(userData);
        if (fields.length === 0) {
             throw new Error("No fields provided for update.");
        }
        const setClause = fields.map((key) => `${key} = ?`).join(", ");
        const query = `UPDATE users SET ${setClause} WHERE user_id = ?`;
        try {
            const [result] = await pool.execute(query, [...Object.values(userData), id]);
            return result;
        } catch (error) {
            console.error(`Error in User.update for ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a user by setting is_active to false.
     * @param {number} id - The ID of the user to soft delete.
     * @returns {Promise<Object>} A promise that resolves to the result object from the database operation.
     */
    softDelete: async (id) => {
        const query = `UPDATE users SET is_active = false WHERE user_id = ?`;
        try {
            const [result] = await pool.execute(query, [id]);
            return result;
        } catch (error) {
            console.error(`Error in User.softDelete for ID ${id}:`, error);
            throw error;
        }
    },

     /**
     * Reactivates a user by setting is_active to true.
     * @param {number} id - The ID of the user to reactivate.
     * @returns {Promise<Object>} A promise that resolves to the result object from the database operation.
     */
    reactivate: async (id) => {
        const query = `UPDATE users SET is_active = true WHERE user_id = ?`;
        try {
            const [result] = await pool.execute(query, [id]);
            return result;
        } catch (error) {
            console.error(`Error in User.reactivate for ID ${id}:`, error);
            throw error;
        }
    },

};

export default User;