import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, cart, addToCart, searchTerm, selectedCategory, theme }) {
  console.log('ProductList rendered');

  // Expensive filtering operation that runs on every render
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // Intentional performance issue: unnecessary complex operation
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="product-grid">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          cart={cart}
          addToCart={addToCart}
          theme={theme}
        />
      ))}
    </div>
  );
}

export default ProductList;
