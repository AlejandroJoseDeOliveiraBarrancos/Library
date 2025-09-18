import React, { useState } from 'react';
import { IUser } from '../types/IUser';

interface SearchUserFormProps {
  onSearchUser: (username: string) => void;
  searchResult: IUser | null;
  searchMessage: string;
}

const SearchUserForm: React.FC<SearchUserFormProps> = ({ 
  onSearchUser, 
  searchResult, 
  searchMessage 
}) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearchUser(username.trim());
    }
  };

  return (
    <div className="search-user-form">
      <h3>Search User</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="search-username">Username:</label>
          <input
            type="text"
            id="search-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username to search"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      
      {searchMessage && (
        <div className={`search-result ${searchResult ? 'success' : 'error'}`}>
          <p>{searchMessage}</p>
          {searchResult && (
            <div className="search-user-info">
              <p><strong>ID:</strong> {searchResult.id}</p>
              <p><strong>Created:</strong> {searchResult.createdAt.toLocaleString()}</p>
              <p><strong>Total Points:</strong> {searchResult.points.reduce((sum, point) => sum + point.number, 0)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUserForm;
