import React from 'react';

function CategoryFilter({ selectedCategory, setSelectedCategory, theme }) {
  console.log('CategoryFilter rendered');

  const categories = ['All', 'Electronics', 'Education'];

  return (
    <select 
      value={selectedCategory} 
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;
