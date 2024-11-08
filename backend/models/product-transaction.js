const mongoose = require('mongoose');

const productTransactionsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true},
  dateOfSale: { type: Date, required: true },
  image: { type: String, default: '' },
  sold: { type: Boolean, required: true}
}, {
  _id:false,
  collection : "product_transactions"
})

const productTransaction = mongoose.model('product_transactions', productTransactionsSchema);
module.exports = productTransaction;

