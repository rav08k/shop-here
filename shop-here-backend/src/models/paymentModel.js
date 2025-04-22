import pool from '../src/db.js';

const Payment = {
    process: async (paymentData) => {
        try {
            const fields = Object.keys(paymentData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO payments (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(paymentData));
            return result;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    },

    // Example for handling webhook data (adjust based on your payment gateway)
    handleWebhook: async (webhookData) => {
        try {
            // Implement logic to verify the webhook signature and update order status
            console.log('Webhook data received:', webhookData);
            // Example:
            // await pool.execute('UPDATE orders SET payment_status = ? WHERE order_id = ?', [webhookData.status, webhookData.orderId]);
            return; // Or return relevant data
        } catch (error) {
            console.error('Error handling payment webhook:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM payments WHERE payment_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching payment details with ID ${id}:`, error);
            throw error;
        }
    },
};

export default Payment;