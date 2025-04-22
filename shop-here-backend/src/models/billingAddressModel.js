import pool from '../src/db.js';

const BillingAddress = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM billing_addresses');
            return rows;
        } catch (error) {
            console.error('Error fetching all billing addresses:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM billing_addresses WHERE address_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching billing address with ID ${id}:`, error);
            throw error;
        }
    },

    getByUserId: async (userId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM billing_addresses WHERE user_id = ?', [userId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching billing addresses for user ID ${userId}:`, error);
            throw error;
        }
    },

    create: async (addressData) => {
        try {
            const fields = Object.keys(addressData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO billing_addresses (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(addressData));
            return result;
        } catch (error) {
            console.error('Error creating billing address:', error);
            throw error;
        }
    },

    update: async (id, addressData) => {
        try {
            const fields = Object.keys(addressData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE billing_addresses SET ${setClause} WHERE address_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(addressData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating billing address with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM billing_addresses WHERE address_id = ?', [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting billing address with ID ${id}:`, error);
            throw error;
        }
    },
};

export default BillingAddress;