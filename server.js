const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const connectDB = require('./config/db');
const app = require('./app');


const port = process.env.PORT || 3000;

// Connect to DB then start server
connectDB()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on 0.0.0.0:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database', err);
    process.exit(1);
  });
