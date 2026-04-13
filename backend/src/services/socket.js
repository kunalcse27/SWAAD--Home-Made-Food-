const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`📡 Socket connected: ${socket.id}`);

    // Generic room joining
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`👥 Socket ${socket.id} joined room: ${roomId}`);
    });

    // Specific role-based room joining
    socket.on('join_chef_dashboard', (chefId) => {
      socket.join(`chef_${chefId}`);
      console.log(`👨‍🍳 Chef ${chefId} joined dashboard room`);
    });

    socket.on('join_customer_updates', (customerId) => {
      socket.join(`customer_${customerId}`);
      console.log(`👤 Customer ${customerId} joined updates room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Typed emitters for better consistency
const emitMenuUpdate = (chefId, menu) => {
  if (!io) return;
  // Emit to everyone (for general menu updates)
  io.emit('menu_updated', { chefId, menu });
};

const emitOrderStatusUpdate = (customerId, orderData) => {
  if (!io) return;
  // Emit to specific customer room
  io.to(`customer_${customerId}`).emit('order_status_updated', orderData);
};

const emitNewOrder = (chefId, orderData) => {
  if (!io) return;
  // Emit to specific chef room
  io.to(`chef_${chefId}`).emit('new_order', orderData);
};

module.exports = { 
  initSocket, 
  getIo, 
  emitMenuUpdate, 
  emitOrderStatusUpdate, 
  emitNewOrder 
};
