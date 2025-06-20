const Product = require('../models/Product');
const User = require('../models/Usermodel');

// Get home overview data: top sellers, top rated, newest products, thrift market
exports.getHomeData = async (req, res) => {
  try {
    // Top sellers: users with most sold products
    const topSellersAgg = await Product.aggregate([
      { $match: { buyer: { $ne: null } } },
      { $group: { _id: '$seller', soldCount: { $sum: 1 } } },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
    ]);
    const topSellers = await User.find({ _id: { $in: topSellersAgg.map(a => a._id) } })
      .select('fullName username')
      .lean();

    // Top rated users: avg sellerRating across products
    const topRatedAgg = await Product.aggregate([
      { $group: { _id: '$seller', avgRating: { $avg: '$sellerRating' } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
    ]);
    const topRated = await User.find({ _id: { $in: topRatedAgg.map(a => a._id) } })
      .select('fullName username')
      .lean();

    // Newest products
    const newest = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Thrift market: unsold products
    const thrift = await Product.find({ buyer: null })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ topSellers, topRated, newest, thrift });
  } catch (err) {
    console.error('Home data error:', err);
    res.status(500).json({ error: err.message });
  }
};
