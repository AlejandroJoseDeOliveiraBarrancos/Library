import React, { memo, useMemo } from 'react';
import { useUserStore, useCartStore } from '../store';

const UserProfile = memo(() => {
  console.log('UserProfile rendered');
  
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);
  const cartItems = useCartStore(state => state.items);

  const userStats = useMemo(() => {
    const totalSpent = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalOrders = cartItems.length;
    
    const categoryCount = cartItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {});
    
    const favoriteCategory = Object.keys(categoryCount).length > 0
      ? Object.entries(categoryCount).reduce((a, b) => categoryCount[a[0]] > categoryCount[b[0]] ? a : b)[0]
      : 'None';

    return {
      totalSpent,
      totalOrders,
      favoriteCategory
    };
  }, [cartItems]);

  const handleUpdateUser = () => {
    const newName = prompt('Enter new name:', user.name);
    if (newName) {
      updateUser({ ...user, name: newName });
    }
  };

  return (
    <div className="card">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      
      <button onClick={handleUpdateUser} style={{ marginBottom: '15px' }}>
        Update Name
      </button>
      
      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-value">${userStats.totalSpent}</div>
          <div>Total Spent</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{userStats.totalOrders}</div>
          <div>Total Orders</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{userStats.favoriteCategory}</div>
          <div>Favorite Category</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{cartItems.length}</div>
          <div>Cart Items</div>
        </div>
      </div>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;

