import React from 'react';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <ProductList />
        
        <div className="sidebar">
          <Cart />
          <UserProfile />
        </div>
      </div>
    </div>
  );
}

export default App;
