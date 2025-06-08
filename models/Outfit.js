const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seasons: {
    type: [String],
    enum: ['summer', 'winter', 'spring', 'autumn', 'rainy', 'all-season'],
    default: ['all-season']
  }
}, {
  timestamps: true
});

// Ensure at least 3 products in an outfit
outfitSchema.pre('save', function(next) {
  if (this.products.length < 3) {
    return next(new Error('An outfit must contain at least 3 products.'));
  }
  next();
});

const Outfit = mongoose.model('Outfit', outfitSchema);
module.exports = Outfit;
