const express = require('express');
const dotenv = require('dotenv');

const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const userRoutes = require('./Routes/userRoutes');

const apiError = require('./Utils/apiError')
const globalError = require('./Middlewares/errorMiddleware');
dotenv.config({path: './Config/config.env'});
const app = express();
app.use(express.json());


// Mount Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);

// handling undefined routes
app.all('*', (req, res, next) => {
    next(new apiError(`this route ${req.originalUrl} is not defined`));
})


// Global error handling middleware

app.use(globalError);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log('app is running on port ', PORT);
})
