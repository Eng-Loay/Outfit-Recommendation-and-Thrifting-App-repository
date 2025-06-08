const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const Purchase = require('../models/Purchase');

// 1. Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, colour, price, sellerRating, seller } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Remove temp file after upload
    }

    const product = new Product({
      name,
      category,
      colour,
      price,
      sellerRating: sellerRating || 0,
      seller,
      image: imageUrl
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Edit Product
exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      updates.image = result.secure_url;
      fs.unlinkSync(req.file.path); // Remove temp file
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Optionally: delete image from Cloudinary here if needed (requires public_id storage)
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Purchase Product
// 4. Purchase Product
exports.purchaseProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const buyerId = req.session.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ product: productId });
    if (existingPurchase) {
      return res.status(400).json({ error: 'Product already purchased' });
    }

    // Create new purchase record
    const purchase = new Purchase({
      product: productId,
      buyer: buyerId
    });

    await purchase.save();

    res.json({ message: 'Product purchased successfully', purchase });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
