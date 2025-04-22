import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './src/routes/userRoutes.js';
import authRouter from './src/routes/authRoutes.js';
import productsRouter from './src/routes/productRoutes.js';
import ordersRouter from './src/routes/orderRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import reviewRouter from './src/routes/reviewRoutes.js';
import cartRouter from './src/routes/cartRoutes.js';




dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

app.use(express.urlencoded({ extended: true }));

// static routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));

// Routes 
// app.use('/',(req,res)=>{res.status(200).send('Server is running fine')});
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/paymentRoutes', ordersRouter);


// Global Error Handling (Optional)
app.use("/",(err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});