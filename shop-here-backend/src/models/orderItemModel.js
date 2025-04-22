import pool from '../db.js'; // Assuming db.js exports the mysql2 connection pool

/**
 * OrderItem Model
 * Handles database operations for the order_items table.
 * This table links products to orders, storing quantity and price at the time of purchase.
 */
const OrderItem = {

    /**
     * Creates a new order item entry.
     * Should be called within a transaction managed by the OrderService.
     * @param {Object} orderItemData - Data for the new order item.
     * @param {number} orderItemData.order_id - The ID of the order this item belongs to.
     * @param {number} orderItemData.product_id - The ID of the product ordered.
     * @param {number} orderItemData.quantity - The quantity of the product ordered.
     * @param {number} orderItemData.price_at_purchase - The price of one unit at the time of purchase.
     * @param {object} [connection=pool] - Optional DB connection for transactions.
     * @returns {Promise<Object>} Result object from the database (contains insertId).
     * @throws {Error} If database insertion fails.
     */
    create: async (orderItemData, connection = pool) => {
        // Assumes validation (e.g., quantity > 0) happens in the service layer
        const requiredFields = ['order_id', 'product_id', 'quantity', 'price_at_purchase'];
        const fields = Object.keys(orderItemData).filter(key => requiredFields.includes(key));

        // Basic check to ensure required fields are present in the object keys
        if (fields.length !== requiredFields.length) {
             // More specific check could be done here or rely on DB constraints/service validation
             console.error("Missing required fields for OrderItem.create:", orderItemData);
             throw new Error("Missing required fields to create order item.");
        }

        const placeholders = fields.map(() => '?').join(', ');
        const query = `INSERT INTO order_items (${fields.join(', ')}) VALUES (${placeholders})`;

        try {
            // Use connection if provided (for transactions), otherwise use default pool
            const [result] = await connection.execute(query, Object.values(orderItemData));
            return result;
        } catch (error) {
            console.error('Error creating order item:', error);
            // Check for specific errors like foreign key violations if needed
            throw error; // Re-throw for service layer/transaction handling
        }
    },

    /**
     * Retrieves all items associated with a specific order ID.
     * Joins with the products table to get basic product details for display.
     * Accepts an optional connection for transaction support (though less common for reads).
     * @param {number} orderId - The ID of the order whose items should be retrieved.
     * @param {object} [connection=pool] - Optional DB connection.
     * @returns {Promise<Array>} A promise that resolves to an array of order item objects, each including product details.
     * @throws {Error} If database query fails.
     */
    getByOrderId: async (orderId, connection = pool) => {
        const query = `
            SELECT
                oi.order_item_id,
                oi.order_id,
                oi.product_id,
                oi.quantity,
                oi.price_at_purchase,
                p.name AS product_name,
                p.thumbnail_url AS product_thumbnail_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
            ORDER BY oi.order_item_id ASC
        `; // Order by item ID for consistency
        try {
            const [rows] = await connection.execute(query, [orderId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching order items for order ID ${orderId}:`, error);
            throw error; // Re-throw for service layer handling
        }
    }

};

export default OrderItem;