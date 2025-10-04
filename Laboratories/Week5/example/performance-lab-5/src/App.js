import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';

function App() {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
    { id: 2, name: 'Phone', price: 699, category: 'Electronics' },
    { id: 3, name: 'Book', price: 29, category: 'Education' },
    { id: 4, name: 'Headphones', price: 199, category: 'Electronics' },
    { id: 5, name: 'Tablet', price: 399, category: 'Electronics' }
  ]);

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [theme, setTheme] = useState('light');

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <Header 
        user={user}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <div className="main-content">
        <ProductList 
          products={products}
          cart={cart}
          addToCart={addToCart}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          theme={theme}
        />
        
        <div className="sidebar">
          <Cart 
            cart={cart}
            removeFromCart={removeFromCart}
            user={user}
            theme={theme}
          />
          
          <UserProfile 
            user={user}
            updateUser={updateUser}
            cart={cart}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
