import React, { memo } from 'react';
import CartItem from './CartItem';
import { useCartStore, useUserStore } from '../store';

const Cart = memo(() => {
  console.log('Cart rendered');
  
  const cartItems = useCartStore(state => state.items);
  const cartTotal = useCartStore(state => state.getCartTotal());
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const userName = useUserStore(state => state.user.name);

  return (
    <div className="card">
      <h2>Shopping Cart</h2>
      <p>User: {userName}</p>
      
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem 
              key={item.id}
              item={item}
              onRemove={removeFromCart}
            />
          ))}
          <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Total: ${cartTotal}
          </div>
        </>
      )}
    </div>
  );
});

Cart.displayName = 'Cart';

export default Cart;

