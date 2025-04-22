import pool from '../src/db.js';

const Category = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM categories');
            return rows;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM categories WHERE category_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
            throw error;
        }
    },

    create: async (categoryData) => {
        try {
            const fields = Object.keys(categoryData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO categories (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(categoryData));
            return result;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    update: async (id, categoryData) => {
        try {
            const fields = Object.keys(categoryData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE categories SET ${setClause} WHERE category_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(categoryData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM categories WHERE category_id = ?', [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
    }
};

export default Category;