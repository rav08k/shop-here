import Product from "../models/productModel.js";
import ProductColor from "../models/productColorsModel.js";
import ProductSize from "../models/productSizesModel.js";
import ProductImage from "../models/productImagesModel.js";
import MetaInfo from "../models/metaInfoModel.js";
import pool from "../db.js";
import fs from 'fs';

// Placeholder for AuthHelpers
const AuthHelpers = {
	_isAdmin: (user) => user && user.role && user.role.toLowerCase() === "admin",
	_isSeller: (user) =>
		user && user.role && user.role.toLowerCase() === "seller",
};

// Placeholder for other services/models needed
const orderItemModel = {
	// Placeholder
	hasActiveOrderItems: async (productId, connection) => {
		return false;
	},
};
const productImageService = {
	// Placeholder
	deleteProductImagesForProduct: async (productId, connection) => {
        let images = await ProductImage.getByProductId(productId,connection);
        console.log("images to delete",images);
        
        let result = await ProductImage.deleteByProductId(productId, connection);
    
        if (result.affectedRows === 0) {
            console.warn(`No images found to delete for product ${productId}`);
        }
    
        return images;
    },
	deleteDiskImages: async (imagePaths) => {
        for (const imagePath of imagePaths) {
            try {
                // Convert URL path to filesystem path
                // Assuming images stored in format /images/filename.ext
                // And we need to convert to ./images/filename.ext or simply images/filename.ext
                const filePath = imagePath.image_url.startsWith('/images/') 
                    ? imagePath.image_url.substring(1)  // Remove leading slash
                    : imagePath.image_url;
                    
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted image file: ${filePath}`);
                } else {
                    console.warn(`Image file not found for deletion: ${filePath}`);
                }
            } catch (err) {
                console.error(`Failed to delete image file: ${imagePath}`, err);
            }
        }
    },
};

/**
 * Helper function to group related items by product ID.
 */
const groupItemsByProductId = (items) => {
	const map = new Map();
	items.forEach((item) => {
		const key = item.product_id;
		if (!map.has(key)) {
			map.set(key, []);
		}
		map.get(key).push(item);
	});
	return map;
};


/**
 * Product Service
 * Handles business logic related to products.
 */
const productService = {
	/**
	 * Retrieves a list of products with filtering, sorting, pagination,
	 * and includes related attributes (colors, sizes, images) and names (category, brand).
	 */
	getProducts: async (rawOptions = {}, requestingUser) => {
		// (Implementation from previous step - unchanged)
		const options = { ...rawOptions };
		const page = Math.max(1, parseInt(options.page, 10) || 1);
		const limit = Math.max(1, parseInt(options.limit, 10) || 20);
		const offset = (page - 1) * limit;
		const allowedSortBy = [
			"name",
			"price",
			"ratings",
			"createdAt",
			"product_id",
		];
		const sortByInput = options.sortBy || "createdAt";
		const validSortBy = allowedSortBy.includes(sortByInput)
			? sortByInput
			: "createdAt";
		const sortByColumn =
			validSortBy === "createdAt" ? "created_at" : validSortBy;
		const sortOrderInput =
			options.sortOrder || (sortByColumn === "created_at" ? "DESC" : "ASC");
		const validSortOrder =
			sortOrderInput.toUpperCase() === "DESC" ? "DESC" : "ASC";
		const filters = {};
		if (options.category && !isNaN(parseInt(options.category, 10)))
			filters.category = parseInt(options.category, 10);
		if (options.subcategory && !isNaN(parseInt(options.subcategory, 10)))
			filters.subcategory = parseInt(options.subcategory, 10);
		if (options.brand && !isNaN(parseInt(options.brand, 10)))
			filters.brand = parseInt(options.brand, 10);
		if (options.minPrice !== undefined && !isNaN(parseFloat(options.minPrice)))
			filters.minPrice = parseFloat(options.minPrice);
		if (options.maxPrice !== undefined && !isNaN(parseFloat(options.maxPrice)))
			filters.maxPrice = parseFloat(options.maxPrice);
		if (
			options.search &&
			typeof options.search === "string" &&
			options.search.trim() !== ""
		)
			filters.search = options.search.trim();
		filters.isActive = 1;
		if (AuthHelpers._isAdmin(requestingUser) && options.isActive === 0)
			filters.isActive = 0;
		else if (
			AuthHelpers._isAdmin(requestingUser) &&
			options.isActive === undefined
		)
			filters.isActive = 1;

		const validatedOptions = {
			...filters,
			sortByColumn,
			sortOrderInput,
			limit,
			offset,
		};

		try {
            const { products, productIds, totalCount } = await Product.getAll(validatedOptions);
            
            if (!productIds || productIds.length === 0) {
                return { products: [], totalCount: 0, page, limit, totalPages: 0 };
            }
            
            // Now we already have basic product info, just need to fetch related attributes
            const [productColors, productSizes, productImages, productMetaInfo] = await Promise.all([
                ProductColor.getByProductIds(productIds),
                ProductSize.getByProductIds(productIds),
                ProductImage.getByProductIds(productIds),
                MetaInfo.getByProductIds(productIds)
            ]);
            
            const colorMap = groupItemsByProductId(productColors);
            const sizeMap = groupItemsByProductId(productSizes);
            const imageMap = groupItemsByProductId(productImages);
            const metaInfoMap = groupItemsByProductId(productMetaInfo);
            
            // Merge the related attributes with the product data
            const mergedProducts = products.map((product) => ({
                ...product,
                colors: colorMap.get(product.product_id) || [],
                sizes: sizeMap.get(product.product_id) || [],
                images: imageMap.get(product.product_id) || [],
                meta_info : metaInfoMap.get(product.product_id) || {}
            }));
    
            return {
                products: mergedProducts,
                totalCount: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            console.error("Error in productService.getProducts:", error);
            throw new Error("Failed to fetch products.");
        }
	},

	/**
	 * Retrieves a single product by ID, including related attributes and names.
	 */
	getProductById: async (productId, requestingUser) => {
		// (Implementation from previous step - unchanged)
		let fetchInactive = false;
		if (AuthHelpers._isAdmin(requestingUser)) {
			fetchInactive = true;
		}
		try {
			const product = await Product.getById(productId, fetchInactive);
			if (!product) {
				throw new Error("Product not found");
			}
			if (!product.is_active && !AuthHelpers._isAdmin(requestingUser)) {
				throw new Error("Product not found");
			}

			const [colors, sizes, images, metaInfo] = await Promise.all([
				ProductColor.getByProductId(productId),
				ProductSize.getByProductId(productId),
				ProductImage.getByProductId(productId),
                MetaInfo.getByProductId(productId)
			]);

            product.meta_info = metaRows.length > 0 ? metaRows[0] : null;
			return {
				...product,
				colors: colors || [],
				sizes: sizes || [],
				images: images || [],
                meta_info : metaInfo || {}
			};
		} catch (error) {
			console.error(
				`Error in productService.getProductById for ID ${productId}:`,
				error.message
			);
			if (error.message === "Product not found") {
				throw error;
			}
			throw new Error("Failed to fetch product.");
		}
	},

	/**
	 * Creates a new product along with its attributes within a transaction.
	 * @param {Object} productInput - Data for the new product, including arrays for attributes.
	 * @param {string} productInput.name
	 * @param {number} productInput.price
	 * @param {number} productInput.category_id
	 * @param {number} productInput.brand_id
	 * @param {number} productInput.stock_quantity
	 * @param {Array<string>} [productInput.colors] - Array of color names.
	 * @param {Array<string>} [productInput.sizes] - Array of size names.
	 * @param {Array<string>} [productInput.images] - Array of image URLs.
	 * @param {Object} [productInput.meta] - Object with meta info fields (dimensions, weight, etc.).
	 * @param {Object} requestingUser - User making the request (must be Seller or Admin).
	 * @returns {Promise<Object>} Details of the created product (e.g., ID).
	 * @throws {Error} If unauthorized, validation fails, or creation fails.
	 */
	createProduct: async (productInput, images = [], requestingUser) => {
		// Authorization Check

		if (
			!requestingUser ||
			!(
				AuthHelpers._isAdmin(requestingUser) ||
				AuthHelpers._isSeller(requestingUser)
			)
		) {
			throw new Error(
				"Unauthorized: Only Sellers or Admins can create products."
			);
		}

		// --- TODO: Add Detailed Input Validation Here (using Joi, Zod, etc.) ---
		// Validate core fields, and also structure of colors, sizes, images, meta arrays/objects
		const {
			colors: colorsString = "[]",
			sizes: sizesString = "[]",
			meta_info: metaInfoString = "{}",
			...coreProductData
		} = productInput;

		// Parse strings into proper JavaScript objects/arrays
		const colors = JSON.parse(colorsString);
		const sizes = JSON.parse(sizesString);
		const meta_info = JSON.parse(metaInfoString);
		if (
			!coreProductData.name ||
			!coreProductData.price ||
			!coreProductData.category_id ||
			!coreProductData.brand_id ||
			coreProductData.stock_quantity === undefined
		) {
			throw new Error("Missing required product fields.");
		}
		// --- End Validation ---

		console.log("prodcut service", requestingUser);

		let connection;
		try {
			// Start Transaction
			connection = await pool.getConnection();
			await connection.beginTransaction();

			// Business Logic: Calculate discounted price
			let discounted_price = coreProductData.price;
			if (
				coreProductData.discount &&
				coreProductData.discount > 0 &&
				coreProductData.discount <= 100
			) {
				discounted_price =
					coreProductData.price * (1 - coreProductData.discount / 100);
			}

			// Prepare core product data for DB
			const productDataForDb = {
				...coreProductData,
				seller_id: requestingUser.user_id,
				discounted_price: discounted_price.toFixed(2),
				is_active:
					coreProductData.is_active !== undefined
						? coreProductData.is_active
						: 1,
			};

			// 1. Create main product record
			const productResult = await Product.create(productDataForDb, connection);
			const newProductId = productResult.insertId;
			console.log("product id", newProductId);

			// 2. Create associated attributes (concurrently within transaction)
			const attributePromises = [];

			// Create Colors
			if (Array.isArray(colors)) {
				colors.forEach((colorName) => {
					if (typeof colorName === "string" && colorName.trim()) {
						attributePromises.push(
							ProductColor.create(
								{ product_id: newProductId, color_name: colorName.trim() },
								connection
							)
						);
					}
				});
			}

			// Create Sizes
			if (Array.isArray(sizes)) {
				sizes.forEach((sizeName) => {
					if (typeof sizeName === "string" && sizeName.trim()) {
						attributePromises.push(
							ProductSize.create(
								{ product_id: newProductId, size_name: sizeName.trim() },
								connection
							)
						);
					}
				});
			}

			// Create Images
			// Assumes image URLs are already generated/uploaded before calling this service
			if (Array.isArray(images)) {
				images.forEach((imageUrl) => {
					if (typeof imageUrl === "string" && imageUrl.trim()) {
						// Basic URL check needed?
						attributePromises.push(
							ProductImage.create(
								{ product_id: newProductId, image_url: imageUrl.trim() },
								connection
							)
						);
					}
				});
			}

			// Create Meta Info (assuming one row per product)
			if (
				meta_info &&
				typeof meta_info === "object" &&
				Object.keys(meta_info).length > 0
			) {
				// Add validation for meta fields here if needed
				attributePromises.push(
					MetaInfo.create(
						{ product_id: newProductId, ...meta_info },
						connection
					)
				);
			}

			// Wait for all attribute inserts to complete
			await Promise.all(attributePromises);

			// 3. Commit Transaction
			await connection.commit();

			return { productId: newProductId };
		} catch (error) {
			// 4. Rollback Transaction on Error
			if (connection) await connection.rollback();

            if (images && images.length > 0) {
				console.log('Cleaning up uploaded images after failed product creation');
				await productImageService.deleteDiskImages(images);
			}

			console.error("Error in productService.createProduct:", error);
			if (
				error.message.includes("Unauthorized") ||
				error.message.includes("Missing required") ||
				error.message.includes("Invalid")
			) {
				throw error;
			}
			throw new Error("Failed to create product.");
		} finally {
			// 5. Release Connection
			if (connection) connection.release();
		}
	},

	/**
	 * Updates an existing product. Allows Admin or product owner (Seller).
	 */
	updateProduct: async (
		productId,
		updateData,
		updateImages,
		requestingUser
	) => {
		// (Implementation from previous step - unchanged for now, but might need transaction if updating attributes)
		if (!requestingUser) {
			throw new Error("Authentication required.");
		}
		try {
			const existingProduct = await Product.getById(productId, true);
			if (!existingProduct) {
				throw new Error("Product not found");
			}
			const isOwner = existingProduct.seller_id === requestingUser.userId;
			if (!AuthHelpers._isAdmin(requestingUser) && !isOwner) {
				throw new Error("Unauthorized: You do not own this product.");
			}

			const dataToUpdate = { ...updateData };
			const newPrice =
				dataToUpdate.price !== undefined
					? dataToUpdate.price
					: existingProduct.price;
			const newDiscount =
				dataToUpdate.discount !== undefined
					? dataToUpdate.discount
					: existingProduct.discount;
			if (
				dataToUpdate.price !== undefined ||
				dataToUpdate.discount !== undefined
			) {
				if (newDiscount && newDiscount > 0 && newDiscount <= 100) {
					dataToUpdate.discounted_price = (
						newPrice *
						(1 - newDiscount / 100)
					).toFixed(2);
				} else {
					dataToUpdate.discounted_price = newPrice.toFixed(2);
					if (dataToUpdate.discount !== undefined) dataToUpdate.discount = 0;
				}
			}
			delete dataToUpdate.seller_id;
			delete dataToUpdate.product_id;
			delete dataToUpdate.ratings;

			if (Object.keys(dataToUpdate).length === 0) {
				throw new Error("No valid fields provided for update.");
			}

			const result = await Product.update(productId, dataToUpdate);
			if (result.affectedRows === 0) {
				throw new Error("Product not found during update.");
			}
			return true;
		} catch (error) {
			console.error(
				`Error in productService.updateProduct for ID ${productId}:`,
				error
			);
			if (
				error.message === "Product not found" ||
				error.message.includes("Unauthorized") ||
				error.message.includes("Invalid") ||
				error.message.includes("No valid fields") ||
				error.message.includes("Authentication required")
			) {
				throw error;
			}
			throw new Error("Failed to update product.");
		}
	},

	/**
	 * Deletes a product (preferably soft delete). Allows Admin or product owner (Seller).
	 */
	deleteProduct: async (productId, requestingUser) => {
		// (Implementation from previous step - unchanged)
		if (!requestingUser) {
			throw new Error("Authentication required.");
		}
		let connection;
		let imageRecordsToDelete = [];
		try {
			const product = await Product.getById(productId, true);
			if (!product) {
				throw new Error("Product not found");
			}
			const isOwner = product.seller_id === requestingUser.userId;
			if (!AuthHelpers._isAdmin(requestingUser) && !isOwner) {
				throw new Error("Unauthorized to delete this product.");
			}

			connection = await pool.getConnection();
			await connection.beginTransaction();
			const hasActiveOrders = await orderItemModel.hasActiveOrderItems(
				productId,
				connection
			);
			const useSoftDelete = false;
			if (hasActiveOrders && !useSoftDelete) {
				throw new Error(
					"Cannot hard delete product: It exists in active orders. Deactivate instead."
				);
			}

			imageRecordsToDelete =
				await productImageService.deleteProductImagesForProduct(
					productId,
					connection
				);
			await ProductColor.deleteByProductId(productId, connection);
			await ProductSize.deleteByProductId(productId, connection);
			await MetaInfo.deleteByProductId(productId, connection);

			let result;
			if (useSoftDelete) {
				result = await Product.softDelete(productId, connection);
			} else {
				if (hasActiveOrders) {
					throw new Error("Cannot hard delete product with active orders.");
				}
				result = await Product.delete(productId, connection);
			}
			if (result.affectedRows === 0) {
				throw new Error("Product not found during deletion.");
			}

			await connection.commit();
			if (imageRecordsToDelete.length > 0) {
				try {
					await productImageService.deleteDiskImages(imageRecordsToDelete);
				} catch (fileError) {
					console.error(
						`Post-commit error deleting image files for product ${productId}:`,
						fileError
					);
				}
			}
			return true;
		} catch (error) {
			if (connection) await connection.rollback();
			console.error(
				`Error in productService.deleteProduct for ID ${productId}:`,
				error
			);
			if (
				error.message === "Product not found" ||
				error.message.includes("Unauthorized") ||
				error.message.includes("Cannot delete product")
			) {
				throw error;
			}
			throw new Error("Failed to delete product.");
		} finally {
			if (connection) connection.release();
		}
	},
};

export default productService;
