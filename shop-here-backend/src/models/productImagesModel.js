import pool from "../db.js"; // Assuming db.js exports the mysql2 connection pool

/**
 * Product Image Model
 * Handles database operations for the product_images table.
 */
const ProductImage = {
	/**
	 * Retrieves all image records for a specific product.
	 * Accepts an optional connection for transaction support.
	 * @param {number} productId - The ID of the product.
	 * @param {object} [connection=pool] - Optional DB connection for transactions.
	 * @returns {Promise<Array>} A promise that resolves to an array of image objects.
	 */
	getByProductId: async (productId, connection = pool) => {
		try {
			const images = await ProductImage.getByProductIds([productId],connection);
			return images;
		} catch (error) {
			console.error(
				`Error fetching images for product ID ${productId}:`,
				error
			);
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
        SELECT image_id, product_id, image_url
        FROM product_images
        WHERE product_id IN (${placeholders})
        ORDER BY product_id
    `;

		try {
			const [rows] = await connection.execute(query, productIds);
			return rows;
		} catch (error) {
			console.error("Error in ProductImage.getByProductIds:", error);
			throw error;
		}
	},

	/**
	 * Creates a new product image entry.
	 * @param {Object} imageData - Data including product_id and image_url.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	create: async (imageData, connection = pool) => {
		// Assumes validation in service layer
		const fields = Object.keys(imageData);
		const placeholders = fields.map(() => "?").join(", ");
		const query = `INSERT INTO product_images (${fields.join(
			", "
		)}) VALUES (${placeholders})`;
		try {
			const [result] = await connection.execute(
				query,
				Object.values(imageData)
			);
			return result;
		} catch (error) {
			console.error("Error creating product image:", error);
			throw error;
		}
	},

	/**
	 * Deletes a specific product image entry by its primary key.
	 * @param {number} imageId - The ID of the image record to delete.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	delete: async (imageId) => {
		const query = "DELETE FROM product_images WHERE image_id = ?";
		try {
			const [result] = await pool.execute(query, [imageId]);
			return result;
		} catch (error) {
			console.error(`Error deleting product image with ID ${imageId}:`, error);
			throw error;
		}
	},

	/**
	 * Deletes all image entries associated with a specific product ID.
	 * Accepts an optional connection for transaction support.
	 * @param {number} productId - The ID of the product whose images should be deleted.
	 * @param {object} [connection=pool] - Optional DB connection for transactions.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	deleteByProductId: async (productId, connection = pool) => {
		const query = "DELETE FROM product_images WHERE product_id = ?";
		try {
			const [result] = await connection.execute(query, [productId]);
			console.log(
				`Deleted images for product ID ${productId}: ${result.affectedRows} rows affected.`
			); // Added log
			return result;
		} catch (error) {
			console.error(
				`Error deleting images for product ID ${productId}:`,
				error
			);
			throw error;
		}
	},
};

export default ProductImage;
