const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const outfitController = require('../controllers/outfitController');
const upload = require('../middleware/upload');
const { requireLogin } = require('../middlewares/authMiddleware');

// PRODUCT ROUTES

// Add a new product (with image upload)
router.post('/add', upload.single('image'),requireLogin ,productController.addProduct);

// Edit a product (optionally with image upload)
router.put('/edit/:productId', upload.single('image'), productController.editProduct);

// Delete a product
router.delete('/delete/:productId',requireLogin ,productController.deleteProduct);

// Purchase a product
router.post('/purchase/:productId',requireLogin ,productController.purchaseProduct);

// OUTFIT ROUTE

// Add an outfit (requires 3+ product IDs)
router.post('/outfit/add', outfitController.addOutfit);

module.exports = router;
