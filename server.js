const express = require('express');
const dotenv = require('dotenv');

const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const userRoutes = require('./Routes/userRoutes');


dotenv.config({path: './Config/config.env'});
const app = express();
app.use(express.json());


// Mount Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
    const err = new Error('Page not found');
    next(err);
})


// Global error handling middleware

app.use((err, req, res, next) => {
    res.status(500).json("test");
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log('app is running on port ', PORT);
})
