import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useProductStore = create(
  devtools(
    (set, get) => ({
      products: [
        { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
        { id: 2, name: 'Phone', price: 699, category: 'Electronics' },
        { id: 3, name: 'Book', price: 29, category: 'Education' },
        { id: 4, name: 'Headphones', price: 199, category: 'Electronics' },
        { id: 5, name: 'Tablet', price: 399, category: 'Electronics' }
      ],
      searchTerm: '',
      selectedCategory: 'All',
      
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      getFilteredProducts: () => {
        const { products, searchTerm, selectedCategory } = get();
        return products.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });
      },
      
      getCategories: () => {
        const { products } = get();
        return ['All', ...new Set(products.map(p => p.category))];
      }
    }),
    { name: 'product-store' }
  )
);

const useCartStore = create(
  devtools(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      
      removeFromCart: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      isInCart: (productId) => {
        return get().items.some(item => item.id === productId);
      }
    }),
    { name: 'cart-store' }
  )
);

const useUserStore = create(
  devtools(
    (set, get) => ({
      user: { name: 'John Doe', email: 'john@example.com' },
      
      updateUser: (newUser) => set({ user: newUser }),
      
      getUserStats: () => {
        const { user } = get();
        const { items } = useCartStore.getState();
        
        return {
          name: user.name,
          email: user.email,
          totalOrders: items.length,
          totalSpent: items.reduce((total, item) => total + (item.price * item.quantity), 0),
          favoriteCategory: items.length > 0 
            ? items.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.quantity;
                return acc;
              }, {})
            : {}
        };
      }
    }),
    { name: 'user-store' }
  )
);

const useThemeStore = create(
  devtools(
    (set) => ({
      theme: 'light',
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      }))
    }),
    { name: 'theme-store' }
  )
);

export { useProductStore, useCartStore, useUserStore, useThemeStore };
