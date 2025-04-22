import Review from '../models/review.js'; // Assuming your review model path

const reviewController = {
    createReview: async (req, res) => {
        try {
            // Assuming you have user authentication middleware that populates req.user
            const userId = req.user.user_id; // Adjust based on your user object
            const { productId, rating, comment } = req.body;
            const result = await Review.create({ user_id: userId, product_id: productId, rating, comment });
            res.status(201).json({ message: 'Review created', reviewId: result.insertId });
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ error: 'Failed to create review' });
        }
    },

    getReviewsByProduct: async (req, res) => {
        const { productId } = req.params;
        try {
            const reviews = await Review.getByProductId(productId);
            res.json(reviews);
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}:`, error);
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    },

    // Optional: Add routes for updating or deleting reviews (with proper authorization)
    // For example:

    // updateReview: async (req, res) => {
    //     const { id } = req.params;
    //     const { rating, comment } = req.body;
    //     try {
    //         const result = await Review.update(id, { rating, comment });
    //         if (result.affectedRows > 0) {
    //             res.json({ message: 'Review updated' });
    //         } else {
    //             res.status(404).json({ error: 'Review not found' });
    //         }
    //     } catch (error) {
    //         console.error(`Error updating review with ID ${id}:`, error);
    //         res.status(500).json({ error: 'Failed to update review' });
    //     }
    // },

    // deleteReview: async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const result = await Review.delete(id);
    //         if (result.affectedRows > 0) {
    //             res.status(204).send(); // No content for successful deletion
    //         } else {
    //             res.status(404).json({ error: 'Review not found' });
    //         }
    //     } catch (error) {
    //         console.error(`Error deleting review with ID ${id}:`, error);
    //         res.status(500).json({ error: 'Failed to delete review' });
    //     }
    // },
};

export default reviewController;