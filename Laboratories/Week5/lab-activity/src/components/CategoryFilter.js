import React, { memo } from 'react';
import { useProductStore } from '../store';

const CategoryFilter = memo(() => {
  console.log('CategoryFilter rendered');
  
  const selectedCategory = useProductStore(state => state.selectedCategory);
  const setSelectedCategory = useProductStore(state => state.setSelectedCategory);
  const categories = useProductStore(state => state.getCategories());

  return (
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="category-select"
    >
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;
