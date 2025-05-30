import productService from '../services/productService.js';

/**
 * Product Controller
 * Handles incoming HTTP requests related to products, interacts with productService,
 * and sends HTTP responses.
 */
const productController = {

    /**
     * Handles fetching a list of products with filtering, sorting, pagination.
     * GET /api/products
     */
    getProducts: async (req, res) => {
        try {
            const requestingUser = req.user; // Might be undefined for public requests
            const result = await productService.getProducts(req.query, requestingUser);
            res.status(200).json(result);
        } catch (error) {
            console.error('GetProducts controller error:', error.message);
            res.status(500).json({ error: error.message || 'Failed to fetch products.' });
        }
    },

    /**
     * Handles fetching a single product by ID.
     * GET /api/products/:id
     */
    getProductById: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user; // Might be undefined for public requests
        try {
            const product = await productService.getProductById(id, requestingUser);
            res.status(200).json(product);
        } catch (error) {
            console.error(`GetProductById controller error for ID ${id}:`, error.message);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Failed to fetch product.' });
        }
    },

    /**
     * Handles creating a new product with images.
     * POST /api/products
     * Assumes authentication middleware provides req.user.
     */
    createProduct: async (req, res) => {
        const requestingUser = req.user; // Requires authentication
        
        if (!requestingUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        try {
            // Process image files
            let imageUrls = [];
            let thumbnailUrl = null;
            
            if (req.files && req.files.length > 0) {
                // Get index of thumbnail image (default to first image if not specified)
                const thumbnailIndex = req.body.thumbnailIndex ? parseInt(req.body.thumbnailIndex, 10) : 0;
                
                // Process all uploaded images
                imageUrls = req.files.map((file, index) => {
                    const url = `/images/${file.filename}`;
                    // Set thumbnail URL if this is the designated thumbnail
                    if (index === thumbnailIndex) {
                        thumbnailUrl = url;
                    }
                    return url;
                });
            }

            // Remove thumbnailIndex from body as it's not part of product data
            const { thumbnailIndex, ...productData } = req.body;
            
            // Create final product data with images
            const finalProductData = {
                ...productData,
                thumbnail_url: thumbnailUrl
            };

            // Call service to create product with images
            const result = await productService.createProduct(finalProductData, imageUrls, requestingUser);
            
            res.status(201).json({ 
                message: 'Product created successfully', 
                productId: result.productId,
                thumbnail: thumbnailUrl,
                images: imageUrls
            });
        } catch (error) {
            console.error('CreateProduct controller error:', error.message);
            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({ error: error.message });
            }
            if (error.message.includes('Missing required') || error.message.includes('Invalid')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Failed to create product.' });
        }
    },

    /**
     * Handles updating an existing product.
     * PUT /api/products/:id
     * Assumes authentication middleware provides req.user.
     */
    updateProduct: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user;

        if (!requestingUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        
        if (Object.keys(req.body).length === 0 && (!req.files || req.files.length === 0)) {
            return res.status(400).json({ error: 'Request body cannot be empty for update.' });
        }

        try {
            // Process image files if any were uploaded
            let imageUrls = [];
            let thumbnailUrl = null;
            let updateImages = false;
            
            if (req.files && req.files.length > 0) {
                updateImages = true;
                
                // Get index of thumbnail image (default to first image if not specified)
                const thumbnailIndex = req.body.thumbnailIndex ? parseInt(req.body.thumbnailIndex, 10) : 0;
                
                // Process all uploaded images
                imageUrls = req.files.map((file, index) => {
                    const url = `/uploads/products/${file.filename}`;
                    // Set thumbnail URL if this is the designated thumbnail
                    if (index === thumbnailIndex) {
                        thumbnailUrl = url;
                    }
                    return url;
                });
            }

            // Remove thumbnailIndex from body as it's not part of product data
            const { thumbnailIndex, ...updateData } = req.body;
            
            // Add thumbnail URL to update data if it exists
            if (thumbnailUrl) {
                updateData.thumbnail_url = thumbnailUrl;
            }

            await productService.updateProduct(
                Number(id), 
                updateData, 
                updateImages ? imageUrls : null,
                requestingUser
            );

            res.status(200).json({ 
                message: 'Product updated successfully',
                thumbnail: thumbnailUrl,
                images: updateImages ? imageUrls : undefined
            });
        } catch (error) {
            console.error(`UpdateProduct controller error for ID ${id}:`, error.message);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({ error: error.message });
            }
            if (error.message.includes('Invalid') || error.message.includes('No valid fields')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Failed to update product.' });
        }
    },

    /**
     * Handles deleting a product.
     * DELETE /api/products/:id
     * Assumes authentication middleware provides req.user.
     */
    deleteProduct: async (req, res) => {
        const { id } = req.params;
        const requestingUser = req.user;

        if (!requestingUser) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        try {
            await productService.deleteProduct(Number(id), requestingUser);
            res.status(200).json({ message: 'Product deleted (or deactivated) successfully.' });
        } catch (error) {
            console.error(`DeleteProduct controller error for ID ${id}:`, error.message);
            if (error.message === 'Product not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({ error: error.message });
            }
            if (error.message.includes('Cannot delete product')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Failed to delete product.' });
        }
    }
};

export default productController;