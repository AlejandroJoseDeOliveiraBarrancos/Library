import React from 'react';

function ProductCard({ product, cart, addToCart, theme }) {
  console.log(`ProductCard ${product.name} rendered`);

  // Expensive calculation that runs on every render
  const isInCart = cart.some(item => item.id === product.id);
  
  // Unnecessary complex operation
  const complexCalculation = () => {
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += product.price * Math.random();
    }
    return result;
  };

  const calculatedValue = complexCalculation();

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
}

export default ProductCard;
