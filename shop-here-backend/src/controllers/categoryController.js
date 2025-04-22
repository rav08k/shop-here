import Category from '../models/category.js'; // Assuming your category model path

const categoryController = {
    createCategory: async (req, res) => {
        const { name } = req.body;
        try {
            const result = await Category.create({ name });
            res.status(201).json({ message: 'Category created', categoryId: result.insertId });
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ error: 'Failed to create category' });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.getAll();
            res.json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },

    getCategoryById: async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await Category.getById(id);
            if (rows.length === 0) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    },

    updateCategory: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const result = await Category.update(id, { name });
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            res.json({ message: 'Category updated' });
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            res.status(500).json({ error: 'Failed to update category' });
        }
    },

    deleteCategory: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await Category.delete(id);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            res.status(204).send(); // No content for successful deletion
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            res.status(500).json({ error: 'Failed to delete category' });
        }
    },

    createSubcategory: async (req, res) => {
        const { categoryId } = req.params;
        const { name } = req.body;
        try {
            const result = await Category.createSubcategory(categoryId, { name });
            res.status(201).json({ message: 'Subcategory created', subcategoryId: result.insertId });
        } catch (error) {
            console.error(`Error creating subcategory under category ${categoryId}:`, error);
            res.status(500).json({ error: 'Failed to create subcategory' });
        }
    },

    getSubcategoriesByCategory: async (req, res) => {
        const { categoryId } = req.params;
        try {
            const subcategories = await Category.getSubcategories(categoryId);
            res.json(subcategories);
        } catch (error) {
            console.error(`Error fetching subcategories for category ${categoryId}:`, error);
            res.status(500).json({ error: 'Failed to fetch subcategories' });
        }
    },

    getAllCategoriesWithSubcategories: async (req, res) => {
        try {
            const categoriesWithSubcategories = await Category.getAllWithSubcategories();
            res.json(categoriesWithSubcategories);
        } catch (error) {
            console.error('Error fetching categories with subcategories:', error);
            res.status(500).json({ error: 'Failed to fetch categories with subcategories' });
        }
    },
};

export default categoryController;