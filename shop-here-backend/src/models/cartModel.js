import pool from '../src/db.js';

const Cart = {
    get: async (userId) => {
        try {
            const [rows] = await pool.execute(`
                SELECT c.cart_item_id, c.product_id, c.quantity,
                       p.name AS product_name, p.price
                FROM carts c
                JOIN products p ON c.product_id = p.product_id
                WHERE c.user_id = ?
            `, [userId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching cart for user ${userId}:`, error);
            throw error;
        }
    },

    addItem: async (userId, productId, quantity) => {
        try {
            // Check if the item already exists in the cart
            const [existingItem] = await pool.execute(
                'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );

            if (existingItem.length > 0) {
                // If it exists, update the quantity
                const [result] = await pool.execute(
                    'UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                    [quantity, userId, productId]
                );
                return result;
            } else {
                // If it doesn't exist, add a new item
                const [result] = await pool.execute(
                    'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, quantity]
                );
                return result;
            }
        } catch (error) {
            console.error(`Error adding item to cart for user ${userId}:`, error);
            throw error;
        }
    },

    updateItemQuantity: async (userId, productId, quantity) => {
        try {
            const [result] = await pool.execute(
                'UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
            return result;
        } catch (error) {
            console.error(`Error updating cart item quantity for user ${userId}:`, error);
            throw error;
        }
    },

    removeItem: async (userId, productId) => {
        try {
            const [result] = await pool.execute(
                'DELETE FROM carts WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
            return result;
        } catch (error) {
            console.error(`Error removing item from cart for user ${userId}:`, error);
            throw error;
        }
    },
};

export default Cart;