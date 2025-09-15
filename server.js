require('dotenv').config();
const connectToDB = require('./database/db');
const express =  require('express');
const authRoutes = require('./routes/auth-routes');
const categoryRoutes = require('./routes/category-routes');
const productRoutes = require('./routes/product-routes')

connectToDB();

const app = express();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/product',productRoutes);

PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})