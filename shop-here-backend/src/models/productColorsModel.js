import pool from "../db.js"; // Assuming db.js exports the mysql2 connection pool

/**
 * Product Color Model
 * Handles database operations for the product_avail_colors table.
 */
const ProductColor = {
	/**
	 * Retrieves all available colors for a specific product.
	 * @param {number} productId - The ID of the product.
	 * @returns {Promise<Array>} A promise that resolves to an array of color objects.
	 */
	getByProductId: async (productId, connection = pool) => {
		try {
            const colors = await ProductColor.getByProductIds([productId], connection);
            return colors;
        } catch (error) {
            console.error(`Error fetching colors for product ID ${productId}:`, error);
            throw error;
        }
	},

	/**
	 * Gets all available colors for multiple products in a single query
	 * @param {Array<number>} productIds - Array of product IDs
	 * @param {Object} [connection=pool] - Optional database connection for transactions
	 * @returns {Promise<Array>} Array of color objects with product_id
	 */
	getByProductIds: async (productIds, connection = pool) => {
		if (!productIds || productIds.length === 0) {
			return [];
		}

		const placeholders = productIds.map(() => "?").join(",");
		const query = `
        SELECT color_id, product_id, color_name
        FROM product_avail_colors
        WHERE product_id IN (${placeholders})
        ORDER BY product_id, color_id
    `;

		try {
			const [rows] = await connection.execute(query, productIds);
			return rows;
		} catch (error) {
			console.error("Error in ProductColor.getByProductIds:", error);
			throw error;
		}
	},

	/**
	 * Creates a new product color entry.
	 * @param {Object} colorData - Data including product_id and color_name.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	create: async (colorData, connection = pool) => {
		// Assumes validation in service layer
		const fields = Object.keys(colorData);
		const placeholders = fields.map(() => "?").join(", ");
		const query = `INSERT INTO product_avail_colors (${fields.join(
			", "
		)}) VALUES (${placeholders})`;
		try {
			const [result] = await connection.execute(
				query,
				Object.values(colorData)
			);
			return result;
		} catch (error) {
			console.error("Error creating product color:", error);
			throw error;
		}
	},

	/**
	 * Deletes a specific product color entry by its primary key.
	 * @param {number} colorId - The ID of the color record to delete.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	deletebyColorId: async (colorId, connection = pool) => {
		const query = "DELETE FROM product_avail_colors WHERE color_id = ?";
		try {
			const [result] = await connection.execute(query, [colorId]);
			return result;
		} catch (error) {
			console.error(`Error deleting product color with ID ${colorId}:`, error);
			throw error;
		}
	},

	/**
	 * Deletes all color entries associated with a specific product ID.
	 * Accepts an optional connection for transaction support.
	 * @param {number} productId - The ID of the product whose colors should be deleted.
	 * @param {object} [connection=pool] - Optional DB connection for transactions.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	deleteByProductId: async (productId, connection = pool) => {
		const query = "DELETE FROM product_avail_colors WHERE product_id = ?";
		try {
			const [result] = await connection.execute(query, [productId]);
			console.log(
				`Deleted colors for product ID ${productId}: ${result.affectedRows} rows affected.`
			); // Added log
			return result;
		} catch (error) {
			console.error(
				`Error deleting colors for product ID ${productId}:`,
				error
			);
			throw error;
		}
	},
};

export default ProductColor;
