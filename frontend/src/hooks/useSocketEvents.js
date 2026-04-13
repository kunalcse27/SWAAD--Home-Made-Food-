import { useEffect } from 'react';
import socketService from '../services/socket';
import useStore from './useStore';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage socket event subscriptions and cleanup.
 * @param {Array} events - List of event objects: { name: string, handler: function }
 */
export const useSocketEvents = (events = []) => {
  const { user, isAuthenticated, userRole } = useStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Connect socket on mount (if not already)
    const socket = socketService.connect(user._id || user.uid, userRole);

    // Register events
    events.forEach(({ name, handler }) => {
      socket.on(name, handler);
    });

    // Default system events
    socket.on('menu_updated', (data) => {
      if (userRole === 'customer') {
        toast.success('A chef updated their menu!', { 
          icon: '🍳',
          duration: 4000 
        });
        // Dispatch event for components to refresh data
        window.dispatchEvent(new CustomEvent('REFRESH_CHEFS_LIST'));
      }
    });

    socket.on('order_status_updated', (data) => {
      if (userRole === 'customer') {
        toast.success(`Order status updated: ${data.status}`, { icon: '🚚' });
        window.dispatchEvent(new CustomEvent('REFRESH_ORDERS_LIST'));
      }
    });

    socket.on('new_order', (data) => {
      if (userRole === 'chef') {
        toast.success('New order received!', { 
          icon: '📥',
          duration: 5000 
        });
        window.dispatchEvent(new CustomEvent('REFRESH_CHEF_ORDERS'));
      }
    });

    return () => {
      // Unregister events on unmount
      events.forEach(({ name, handler }) => {
        socket.off(name, handler);
      });
      socket.off('menu_updated');
      socket.off('order_status_updated');
      socket.off('new_order');
      
      // We don't disconnect the socket singleton here as other components 
      // might still be using it. Disconnect only on logout.
    };
  }, [user, isAuthenticated, userRole, JSON.stringify(events.map(e => e.name))]);

  return socketService;
};
