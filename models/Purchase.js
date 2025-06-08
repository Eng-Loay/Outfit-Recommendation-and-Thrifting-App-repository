const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
