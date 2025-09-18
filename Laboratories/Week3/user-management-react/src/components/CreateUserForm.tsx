import React, { useState } from 'react';

interface CreateUserFormProps {
  onCreateUser: (username: string) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreateUser }) => {
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onCreateUser(username.trim());
      setUsername('');
      setIsVisible(false);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="btn btn-primary"
      >
        Create New User
      </button>
    );
  }

  return (
    <div className="create-user-form">
      <h3>Create New User</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username (min 3 characters)"
            className="form-input"
            required
            minLength={3}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create User
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
