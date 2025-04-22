import Order from '../models/order.js'; // Assuming your order model path

const orderController = {
    createOrder: async (req, res) => {
        try {
            const orderData = req.body; // Adjust based on your order structure
            const result = await Order.create(orderData);
            res.status(201).json({ message: 'Order created', orderId: result.insertId });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.getAll();
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },

    getOrderById: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await Order.getById(id);
            if (rows.length === 0) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(`Error fetching order with ID ${id}:`, error);
            res.status(500).json({ error: 'Failed to fetch order' });
        }
    },

    updateOrder: async (req, res) => {
        const { id } = req.params;
        const orderData = req.body; // Adjust based on what can be updated
        try {
            const result = await Order.update(id, orderData);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.json({ message: 'Order updated' });
        } catch (error) {
            console.error(`Error updating order with ID ${id}:`, error);
            res.status(500).json({ error: 'Failed to update order' });
        }
    },

    getOrderHistory: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const orderHistory = await Order.getOrderHistory(userId);
            res.json(orderHistory);
        } catch (error) {
            console.error(`Error fetching order history for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to fetch order history' });
        }
    },

    getOrderHistoryForUser: async (req, res) => {
        const { userId } = req.params;
        try {
            const orderHistory = await Order.getOrderHistory(userId);
            res.json(orderHistory);
        } catch (error) {
            console.error(`Error fetching order history for user ${userId} (admin):`, error);
            res.status(500).json({ error: 'Failed to fetch order history' });
        }
    },
};

export default orderController;