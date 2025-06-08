const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware for parsing JSON and form-data
app.use(express.json()); // handles raw JSON
app.use(express.urlencoded({ extended: true })); // handles form-data or x-www-form-urlencoded
app.use(cookieParser());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/productRoutes'));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
