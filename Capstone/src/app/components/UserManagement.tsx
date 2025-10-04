'use client';

import { useState } from 'react';
import { useUserStore } from '../stores/userStore';

export default function UserManagement() {
  const { user, users, loading, error, login, logout, fetchUsers } = useUserStore();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Management Example</h2>
      
      {!user ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      ) : (
        <div>
          <div className="mb-4 p-4 bg-green-100 rounded">
            <h3 className="font-semibold">Welcome, {user.name}!</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <button
              onClick={logout}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">All Users</h3>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Fetch Users'}
              </button>
            </div>
            
            {users.length > 0 && (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="p-2 border rounded">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-gray-600">{u.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <p className="mt-4 text-sm text-gray-600">
        This demonstrates async actions with Zustand. Try logging in with email: user@example.com, password: password
      </p>
    </div>
  );
}
