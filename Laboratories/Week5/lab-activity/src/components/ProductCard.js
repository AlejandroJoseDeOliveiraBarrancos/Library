import React, { memo, useMemo } from 'react';
import { useCartStore } from '../store';

const ProductCard = memo(({ product }) => {
  console.log(`ProductCard ${product.name} rendered`);

  const isInCart = useCartStore(state => state.isInCart(product.id));
  const addToCart = useCartStore(state => state.addToCart);

  const calculatedValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += product.price * Math.random();
    }
    return result;
  }, [product.price]);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p style={{ fontSize: '10px', opacity: 0.5 }}>
        Calc: {calculatedValue.toFixed(2)}
      </p>
      <button 
        onClick={() => addToCart(product)}
        disabled={isInCart}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

