import React, { useState } from 'react';

function UserProfile({ user, updateUser, cart, theme }) {
  console.log('UserProfile rendered');
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  // Expensive operation that runs on every render
  const getUserStats = () => {
    let operations = 0;
    for (let i = 0; i < 50000; i++) {
      operations += cart.length * Math.random();
    }
    
    return {
      totalItems: cart.length,
      totalValue: cart.reduce((sum, item) => sum + item.price, 0),
      operations: operations.toFixed(2)
    };
  };

  const stats = getUserStats();

  const handleSave = () => {
    updateUser(tempUser);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <h2>User Profile</h2>
      
      {isEditing ? (
        <div>
          <input
            value={tempUser.name}
            onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
            placeholder="Name"
          />
          <input
            value={tempUser.email}
            onChange={(e) => setTempUser({...tempUser, email: e.target.value})}
            placeholder="Email"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <h3>Stats</h3>
        <p>Items in cart: {stats.totalItems}</p>
        <p>Cart value: ${stats.totalValue}</p>
        <p style={{ fontSize: '10px', opacity: 0.5 }}>
          Operations: {stats.operations}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
