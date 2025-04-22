import Wishlist from '../models/wishlist.js'; // Assuming your wishlist model path

const wishlistController = {
    getWishlist: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const wishlistItems = await Wishlist.get(userId);
            res.json(wishlistItems);
        } catch (error) {
            console.error(`Error fetching wishlist for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to fetch wishlist' });
        }
    },

    addItem: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const { productId } = req.body;
            const result = await Wishlist.addItem(userId, productId);
            res.status(201).json({ message: 'Item added to wishlist', wishlistItemId: result.insertId });
        } catch (error) {
            console.error(`Error adding item to wishlist for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to add item to wishlist' });
        }
    },

    removeItem: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const { productId } = req.params; // Assuming you use productId in the route params for deletion
            const result = await Wishlist.removeItem(userId, productId);
            if (result.affectedRows > 0) {
                res.status(204).send(); // No content for successful removal
            } else {
                res.status(404).json({ error: 'Wishlist item not found' });
            }
        } catch (error) {
            console.error(`Error removing item from wishlist for user ${userId}:`, error);
            res.status(500).json({ error: 'Failed to remove item from wishlist' });
        }
    },
};

export default wishlistController;