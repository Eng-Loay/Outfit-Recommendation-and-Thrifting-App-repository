const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const connectDB = require('./config/db');
const seedData = require('./utils/seed');

const app = express();
app.use(cors());

// Middleware for parsing JSON and form-data
app.use(express.json()); // handles raw JSON
app.use(express.urlencoded({ extended: true })); // handles form-data or x-www-form-urlencoded
app.use(cookieParser());

// Load session secret with a fallback for development
const sessionSecret = process.env.SESSION_SECRET || "dev-secret";
if (!process.env.SESSION_SECRET) {
  console.warn("⚠️  Warning: SESSION_SECRET not set. Using default dev-secret.");
}

// Session management
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", require("./routes/productRoutes"));
app.use('/api/home', require('./routes/homeRoutes'));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Connect to DB then start server
const port = process.env.PORT || 5000;
connectDB()
  .then(async () => {
    await seedData();
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on 0.0.0.0:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error);
    process.exit(1);
  });

module.exports = app;
