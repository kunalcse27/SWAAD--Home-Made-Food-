import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId, role) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('📡 Connected to Socket.io server');
        
        // Auto-join relevant rooms based on role
        if (role === 'chef') {
          this.socket.emit('join_chef_dashboard', userId);
        } else if (role === 'customer') {
          this.socket.emit('join_customer_updates', userId);
        }
        
        // Also join personal user room for generic notifications
        this.socket.emit('join_room', userId);
      });

      this.socket.on('connect_error', (err) => {
        console.error('🔌 Socket connection error:', err.message);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket disconnected');
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

const instance = new SocketService();
export default instance;
