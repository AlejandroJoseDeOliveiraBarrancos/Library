import React, { useState } from 'react';
import { IUser } from '../types/IUser';
import PointItem from './PointItem';

interface UserCardProps {
  user: IUser;
  onUpdateUser: (currentUsername: string, newUsername: string) => void;
  onDeleteUser: (username: string) => void;
  onAddPoints: (username: string, points: number) => void;
  onUpdatePoint: (username: string, pointIndex: number, newPoints: number) => void;
  onDeletePoint: (username: string, pointIndex: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onUpdateUser,
  onDeleteUser,
  onAddPoints,
  onUpdatePoint,
  onDeletePoint
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [showAddPoints, setShowAddPoints] = useState(false);

  const handleUpdateUsername = () => {
    if (newUsername.trim() && newUsername !== user.username) {
      onUpdateUser(user.username, newUsername.trim());
      setIsEditingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setNewUsername(user.username);
    setIsEditingUsername(false);
  };

  const handleAddPoints = () => {
    const points = parseInt(pointsToAdd);
    if (!isNaN(points) && points > 0) {
      onAddPoints(user.username, points);
      setPointsToAdd('');
      setShowAddPoints(false);
    }
  };

  const totalPoints = user.points.reduce((sum, point) => sum + point.number, 0);

  return (
    <div className="user-card">
      <div className="user-header">
        <div className="user-info">
          {isEditingUsername ? (
            <div className="username-edit">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="username-input"
              />
              <button onClick={handleUpdateUsername} className="btn btn-sm btn-primary">
                Save
              </button>
              <button onClick={handleCancelEdit} className="btn btn-sm btn-secondary">
                Cancel
              </button>
            </div>
          ) : (
            <h3 className="username">{user.username}</h3>
          )}
          <p className="user-id">ID: {user.id}</p>
          <p className="user-created">
            Created: {user.createdAt.toLocaleString()}
          </p>
          <p className="total-points">Total Points: {totalPoints}</p>
        </div>
        <div className="user-actions">
          {!isEditingUsername && (
            <>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="btn btn-sm btn-outline"
              >
                Edit Username
              </button>
              <button
                onClick={() => onDeleteUser(user.username)}
                className="btn btn-sm btn-danger"
              >
                Delete User
              </button>
            </>
          )}
        </div>
      </div>

      <div className="points-section">
        <div className="points-header">
          <h4>Points ({user.points.length})</h4>
          <button
            onClick={() => setShowAddPoints(!showAddPoints)}
            className="btn btn-sm btn-primary"
          >
            {showAddPoints ? 'Cancel' : 'Add Points'}
          </button>
        </div>

        {showAddPoints && (
          <div className="add-points-form">
            <input
              type="number"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(e.target.value)}
              placeholder="Enter points to add"
              className="points-input"
              min="1"
            />
            <button onClick={handleAddPoints} className="btn btn-sm btn-success">
              Add Points
            </button>
          </div>
        )}

        <div className="points-list">
          {user.points.length === 0 ? (
            <p className="no-points">No points yet</p>
          ) : (
            user.points.map((point, index) => (
              <PointItem
                key={`${point.datetime.getTime()}-${index}`}
                point={point}
                index={index}
                onUpdate={(pointIndex, newPoints) => onUpdatePoint(user.username, pointIndex, newPoints)}
                onDelete={(pointIndex) => onDeletePoint(user.username, pointIndex)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
