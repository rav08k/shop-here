import express from 'express';
const categoryRouter = express.Router();

// Create a new category (Admin)
categoryRouter.post('/', (req, res) => {
    // Placeholder for controller function
});

// Get all categories
categoryRouter.get('/', (req, res) => {
    // Placeholder for controller function
});

// Get a single category by ID
categoryRouter.get('/:id', (req, res) => {
    // Placeholder for controller function
});

// Update a category (Admin)
categoryRouter.put('/:id', (req, res) => {
    // Placeholder for controller function
});

// Delete a category (Admin)
categoryRouter.delete('/:id', (req, res) => {
    // Placeholder for controller function
});

// Create a new subcategory (Admin) - If you have subcategories
categoryRouter.post('/:categoryId/subcategories', (req, res) => {
    // Placeholder for controller function
});

// Get subcategories for a category - If you have subcategories
categoryRouter.get('/:categoryId/subcategories', (req, res) => {
     // Placeholder for controller function
});

// Get a list of all categories (with or without subcategories)
categoryRouter.get('/all', (req, res) => {
    // Placeholder for controller function
});

export default categoryRouter;