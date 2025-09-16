import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import sequelize from './config/db.config.js';

import routes from './routes/index.js';

// Express setup
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api", routes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Hello there');
});

// Initialize server after DB check
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    await sequelize.sync({ alter: true});

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit app if DB is not reachable
  }
})();
