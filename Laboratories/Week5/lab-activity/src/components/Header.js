import React, { memo, useMemo } from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ThemeToggle from './ThemeToggle';
import { useCartStore, useUserStore, useThemeStore } from '../store';

const useExpensiveCalculation = () => {
  return useMemo(() => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random();
    }
    return result;
  }, []);
};

const Header = memo(() => {
  console.log('Header rendered');
  
  const cartItemCount = useCartStore(state => state.getCartItemCount());
  const userName = useUserStore(state => state.user.name);
  const theme = useThemeStore(state => state.theme);
  
  const randomValue = useExpensiveCalculation();

  return (
    <header className={`card ${theme}`}>
      <h1>E-Commerce Store (Optimized)</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <SearchBar />
        <CategoryFilter />
        <ThemeToggle />
        
        <div>
          Welcome, {userName}! Cart: {cartItemCount} items
        </div>
        
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          Random: {randomValue.toFixed(2)}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
