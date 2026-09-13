import express from 'express';
import 'dotenv/config';

import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { swaggerUi, swaggerDocument } from './swagger.js';

const app = express();

const PORT = process.env.PORT || 5000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Application Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);

// Global Error Handler (Handles Multer errors and uncaught exceptions)
app.use((err, req, res, next) => {
  if (err.name === 'MulterError' || err.message === 'Only CSV files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const Server = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server started successfully: http://localhost:${PORT}`);
      console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

Server();