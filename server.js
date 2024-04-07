const express = require('express');
const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');


const app = express();
app.use(express.json());


app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);




app.listen(5000, () => {
    console.log('app is running on port 5000');
})