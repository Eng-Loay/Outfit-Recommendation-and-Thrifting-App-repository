const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  number: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number']
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  }
}, {
  timestamps: true
});

// pre-save hook to hash password if modified
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
