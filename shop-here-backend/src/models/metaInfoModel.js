import pool from "../db.js"; // Assuming db.js exports the mysql2 connection pool

/**
 * Meta Info Model
 * Handles database operations for the meta_info table.
 */
const MetaInfo = {
	/**
	 * Retrieves meta info for a specific product.
	 * @param {number} productId - The ID of the product.
	 * @returns {Promise<Object|null>} The meta info object or null if not found.
	 */
	getByProductId: async (productId, connection = pool) => {
		try {
			const rows = await MetaInfo.getByProductIds([productId],connection);
			return rows.length > 0 ? rows[0] : null;
		} catch (error) {
			console.error(
				`Error fetching meta info for product ID ${productId}:`,
				error
			);
			throw error;
		}
	},

	/**
	 * Retrieves meta info for a specific product.
	 * @param {number} productIds -  Array of product IDs.
	 * @returns {Promise<Object|null>} Array of meta_info objects with product_id
	 */
	getByProductIds: async (productIds, connection = pool) => {
		if (!productIds || productIds.length === 0) {
			return [];
		}

		const placeholders = productIds.map(() => "?").join(",");
		const query = `SELECT product_id, dimensions, weight, warranty, return_policy, created_at, updated_at FROM meta_info WHERE product_id IN (${placeholders}) `;


		try {
			const [rows] = await connection.execute(query, productIds);
			return rows;
		} catch (error) {
			console.error("Error in MetaInfo.getByProductIds:", error);
			throw error;
		}
	},

	/**
	 * Creates a new meta info entry for a product.
	 * Assumes a product has only one meta info row (otherwise use update).
	 * @param {Object} metaData - Data including product_id, dimensions, weight, etc.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	create: async (metaData, connection = pool) => {
		// Assumes validation in service layer
		const fields = Object.keys(metaData);
		const placeholders = fields.map(() => "?").join(", ");
		const query = `INSERT INTO meta_info (${fields.join(
			", "
		)}) VALUES (${placeholders})`;
		try {
			const [result] = await connection.execute(query, Object.values(metaData));
			return result;
		} catch (error) {
			console.error("Error creating meta info:", error);
			throw error;
		}
	},

	/**
	 * Updates meta info by its primary key.
	 * @param {number} metaId - The ID of the meta info record.
	 * @param {Object} metaData - Fields to update.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	update: async (metaId, metaData) => {
		// Assumes validation in service layer
		const fields = Object.keys(metaData);
		if (fields.length === 0) throw new Error("No fields provided for update.");
		const setClause = fields.map((key) => `${key} = ?`).join(", ");
		const query = `UPDATE meta_info SET ${setClause} WHERE meta_id = ?`;
		try {
			const [result] = await pool.execute(query, [
				...Object.values(metaData),
				metaId,
			]);
			return result;
		} catch (error) {
			console.error(`Error updating meta info with ID ${metaId}:`, error);
			throw error;
		}
	},

	/**
	 * Deletes meta info by its primary key.
	 * @param {number} metaId - The ID of the meta info record to delete.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	delete: async (metaId) => {
		const query = "DELETE FROM meta_info WHERE meta_id = ?";
		try {
			const [result] = await pool.execute(query, [metaId]);
			return result;
		} catch (error) {
			console.error(`Error deleting meta info with ID ${metaId}:`, error);
			throw error;
		}
	},

	/**
	 * Deletes the meta info entry associated with a specific product ID.
	 * Accepts an optional connection for transaction support.
	 * @param {number} productId - The ID of the product whose meta info should be deleted.
	 * @param {object} [connection=pool] - Optional DB connection for transactions.
	 * @returns {Promise<Object>} Result object from the database.
	 */
	deleteByProductId: async (productId, connection = pool) => {
		const query = "DELETE FROM meta_info WHERE product_id = ?";
		try {
			const [result] = await connection.execute(query, [productId]);
			console.log(
				`Deleted meta info for product ID ${productId}: ${result.affectedRows} rows affected.`
			); // Added log
			return result;
		} catch (error) {
			console.error(
				`Error deleting meta info for product ID ${productId}:`,
				error
			);
			throw error;
		}
	},
};

export default MetaInfo;
