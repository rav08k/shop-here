import pool from '../src/db.js';

const Order = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM orders');
            return rows;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM orders WHERE order_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching order with ID ${id}:`, error);
            throw error;
        }
    },

    create: async (orderData) => {
        try {
            const fields = Object.keys(orderData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO orders (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(orderData));
            return result;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    update: async (id, orderData) => {
        try {
            const fields = Object.keys(orderData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE orders SET ${setClause} WHERE order_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(orderData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating order with ID ${id}:`, error);
            throw error;
        }
    },

    getOrderHistory: async (userId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching order history for user ${userId}:`, error);
            throw error;
        }
    },
};

export default Order;