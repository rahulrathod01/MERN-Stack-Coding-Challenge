const express = require('express');
const moment = require('moment');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/database.js');
// Route files
const productTransactionRoute = require('./routes/product-transaction.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', productTransactionRoute);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
