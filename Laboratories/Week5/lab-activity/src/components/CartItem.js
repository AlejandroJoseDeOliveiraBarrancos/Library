import React, { memo } from 'react';

const CartItem = memo(({ item, onRemove }) => {
  console.log(`CartItem ${item.name} rendered`);

  return (
    <div className="cart-item">
      <div>
        <strong>{item.name}</strong>
        <br />
        <span>${item.price} x {item.quantity}</span>
      </div>
      <button 
        onClick={() => onRemove(item.id)}
        style={{ 
          background: '#dc3545', 
          color: 'white', 
          border: 'none', 
          padding: '4px 8px', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Remove
      </button>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;

