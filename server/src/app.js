const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const { errorResponse } = require('./utils/apiResponse');

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Mount API v1
app.use('/api/v1', apiRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  return errorResponse(res, 404, 'NOT_FOUND', `Không tìm thấy tài nguyên: ${req.method} ${req.originalUrl}`);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
