import { useEffect } from 'react';
import socket, { connectSocket, disconnectSocket } from '../services/socket';
import useStore from './useStore';
import toast from 'react-hot-toast';

export const useRealtime = () => {
  const { user, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket(user._id);

      socket.on('menu_updated', (data) => {
        toast.success(`Chef updated their menu!`, {
          icon: '🍳',
          duration: 4000,
        });
        // We can emit a local event or use a callback to refresh data
        window.dispatchEvent(new CustomEvent('REFRESH_CHEFS_LIST'));
      });

      socket.on('order_status_updated', (data) => {
        toast.success(`Your order status is now: ${data.status}`, {
          icon: '🚚',
        });
        window.dispatchEvent(new CustomEvent('REFRESH_ORDERS_LIST'));
      });

      return () => {
        socket.off('menu_updated');
        socket.off('order_status_updated');
        disconnectSocket();
      };
    }
  }, [isAuthenticated, user]);
};
