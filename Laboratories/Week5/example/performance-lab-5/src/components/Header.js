import React from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ThemeToggle from './ThemeToggle';

function Header({ user, cart, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, theme, toggleTheme }) {
  // Intentional performance issue: expensive calculation on every render
  const expensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random();
    }
    return result;
  };

  const randomValue = expensiveCalculation();

  return (
    <header className="card">
      <h1>E-Commerce Store</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
        />
        
        <CategoryFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          theme={theme}
        />
        
        <ThemeToggle 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <div>
          Welcome, {user.name}! Cart: {cart.length} items
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          Random: {randomValue.toFixed(2)}
        </div>
      </div>
    </header>
  );
}

export default Header;
