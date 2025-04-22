import pool from '../src/db.js';

const Review = {
    getByProductId: async (productId) => {
        try {
            const [rows] = await pool.execute(`
                SELECT r.review_id, r.user_id, r.rating, r.comment, r.created_at,
                       u.first_name, u.last_name
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                WHERE r.product_id = ?
                ORDER BY r.created_at DESC
            `, [productId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}:`, error);
            throw error;
        }
    },

    create: async (reviewData) => {
        try {
            const fields = Object.keys(reviewData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO reviews (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(reviewData));
            return result;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    update: async (id, reviewData) => {
        try {
            const fields = Object.keys(reviewData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE reviews SET ${setClause} WHERE review_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(reviewData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating review with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM reviews WHERE review_id = ?', [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting review with ID ${id}:`, error);
            throw error;
        }
    },
};

export default Review;