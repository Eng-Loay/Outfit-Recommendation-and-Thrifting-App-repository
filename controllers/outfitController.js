const Outfit = require('../models/Outfit');
const Product = require('../models/Product');

exports.addOutfit = async (req, res) => {
  try {
    const { name, seasonTags, products } = req.body;

    // Validate at least 3 product IDs
    if (!Array.isArray(products) || products.length < 3) {
      return res.status(400).json({ error: 'At least 3 product IDs are required for an outfit' });
    }

    // Validate products exist
    const existingProducts = await Product.find({ _id: { $in: products } });

    if (existingProducts.length !== products.length) {
      return res.status(400).json({ error: 'One or more product IDs are invalid' });
    }

    const outfit = new Outfit({
      name,
      seasonTags,
      products
    });

    await outfit.save();
    res.status(201).json({ message: 'Outfit created successfully', outfit });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
