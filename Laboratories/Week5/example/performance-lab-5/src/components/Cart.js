import React from 'react';
import CartItem from './CartItem';

function Cart({ cart, removeFromCart, user, theme }) {
  console.log('Cart rendered');

  // Expensive total calculation on every render
  const calculateTotal = () => {
    let total = 0;
    for (let i = 0; i < 1000; i++) {
      total += cart.reduce((sum, item) => sum + item.price, 0) * 0.001;
    }
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const total = calculateTotal();

  return (
    <div className="card">
      <h2>Shopping Cart</h2>
      <p>User: {user.name}</p>
      
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <CartItem 
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
              user={user}
              theme={theme}
            />
          ))}
          <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Total: ${total}
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
