const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socket');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chefs', require('./routes/chefsRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionsRoutes'));
app.use('/api/chef-dashboard', require('./routes/chefDashboardRoutes'));
app.use('/api/orders', require('./routes/ordersRoutes'));
app.use('/api/reviews', require('./routes/reviewsRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('SWAAD API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
