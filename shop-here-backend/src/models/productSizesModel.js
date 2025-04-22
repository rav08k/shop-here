import pool from '../db.js'; // Assuming db.js exports the mysql2 connection pool

/**
 * Product Size Model
 * Handles database operations for the product_avail_sizes table.
 */
const ProductSize = {
    /**
     * Retrieves all available sizes for a specific product.
     * @param {number} productId - The ID of the product.
     * @returns {Promise<Array>} A promise that resolves to an array of size objects.
     */
    getByProductId: async (productId) => {
        const query = 'SELECT size_id, product_id, size_name FROM product_avail_sizes WHERE product_id = ?';
        try {
            const [rows] = await pool.execute(query, [productId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching sizes for product ID ${productId}:`, error);
            throw error;
        }
    },

    /**
	 * Gets all images for multiple products in a single query
	 * @param {Array<number>} productIds - Array of product IDs
	 * @param {Object} [connection=pool] - Optional database connection for transactions
	 * @returns {Promise<Array>} Array of image objects with product_id
	 */
	getByProductIds: async (productIds, connection = pool) => {
		if (!productIds || productIds.length === 0) {
			return [];
		}

		const placeholders = productIds.map(() => "?").join(",");
		const query = `
        SELECT size_id, product_id, size_name
        FROM product_avail_sizes
        WHERE product_id IN (${placeholders})
        ORDER BY product_id
    `;

		try {
			const [rows] = await connection.execute(query, productIds);
			return rows;
		} catch (error) {
			console.error("Error in ProductSizes.getByProductIds:", error);
			throw error;
		}
	},

    /**
     * Creates a new product size entry.
     * @param {Object} sizeData - Data including product_id and size_name.
     * @returns {Promise<Object>} Result object from the database.
     */
    create: async (sizeData,connection=pool) => {
        // Assumes validation in service layer
        const fields = Object.keys(sizeData);
        const placeholders = fields.map(() => '?').join(', ');
        const query = `INSERT INTO product_avail_sizes (${fields.join(', ')}) VALUES (${placeholders})`;
        try {
            const [result] = await connection.execute(query, Object.values(sizeData));
            return result;
        } catch (error) {
            console.error('Error creating product size:', error);
            throw error;
        }
    },

     /**
     * Deletes a specific product size entry by its primary key.
     * @param {number} sizeId - The ID of the size record to delete.
     * @returns {Promise<Object>} Result object from the database.
     */
    delete: async (sizeId) => {
        const query = 'DELETE FROM product_avail_sizes WHERE size_id = ?';
        try {
            const [result] = await pool.execute(query, [sizeId]);
            return result;
        } catch (error) {
            console.error(`Error deleting product size with ID ${sizeId}:`, error);
            throw error;
        }
    },

    /**
     * Deletes all size entries associated with a specific product ID.
     * Accepts an optional connection for transaction support.
     * @param {number} productId - The ID of the product whose sizes should be deleted.
     * @param {object} [connection=pool] - Optional DB connection for transactions.
     * @returns {Promise<Object>} Result object from the database.
     */
    deleteByProductId: async (productId, connection = pool) => {
        const query = 'DELETE FROM product_avail_sizes WHERE product_id = ?';
        try {
            const [result] = await connection.execute(query, [productId]);
             console.log(`Deleted sizes for product ID ${productId}: ${result.affectedRows} rows affected.`); // Added log
            return result;
        } catch (error) {
            console.error(`Error deleting sizes for product ID ${productId}:`, error);
            throw error;
        }
    },

};

export default ProductSize;