const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

// Load env vars first
dotenv.config();

// Initialize Firebase Admin
require('./config/firebase');

const { initSocket } = require('./services/socket');
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chefs', require('./routes/chefsRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionsRoutes'));
app.use('/api/chef-dashboard', require('./routes/chefDashboardRoutes'));
app.use('/api/chef', require('./routes/chefRoutes'));
app.use('/api/orders', require('./routes/ordersRoutes'));
app.use('/api/reviews', require('./routes/reviewsRoutes'));
app.use('/api/delivery-dashboard', require('./routes/deliveryDashboardRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));


// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SWAAD API is running (Firebase backend)' });
});

// Public: serve Firebase client config to the frontend
// The frontend fetches this once at boot so Firebase keys never need to be in the frontend .env
app.get('/api/config/firebase', (req, res) => {
  res.json({
    apiKey:            process.env.FIREBASE_WEB_API_KEY,
    authDomain:        process.env.FIREBASE_WEB_AUTH_DOMAIN,
    databaseURL:       process.env.FIREBASE_WEB_DATABASE_URL,
    projectId:         process.env.FIREBASE_WEB_PROJECT_ID,
    storageBucket:     process.env.FIREBASE_WEB_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_WEB_MESSAGING_SENDER_ID,
    appId:             process.env.FIREBASE_WEB_APP_ID,
    measurementId:     process.env.FIREBASE_WEB_MEASUREMENT_ID,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`🚀 SWAAD Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Fatal: Port ${PORT} is already in use.`);
    console.error(`Please kill existing Node.js processes or change the PORT in .env.`);
    process.exit(1);
  } else {
    console.error('❌ Server startup error:', err.message);
  }
});