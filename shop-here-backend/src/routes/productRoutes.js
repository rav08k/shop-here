import express from 'express';
import productController from '../controllers/productController.js';
import authenticateToken from '../middleware/authenticate.js';
import { uploadProductImages, handleUploadError } from '../middleware/fileUploadMiddleware.js';

const productRouter = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, pagination
 * @access  Public
 */
productRouter.get('/', productController.getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
productRouter.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product with images
 * @access  Private (Requires Seller or Admin role - checked in service)
 */
productRouter.post(
    '/',
    authenticateToken,
    uploadProductImages, // Multiple files upload
    handleUploadError,
    productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product with images
 * @access  Private (Requires Admin or Seller owner - checked in service)
 */
productRouter.put(
    '/:id',
    authenticateToken,
    uploadProductImages, // Multiple files upload for update
    handleUploadError,
    productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete (or deactivate) a product
 * @access  Private (Requires Admin or Seller owner - checked in service)
 */
productRouter.delete(
    '/:id',
    authenticateToken,
    productController.deleteProduct
);

export default productRouter;