import pool from './src/db.js'; // Adjust path as needed
import Product from './src/models/productModel.js'; // Adjust path as needed
import Category from './src/models/categoryModel.js'; // Adjust path as needed
import Brand from './src/models/brand.js'; // Adjust path as needed
import fetch from 'node-fetch';

async function seedDatabase() {
    try {
        // Ensure some base categories and brands exist
        const initialCategories = [{ name: 'Beauty' }, { name: 'Electronics' }, { name: 'Clothing' }];
        for (const cat of initialCategories) {
            const [existingCategory] = await pool.execute('SELECT category_id FROM shop_here_db_categories WHERE category_name = ?', [cat.name]);
            if (existingCategory.length === 0) {
                await Category.create(cat);
                console.log(`Category "${cat.name}" created.`);
            }
        }

        const initialBrands = [{ name: 'Essence' }, { name: 'Apple' }, { name: 'Nike' }];
        for (const brand of initialBrands) {
            const [existingBrand] = await pool.execute('SELECT brand_id FROM shop_here_db_brands WHERE brand_name = ?', [brand.name]);
            if (existingBrand.length === 0) {
                await Brand.create(brand);
                console.log(`Brand "${brand.name}" created.`);
            }
        }

        // Fetch products from DummyJSON (limit to a smaller number for testing)
        const response = await fetch('https://dummyjson.com/products?limit=20');
        const data = await response.json();
        const products = data.products;

        for (const dummyProduct of products) {
            // Map DummyJSON data to your product schema
            const transformedProduct = {
                name: dummyProduct.title,
                description: dummyProduct.description,
                price: dummyProduct.price,
                discount: dummyProduct.discountPercentage, // You might need to adjust how you store/calculate this
                discounted_price: dummyProduct.price * (1 - (dummyProduct.discountPercentage / 100)), // Basic calculation
                thumbnail_url: dummyProduct.thumbnail,
                ratings: dummyProduct.rating,
                category_id: await getCategoryId(dummyProduct.category),
                subcategory_id: null, // You'll need more specific logic for subcategories
                brand_id: await getBrandId(dummyProduct.brand),
                stock_quantity: dummyProduct.stock,
                minimum_order_quantity: dummyProduct.minimumOrderQuantity,
                is_active: 1,
            };

            // Insert the product
            const [productResult] = await pool.execute('INSERT INTO shop_here_db_products SET ?', transformedProduct);
            const productId = productResult.insertId;
            console.log(`Product "${transformedProduct.name}" created with ID: ${productId}`);

            // Handle product images (assuming the 'images' array from DummyJSON)
            if (dummyProduct.images && dummyProduct.images.length > 0) {
                for (const imageUrl of dummyProduct.images) {
                    await pool.execute('INSERT INTO shop_here_db_product_images (product_id, image_url) VALUES (?, ?)', [productId, imageUrl]);
                    console.log(`  Image added: ${imageUrl}`);
                }
            }

            // You'll need to add similar logic for product_colors and product_sizes if DummyJSON provides relevant data
            // or if you want to generate some sample variations.
        }

        console.log('Database seeding for products and images complete.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        pool.end(); // Close the connection pool
    }
}

async function getCategoryId(categoryName) {
    const [rows] = await pool.execute('SELECT category_id FROM shop_here_db_categories WHERE category_name = ?', [categoryName]);
    return rows[0]?.category_id;
}

async function getBrandId(brandName) {
    const [rows] = await pool.execute('SELECT brand_id FROM shop_here_db_brands WHERE brand_name = ?', [brandName]);
    return rows[0]?.brand_id;
}

seedDatabase();