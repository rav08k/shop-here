import Cart from '../models/cart.js'; // Assuming your cart model path

const cartController = {
    getCart: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const cartItems = await Cart.get(userId);
            res.json(cartItems);
        } catch (error) {
            console.error(`Error fetching cart for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to fetch cart' });
        }
    },

    addItem: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const { productId, quantity } = req.body;
            const result = await Cart.addItem(userId, productId, quantity);
            res.status(201).json({ message: 'Item added to cart', cartItemId: result.insertId });
        } catch (error) {
            console.error(`Error adding item to cart for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to add item to cart' });
        }
    },

    updateItemQuantity: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const { productId, quantity } = req.body;
            const result = await Cart.updateItemQuantity(userId, productId, quantity);
            if (result.affectedRows > 0) {
                res.json({ message: 'Cart item quantity updated' });
            } else {
                res.status(404).json({ error: 'Cart item not found' });
            }
        } catch (error) {
            console.error(`Error updating cart item quantity for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to update cart item quantity' });
        }
    },

    removeItem: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const { productId } = req.body; // Or req.params.productId depending on your route
            const result = await Cart.removeItem(userId, productId);
            if (result.affectedRows > 0) {
                res.status(204).send(); // No content for successful removal
            } else {
                res.status(404).json({ error: 'Cart item not found' });
            }
        } catch (error) {
            console.error(`Error removing item from cart for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to remove item from cart' });
        }
    },
};

export default cartController;