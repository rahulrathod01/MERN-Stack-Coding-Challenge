const moment = require('moment');
const productTransaction = require('../models/product-transaction');

exports.findAll = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  try {
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const transactions = await productTransaction.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.json({ transactions });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

exports.getSales = async (req, res) => {
  const { date } = req.query;
  const isValid = moment(date, "YYYY-MM-DD").isValid();
  
  if (!isValid) {
    return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD" });
  }

  const startTime = moment(date).startOf('month').startOf('day').format();
  const endTime = moment(date).endOf('month').endOf('day').format();

  try {
    const totalSalesAmount = await getTotalSales(startTime, endTime, undefined);
    const totalSoldItems = await getTotalSales(startTime, endTime, true);
    const totalNotSoldItems = await getTotalSales(startTime, endTime, false);

    return res.json({
      totalSalesAmount,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ message: 'Error fetching statistics' });
  }
};

async function getTotalSales(startDate, endDate, isSold) {
  try {
    const query = {
      dateOfSale: { $gte: startDate, $lt: endDate }
    };

    if (isSold !== undefined) {
      query.sold = isSold;
    }

    const transactions = await productTransaction.find(query);

    if (isSold === undefined) {
      return transactions.reduce((sum, transaction) => sum + transaction.price, 0);
    } else {
      return transactions.length;
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    throw error;
  }
}

exports.getPieChart = async (req, res) => {
  const { date } = req.query;
  const isValid = moment(date, "YYYY-MM-DD").isValid();
  if (!isValid) {
    return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD" });
  }

  const month = moment(date).month();

  try {
    const transactions = await productTransaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, month + 1] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
      { $sort: { category: 1 } }
    ]);

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
};

exports.getRangeCount = async (req, res) => {
  const { date } = req.query;
  const isValid = moment(date, "YYYY-MM-DD").isValid();
  if (!isValid) {
    return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD" });
  }

  const month = moment(date).month();

  try {
    const priceRanges = [
      { range: "0 - 100", min: 0, max: 100, count: 0 },
      { range: "101 - 200", min: 101, max: 200, count: 0 },
      { range: "201 - 300", min: 201, max: 300, count: 0 },
      { range: "301 - 400", min: 301, max: 400, count: 0 },
      { range: "401 - 500", min: 401, max: 500, count: 0 },
      { range: "501 - 600", min: 501, max: 600, count: 0 },
      { range: "601 - 700", min: 601, max: 700, count: 0 },
      { range: "701 - 800", min: 701, max: 800, count: 0 },
      { range: "801 - 900", min: 801, max: 900, count: 0 },
      { range: "901 - above", min: 901, max: Infinity, count: 0 },
    ];

    const transactions = await productTransaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, month + 1] } } },
      { $addFields: {
          priceRange: {
            $switch: {
              branches: priceRanges.map(range => ({
                case: { $and: [{ $gte: ["$price", range.min] }, { $lte: ["$price", range.max] }] },
                then: `${range.min}-${range.max}`,
              })),
              default: "Unknown",
            }
          }
        }
      },
      { $group: { _id: "$priceRange", count: { $sum: 1 } } },
      { $project: { range: "$_id", count: 1, _id: 0 } },
      { $sort: { range: 1 } }
    ]);

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
};

exports.importProductTransaction = async (req, res) => {
  try {
    const response = await axios.get(
      `https://s3.amazonaws.com/roxiler.com/product_transaction.json`
    );
    const data = response.data;
    await productTransaction.deleteMany({});
  
    const transactions = data.map((transaction) => ({
      id: transaction.id,
      title: transaction.title,
      description: transaction.description,
      price: transaction.price,
      category: transaction.category,
      sold: transaction.sold,
      image: transaction.image,
      dateOfSale: new Date(transaction.dateOfSale),
    }));
    
    await productTransaction.insertMany(transactions);
  
    res.status(200).json({ message: "Database initialized with seed data." });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ error: "Failed to initialize the database." });
  }
};
