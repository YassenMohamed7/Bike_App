const express = require('express');
const apiError = require('./Utils/apiError');
const globalError = require('./Middlewares/errorMiddleware');


const dotenv = require('dotenv');
dotenv.config({path: './Config/config.env'});


const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const userRoutes = require('./Routes/userRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const stockRoutes = require('./Routes/stockRoutes');
const orderRoutes = require('./Routes/orderRoutes');


  

const app = express();
app.use(express.json());


// Mount Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stock', stockRoutes);
app.use('/api/v1/orders', orderRoutes);


// handling undefined routes
app.all('*', (req, res, next) => {
    next(new apiError(`this route ${req.originalUrl} is not defined`));
})

// Global error handling middleware
// 4-parameters function to handle global errors
app.use(globalError);


const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log('app is running on port ', PORT);
})

// Handle errors outside express
process.on("unhandledRejection", (err)=>{
    console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
//     close the server after handling the pending requests
    server.close(()=>{
        console.error(`Shutting down...`);
        process.exit(1);
    });
});
