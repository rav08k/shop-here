import pool from '../src/db.js';

const Wishlist = {
    // Get all items in a user's wishlist with product details
    get: async (userId) => {
        try {
            const [rows] = await pool.execute(`
                SELECT w.user_id, w.product_id, w.added_at,
                       p.name AS product_name, p.price, p.thumbnail_url
                FROM wishlist w
                JOIN products p ON w.product_id = p.product_id
                WHERE w.user_id = ?
                ORDER BY w.added_at DESC
            `, [userId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching wishlist for user ${userId}:`, error);
            throw error;
        }
    },

    // Check if a specific product is in a user's wishlist
    getByUserAndProduct: async (userId, productId) => {
        try {
            const [rows] = await pool.execute(`
                SELECT user_id, product_id, added_at
                FROM wishlist
                WHERE user_id = ? AND product_id = ?
            `, [userId, productId]);
            return rows[0]; // Returns the wishlist item object if found, otherwise undefined
        } catch (error) {
            console.error(`Error fetching wishlist item for user ${userId} and product ${productId}:`, error);
            throw error;
        }
    },

    // Add a product to a user's wishlist
    add: async (userId, productId) => {
        try {
            const [result] = await pool.execute(`
                INSERT INTO wishlist (user_id, product_id)
                VALUES (?, ?)
            `, [userId, productId]);
            return result.affectedRows > 0; // Returns true if the insertion was successful
        } catch (error) {
            console.error(`Error adding product ${productId} to wishlist for user ${userId}:`, error);
            throw error;
        }
    },

    // Remove a product from a user's wishlist
    remove: async (userId, productId) => {
        try {
            const [result] = await pool.execute(`
                DELETE FROM wishlist
                WHERE user_id = ? AND product_id = ?
            `, [userId, productId]);
            return result.affectedRows > 0; // Returns true if the deletion was successful
        } catch (error) {
            console.error(`Error removing product ${productId} from wishlist for user ${userId}:`, error);
            throw error;
        }
    },

    // Remove all items from a user's wishlist (optional, but could be useful)
    clear: async (userId) => {
        try {
            const [result] = await pool.execute(`
                DELETE FROM wishlist
                WHERE user_id = ?
            `, [userId]);
            return result.affectedRows > 0; // Returns true if any items were deleted
        } catch (error) {
            console.error(`Error clearing wishlist for user ${userId}:`, error);
            throw error;
        }
    },
};

export default Wishlist;