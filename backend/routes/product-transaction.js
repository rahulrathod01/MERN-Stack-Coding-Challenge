const express = require("express");
const {
  importProductTransaction,
  findAll,
  getSales,
  getRangeCount,
  getPieChart,
} = require("../controllers/product-transaction");

const router = express.Router();

router.get("/import-product-transaction", importProductTransaction);
router.get("/product-transactions", findAll);
router.get("/product-transactions-sales", getSales);
router.get("/product-transactions-range", getRangeCount);
router.get("/product-transactions-catagories", getPieChart);

module.exports = router;
