import pool from '../src/db.js';

const Subcategory = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM subcategories');
            return rows;
        } catch (error) {
            console.error('Error fetching all subcategories:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM subcategories WHERE subcategory_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching subcategory with ID ${id}:`, error);
            throw error;
        }
    },

    getByCategoryId: async (categoryId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM subcategories WHERE category_id = ?', [categoryId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching subcategories for category ID ${categoryId}:`, error);
            throw error;
        }
    },

    create: async (subcategoryData) => {
        try {
            const fields = Object.keys(subcategoryData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO subcategories (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(subcategoryData));
            return result;
        } catch (error) {
            console.error('Error creating subcategory:', error);
            throw error;
        }
    },

    update: async (id, subcategoryData) => {
        try {
            const fields = Object.keys(subcategoryData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE subcategories SET ${setClause} WHERE subcategory_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(subcategoryData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating subcategory with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM subcategories WHERE subcategory_id = ?', [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting subcategory with ID ${id}:`, error);
            throw error;
        }
    },
};

export default Subcategory;