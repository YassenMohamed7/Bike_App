const express = require('express');
const apiError = require('./Utils/apiError');
const globalError = require('./Middlewares/errorMiddleware');
const decodeToken = require('./Middlewares/decodeToken');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({path: './Config/config.env'});

const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const userRoutes = require('./Routes/userRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const stockRoutes = require('./Routes/stockRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');




const app = express();
app.use(cors());
app.use(express.json());
app.use(decodeToken);   // passing the token in the request headers as authorization: token_value

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/stock', stockRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/employees', employeeRoutes);



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
