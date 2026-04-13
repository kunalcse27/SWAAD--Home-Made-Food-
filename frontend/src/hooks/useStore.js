import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  userRole: null, // 'customer' | 'chef' | 'deliveryPartner'

  setUser: (user, role) => set({ user, isAuthenticated: true, userRole: role }),
  logout: () => set({ user: null, isAuthenticated: false, userRole: null, cart: null }),

  // Location
  location: 'Connaught Place, Delhi',
  setLocation: (loc) => set({ location: loc }),

  // Filters
  activeFilter: 'all',
  searchQuery: '',
  setFilter: (f) => set({ activeFilter: f }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  // Cart / Subscription
  cart: null, // { chef, plan, deliveryOption, customizations }
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),

  // Wishlist
  wishlist: [],
  toggleWishlist: (chefId) => {
    const { wishlist } = get();
    if (wishlist.includes(chefId)) {
      set({ wishlist: wishlist.filter(id => id !== chefId) });
    } else {
      set({ wishlist: [...wishlist, chefId] });
    }
  },
  isWishlisted: (chefId) => get().wishlist.includes(chefId),

  // UI state
  isNavScrolled: false,
  setNavScrolled: (v) => set({ isNavScrolled: v }),
}));

export default useStore;
