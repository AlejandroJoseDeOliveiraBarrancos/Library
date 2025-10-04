import React, { memo } from 'react';
import { useProductStore } from '../store';

const SearchBar = memo(() => {
  console.log('SearchBar rendered');
  
  const searchTerm = useProductStore(state => state.searchTerm);
  const setSearchTerm = useProductStore(state => state.setSearchTerm);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
