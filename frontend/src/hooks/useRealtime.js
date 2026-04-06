import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useStore from './useStore';
import toast from 'react-hot-toast';

export default function useRealtime() {
  const { user } = useStore();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
    const newSocket = io(wsUrl);

    newSocket.on('connect', () => {
      console.log('Socket initialized');
      newSocket.emit('join_room', user._id);
    });

    // Listen for order status changes (for customer)
    newSocket.on('order:status_changed', (data) => {
      toast.success(`Your order status is now: ${data.status}`, {
         icon: '🚚',
         duration: 5000
      });
      // Further logic can be placed here to trigger refetches if necessary
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  return socket;
}
