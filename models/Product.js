const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  colour: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sellerRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  image: {
    type: String, // Can be a filename or a full URL
    default: ''
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
