import React, { useState, useEffect } from 'react';
import UserService from './services/UserService';
import { IUser, IResult } from './types/IUser';
import UserCard from './components/UserCard';
import CreateUserForm from './components/CreateUserForm';
import SearchUserForm from './components/SearchUserForm';
import './App.css';

function App() {
  const [userService] = useState(() => new UserService());
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchResult, setSearchResult] = useState<IUser | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const showMessage = (result: IResult<any>, type: 'success' | 'error' = 'success') => {
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const loadAllUsers = () => {
    const result = userService.getAllUsers();
    if (result.success) {
      setUsers(result.data || []);
      setUserCount(result.data?.length || 0);
    }
  };

  const handleCreateUser = (username: string) => {
    const result = userService.createUser(username);
    showMessage(result);
    if (result.success) {
      loadAllUsers();
    }
  };

  const handleSearchUser = (username: string) => {
    const result = userService.getUserByUsername(username);
    setSearchResult(result.success ? result.data || null : null);
    setSearchMessage(result.message);
  };

  const handleUpdateUser = (currentUsername: string, newUsername: string) => {
    const result = userService.updateUser(currentUsername, newUsername);
    showMessage(result);
    if (result.success) {
      loadAllUsers();
      setSearchResult(null);
      setSearchMessage('');
    }
  };

  const handleDeleteUser = (username: string) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      const result = userService.deleteUser(username);
      showMessage(result);
      if (result.success) {
        loadAllUsers();
        setSearchResult(null);
        setSearchMessage('');
      }
    }
  };

  const handleAddPoints = (username: string, points: number) => {
    const result = userService.addPoints(username, points);
    showMessage(result);
    if (result.success) {
      loadAllUsers();
      if (searchResult && searchResult.username === username) {
        const updatedUser = userService.getUserByUsername(username);
        if (updatedUser.success) {
          setSearchResult(updatedUser.data || null);
        }
      }
    }
  };

  const handleUpdatePoint = (username: string, pointIndex: number, newPoints: number) => {
    const result = userService.updatePoint(username, pointIndex, newPoints);
    showMessage(result);
    if (result.success) {
      loadAllUsers();
      if (searchResult && searchResult.username === username) {
        const updatedUser = userService.getUserByUsername(username);
        if (updatedUser.success) {
          setSearchResult(updatedUser.data || null);
        }
      }
    }
  };

  const handleDeletePoint = (username: string, pointIndex: number) => {
    if (window.confirm(`Are you sure you want to delete this point?`)) {
      const result = userService.deletePoint(username, pointIndex);
      showMessage(result);
      if (result.success) {
        loadAllUsers();
        if (searchResult && searchResult.username === username) {
          const updatedUser = userService.getUserByUsername(username);
          if (updatedUser.success) {
            setSearchResult(updatedUser.data || null);
          }
        }
      }
    }
  };

  const handleClearAllUsers = () => {
    if (window.confirm('Are you sure you want to clear ALL users? This action cannot be undone.')) {
      const result = userService.clearAllUsers();
      showMessage(result);
      if (result.success) {
        loadAllUsers();
        setSearchResult(null);
        setSearchMessage('');
      }
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>User Management System</h1>
        <p>Manage users and their points with a modern React interface</p>
      </header>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <main className="app-main">
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{userCount}</p>
          </div>
          <button onClick={handleClearAllUsers} className="btn btn-danger">
            Clear All Users
          </button>
        </div>

        <div className="forms-section">
          <div className="form-container">
            <CreateUserForm onCreateUser={handleCreateUser} />
          </div>
          <div className="form-container">
            <SearchUserForm
              onSearchUser={handleSearchUser}
              searchResult={searchResult}
              searchMessage={searchMessage}
            />
          </div>
        </div>

        <div className="users-section">
          <h2>All Users ({users.length})</h2>
          {users.length === 0 ? (
            <div className="no-users">
              <p>No users found. Create your first user to get started!</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  onAddPoints={handleAddPoints}
                  onUpdatePoint={handleUpdatePoint}
                  onDeletePoint={handleDeletePoint}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
