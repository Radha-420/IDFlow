const express = require('express');
const dotenv = require('dotenv');

// Load env variables first
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// We will connect via middleware instead of on boot

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://idflow.vercel.app', 'https://idflow-project.vercel.app'], // Add your Vercel domains
  credentials: true,
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
