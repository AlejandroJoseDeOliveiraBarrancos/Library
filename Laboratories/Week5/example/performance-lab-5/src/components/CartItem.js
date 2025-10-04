import React from 'react';

function CartItem({ item, removeFromCart, user, theme }) {
  console.log(`CartItem ${item.name} rendered`);

  // This component receives user and theme props but doesn't use them
  // causing unnecessary re-renders

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #ddd',
      margin: '5px 0'
    }}>
      <div>
        <strong>{item.name}</strong>
        <div>${item.price}</div>
      </div>
      <button onClick={() => removeFromCart(item.id)}>
        Remove
      </button>
    </div>
  );
}

export default CartItem;
