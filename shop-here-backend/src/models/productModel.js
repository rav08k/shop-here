import pool from '../db.js'; // Assuming db.js exports the mysql2 connection pool

/**
 * Product Model
 * Handles database operations for the products table.
 */
const Product = {
    /**
     * Retrieves a paginated, filtered, and sorted list of product IDs.
     * Also retrieves the total count of products matching the filters.
     * Assumes options are pre-validated and sanitized by the service layer.
     *
     * @param {object} validatedOptions - Validated filtering, sorting, and pagination options from service.
     * @returns {Promise<{productIds: Array<number>, totalCount: number}>} An object containing the list of product IDs for the current page and the total count matching the filters.
     * @throws {Error} If database query fails.
     */
    getAll: async (validatedOptions = {}) => {
        // Set defaults for any missing options
        const {
            category, 
            subcategory, 
            brand, 
            minPrice, 
            maxPrice, 
            search,
            isActive = 1,
            sortByColumn = 'product_id',  
            sortOrder = 'DESC',  
            limit = 10,  
            offset = 0   
        } = validatedOptions;
    
        // Base query for selecting all product details and related information
        let baseSelectQuery = `
            SELECT
                p.*,
                c.category_name,
                sc.subcategory_name,
                b.brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
        `;
    
        let countQuery = `SELECT COUNT(*) as totalCount FROM products p`;
    
        const conditions = [];
        const values = [];
        const countValues = [];
    
        // Only add the isActive condition if it's defined
        if (isActive !== undefined) {
            conditions.push('p.is_active = ?');
            values.push(isActive);
            countValues.push(isActive);
        }
    
        // Add other filter conditions only if they're provided
        if (category !== undefined) {
            conditions.push('p.category_id = ?');
            values.push(category);
            countValues.push(category);
        }
        if (subcategory !== undefined) {
            conditions.push('p.subcategory_id = ?');
            values.push(subcategory);
            countValues.push(subcategory);
        }
        if (brand !== undefined) {
            conditions.push('p.brand_id = ?');
            values.push(brand);
            countValues.push(brand);
        }
        if (minPrice !== undefined) {
            conditions.push('p.price >= ?');
            values.push(minPrice);
            countValues.push(minPrice);
        }
        if (maxPrice !== undefined) {
            conditions.push('p.price <= ?');
            values.push(maxPrice);
            countValues.push(maxPrice);
        }
        if (search) {
            conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
            const searchTerm = `%${search}%`;
            values.push(searchTerm, searchTerm);
            countValues.push(searchTerm, searchTerm);
        }
    
        // Add WHERE clause only if there are conditions
        let whereClause = '';
        if (conditions.length > 0) {
            whereClause = ' WHERE ' + conditions.join(' AND ');
        }
    
        baseSelectQuery += whereClause;
        countQuery += whereClause;
    
        // Use safe column names for sorting
        const safeColumns = ['product_id', 'name', 'price', 'ratings', 'discounted_price'];
        const actualSortColumn = safeColumns.includes(sortByColumn) ? sortByColumn : 'product_id';
        
        // Handle specific cases for sorting by joined table columns
        let orderByClause;
        if (sortByColumn === 'category_name') {
            orderByClause = ` ORDER BY c.category_name ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`;
        } else if (sortByColumn === 'subcategory_name') {
            orderByClause = ` ORDER BY sc.subcategory_name ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`;
        } else if (sortByColumn === 'brand_name') {
            orderByClause = ` ORDER BY b.brand_name ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`;
        } else {
            orderByClause = ` ORDER BY p.${actualSortColumn} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'}`;
        }
    
        baseSelectQuery += orderByClause;
        baseSelectQuery += ` LIMIT ${limit} OFFSET ${offset}`;
        // values.push(limit, offset);
    console.log("get all func base query in product model",baseSelectQuery, values);
    console.log("get all func count query in product model",countQuery, countValues);
    
        try {
            const [productRows] = await pool.execute(baseSelectQuery, values);
            // const [countResult] = await pool.execute(countQuery, countValues);
    
            // const totalCount = countResult[0].totalCount;
            
            // Extract product IDs for possible related data queries
            const productIds = productRows.map(row => row.product_id);
    
            return {
                products: productRows,
                productIds: productIds, // Keep this for backward compatibility
                // totalCount: totalCount 
            };
        } catch (error) {
            console.error('Error in Product.getAll DB execution:', error);
            throw error;
        }
    },

    /**
     * Retrieves a single product by its ID, including category/subcat/brand names.
     * Includes logic to potentially only fetch active products depending on context.
     * @param {number} id - The ID of the product to retrieve.
     * @param {boolean} [fetchInactive=false] - Whether to fetch even if inactive.
     * @returns {Promise<Object|null>} The product object or null if not found.
     */
    getById: async (productId, fetchInactive = false) => {
        // Main product query
        let query = `
            SELECT
                p.*,
                c.category_name,
                sc.subcategory_name,
                b.brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN subcategories sc ON p.subcategory_id = sc.subcategory_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            WHERE p.product_id = ?
        `;
    
        if (!fetchInactive) {
            query += ' AND p.is_active = 1';
        }
    
        try {
            // Get the main product data
            const [productRows] = await pool.execute(query, productId);
            
            if (productRows.length === 0) {
                return null;
            }            

            return productRows;
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Creates a new product.
     * @param {Object} productData - Data for the new product (assumed validated, includes seller_id).
     * @returns {Promise<Object>} Result object from the database.
     */
    create: async (productData, connection = pool) => {
        const fields = Object.keys(productData);
        if (!fields.includes('seller_id')) {
             console.warn('seller_id not provided for product creation');
        }
        const placeholders = fields.map(() => '?').join(', ');
        
        const query = `INSERT INTO products (${fields.join(', ')}) VALUES (${placeholders})`;
        try {
            const [result] = await connection.execute(query, Object.values(productData));  // Use provided connection
            return result;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Updates an existing product by ID.
     * @param {number} id - The ID of the product to update.
     * @param {Object} productData - Fields to update (assumed validated).
     * @returns {Promise<Object>} Result object from the database.
     */
    update: async (id, productData) => {
        const fields = Object.keys(productData);
         if (fields.length === 0) {
             throw new Error("No fields provided for update.");
        }
        const setClause = fields.map(key => `${key} = ?`).join(', ');
        const query = `UPDATE products SET ${setClause} WHERE product_id = ?`;
        try {
            const [result] = await pool.execute(query, [...Object.values(productData), id]);
            return result;
        } catch (error) {
            console.error(`Error updating product with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deletes a product by ID (Hard Delete).
     * @param {number} id - The ID of the product to delete.
     * @param {object} [connection=pool] - Optional DB connection for transactions.
     * @returns {Promise<Object>} Result object from the database.
     */
    delete: async (id, connection = pool) => {
        const query = 'DELETE FROM products WHERE product_id = ?';
        try {
            const [result] = await connection.execute(query, [id]);
            return result;
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a product by ID (Sets is_active = false).
     * @param {number} id - The ID of the product to soft delete.
     * @param {object} [connection=pool] - Optional DB connection for transactions.
     * @returns {Promise<Object>} Result object from the database.
     */
    softDelete: async (id, connection = pool) => {
         const query = 'UPDATE products SET is_active = false WHERE product_id = ?';
         try {
            const [result] = await connection.execute(query, [id]);
            return result;
         } catch (error) {
             console.error(`Error soft deleting product with ID ${id}:`, error);
             throw error;
         }
    },

};

export default Product;
