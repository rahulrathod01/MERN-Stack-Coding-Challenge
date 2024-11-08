# MERN Stack Product Transaction Management

## Overview

This project is a **MERN stack application** designed to manage product transactions. The backend fetches data from a third-party API and provides various APIs to list transactions, perform search, and generate statistics and visualizations. The frontend consumes these APIs and displays the data in a user-friendly interface with tables and charts.

---

## Features

1. **Transaction Listing API**  
   - List all transactions with support for pagination and search.
   - Pagination with a default value of 10 items per page.
   - Search functionality to filter by title, description, and price.

2. **Statistics API**  
   - Fetch total sales amount, total sold items, and total unsold items for a selected month.

3. **Bar Chart API**  
   - Visualizes the number of items within specified price ranges for a selected month.

4. **Pie Chart API**  
   - Displays the number of items in each unique product category for a selected month.

5. **Fetch Combined Data API**  
   - Fetches all the data from the previous APIs and combines them into one response for easy consumption.

---

## Project Structure

```bash
├── backend/                   # Backend directory
│   ├── models/                 # MongoDB Models (Schema for Product Transactions)
│   ├── controllers/            # API Controllers
│   ├── routes/                 # API Routes
│   ├── server.js               # Main server file
│   └── .env                    # Environment variables
└── frontend/                   # Frontend directory
    ├── src/
    │   ├── components/         # UI Components (Table, Charts, etc.)
    │   ├── App.js              # Main App component
    │   └── index.js            # React entry point
    └── public/                 # Public assets (HTML, CSS, etc.)

git clone https://github.com/your-username/product-transaction-app.git
cd product-transaction-app/backend

npm install
Demo
You can view a demo of the frontend application running at http://localhost:3000.
