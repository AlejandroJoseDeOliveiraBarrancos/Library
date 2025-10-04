import React, { memo } from 'react';
import ProductCard from './ProductCard';
import { useProductStore } from '../store';

const ProductList = memo(() => {
  console.log('ProductList rendered');
  
  const filteredProducts = useProductStore(state => state.getFilteredProducts());

  return (
    <div className="card">
      <h2>Products</h2>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;
