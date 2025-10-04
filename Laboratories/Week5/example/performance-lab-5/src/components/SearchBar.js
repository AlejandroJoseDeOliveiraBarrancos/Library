import React from 'react';

function SearchBar({ searchTerm, setSearchTerm, theme }) {
  // This component re-renders unnecessarily when theme changes
  console.log('SearchBar rendered');

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

export default SearchBar;
