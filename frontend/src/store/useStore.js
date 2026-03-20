import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const useStore = create((set, get) => ({
  // Auth state
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  // Products state
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  currentProduct: null,
  categories: [],
  brands: [],
  
  // Cart state
  cart: [],
  cartTotal: 0,
  
  // Wishlist state
  wishlist: [],
  
  // Orders state
  orders: [],
  
  // Try-on state
  tryOnHistory: [],
  
  // Loading states
  loading: false,
  error: null,
  
  // Auth actions
  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
      await get().fetchCart();
      await get().fetchWishlist();
      return res.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, cart: [], wishlist: [] });
  },
  
  // Product actions
  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/products`, { params });
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', loading: false });
    }
  },
  
  fetchFeaturedProducts: async () => {
    try {
      const res = await axios.get(`${API_URL}/products/featured`);
      set({ featuredProducts: res.data.products });
    } catch (error) {
      console.error('Failed to fetch featured products');
    }
  },
  
  fetchTrendingProducts: async () => {
    try {
      const res = await axios.get(`${API_URL}/products/trending`);
      set({ trendingProducts: res.data.products });
    } catch (error) {
      console.error('Failed to fetch trending products');
    }
  },
  
  fetchProduct: async (id) => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/products/${id}`);
      set({ currentProduct: res.data.product, loading: false });
      
      if (get().isAuthenticated) {
        await axios.post(`${API_URL}/auth/track/${id}`, {}, {
          headers: { Authorization: `Bearer ${get().token}` }
        });
      }
    } catch (error) {
      set({ error: 'Failed to fetch product', loading: false });
    }
  },
  
  fetchCategories: async () => {
    try {
      const res = await axios.get(`${API_URL}/products/categories`);
      set({ categories: res.data.categories });
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  },
  
  // Cart actions
  fetchCart: async () => {
    if (!get().isAuthenticated) return;
    try {
      const res = await axios.get(`${API_URL}/auth/cart`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ cart: res.data.cart || [] });
      get().calculateCartTotal();
    } catch (error) {
      console.error('Failed to fetch cart');
    }
  },
  
  addToCart: async (productId, quantity = 1, size, color) => {
    try {
      const res = await axios.post(`${API_URL}/auth/cart`, 
        { productId, quantity, size, color },
        { headers: { Authorization: `Bearer ${get().token}` } }
      );
      set({ cart: res.data.cart || [] });
      get().calculateCartTotal();
    } catch (error) {
      console.error('Failed to add to cart');
    }
  },
  
  updateCartItem: async (productId, quantity, size, color) => {
    try {
      const res = await axios.put(`${API_URL}/auth/cart`,
        { productId, quantity, size, color },
        { headers: { Authorization: `Bearer ${get().token}` } }
      );
      set({ cart: res.data.cart || [] });
      get().calculateCartTotal();
    } catch (error) {
      console.error('Failed to update cart');
    }
  },
  
  removeFromCart: async (productId, size, color) => {
    try {
      const res = await axios.delete(`${API_URL}/auth/cart`,
        { data: { productId, size, color }, headers: { Authorization: `Bearer ${get().token}` } }
      );
      set({ cart: res.data.cart || [] });
      get().calculateCartTotal();
    } catch (error) {
      console.error('Failed to remove from cart');
    }
  },
  
  calculateCartTotal: () => {
    const cart = get().cart;
    const total = cart.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    set({ cartTotal: total });
  },
  
  // Wishlist actions
  fetchWishlist: async () => {
    if (!get().isAuthenticated) return;
    try {
      const res = await axios.get(`${API_URL}/auth/wishlist`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ wishlist: res.data.wishlist || [] });
    } catch (error) {
      console.error('Failed to fetch wishlist');
    }
  },
  
  addToWishlist: async (productId) => {
    try {
      await axios.post(`${API_URL}/auth/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist');
    }
  },
  
  removeFromWishlist: async (productId) => {
    try {
      await axios.delete(`${API_URL}/auth/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist');
    }
  },
  
  isInWishlist: (productId) => {
    return get().wishlist.some(item => item.product?._id === productId);
  },
  
  // Order actions
  createOrder: async (orderData) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ cart: [], cartTotal: 0, loading: false });
      return res.data;
    } catch (error) {
      set({ error: 'Failed to create order', loading: false });
      throw error;
    }
  },
  
  fetchOrders: async () => {
    if (!get().isAuthenticated) return;
    try {
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ orders: res.data.orders || [] });
    } catch (error) {
      console.error('Failed to fetch orders');
    }
  },
  
  // Try-on actions
  fetchTryOnHistory: async () => {
    if (!get().isAuthenticated) return;
    try {
      const res = await axios.get(`${API_URL}/tryon/history`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ tryOnHistory: res.data.history || [] });
    } catch (error) {
      console.error('Failed to fetch try-on history');
    }
  },
  
  processTryOn: async (productId, userImage, method) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${API_URL}/tryon/process`,
        { productId, userImage, method },
        { headers: { Authorization: `Bearer ${get().token}` } }
      );
      set({ loading: false });
      return res.data.result;
    } catch (error) {
      set({ error: 'Failed to process try-on', loading: false });
      throw error;
    }
  },
  
  // Recommendation actions
  fetchRecommendations: async () => {
    if (!get().isAuthenticated) return [];
    try {
      const res = await axios.get(`${API_URL}/products/recommendations`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      return res.data.recommendations;
    } catch (error) {
      return [];
    }
  },
  
  // Price comparison
  getPriceComparison: async (productId) => {
    try {
      const res = await axios.get(`${API_URL}/products/${productId}/compare`);
      return res.data.comparison;
    } catch (error) {
      return null;
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useStore;
