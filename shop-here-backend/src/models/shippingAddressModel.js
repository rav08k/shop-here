import pool from '../src/db.js';

const ShippingAddress = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM shipping_addresses');
            return rows;
        } catch (error) {
            console.error('Error fetching all shipping addresses:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM shipping_addresses WHERE shipping_address_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching shipping address with ID ${id}:`, error);
            throw error;
        }
    },

    getByUserId: async (userId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM shipping_addresses WHERE user_id = ?', [userId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching shipping addresses for user ID ${userId}:`, error);
            throw error;
        }
    },

    create: async (addressData) => {
        try {
            const fields = Object.keys(addressData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO shipping_addresses (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(addressData));
            return result;
        } catch (error) {
            console.error('Error creating shipping address:', error);
            throw error;
        }
    },

    update: async (id, addressData) => {
        try {
            const fields = Object.keys(addressData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE shipping_addresses SET ${setClause} WHERE shipping_address_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(addressData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating shipping address with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM shipping_addresses WHERE shipping_address_id = ?', [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting shipping address with ID ${id}:`, error);
            throw error;
        }
    },
};

export default ShippingAddress;