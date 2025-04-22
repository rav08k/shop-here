import pool from '../src/db.js';

const Brand = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM brands');
            return rows;
        } catch (error) {
            console.error('Error fetching all brands:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM brands WHERE brand_id = ?', [id]);
            return rows;
        } catch (error) {
            console.error(`Error fetching brand with ID ${id}:`, error);
            throw error;
        }
    },

    create: async (brandData) => {
        try {
            const fields = Object.keys(brandData);
            const placeholders = fields.map(() => '?').join(', ');
            const query = `INSERT INTO brands (${fields.join(', ')}) VALUES (${placeholders})`;
            const [result] = await pool.execute(query, Object.values(brandData));
            return result;
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    },

    update: async (id, brandData) => {
        try {
            const fields = Object.keys(brandData);
            const setClause = fields.map(key => `${key} = ?`).join(', ');
            const query = `UPDATE brands SET ${setClause} WHERE brand_id = ?`;
            const [result] = await pool.execute(query, [...Object.values(brandData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating brand with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM brands WHERE brand_id = ?', [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting brand with ID ${id}:`, error);
            throw error;
        }
    },
};

export default Brand;