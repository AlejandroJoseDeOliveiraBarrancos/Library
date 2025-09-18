import React from 'react';
import { IPoint } from '../types/IUser';

interface PointItemProps {
  point: IPoint;
  index: number;
  onUpdate: (index: number, newPoints: number) => void;
  onDelete: (index: number) => void;
}

const PointItem: React.FC<PointItemProps> = ({ point, index, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(point.number.toString());

  const handleUpdate = () => {
    const newPoints = parseInt(editValue);
    if (!isNaN(newPoints) && newPoints >= 0) {
      onUpdate(index, newPoints);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(point.number.toString());
    setIsEditing(false);
  };

  return (
    <div className="point-item">
      <div className="point-content">
        {isEditing ? (
          <div className="point-edit">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="point-input"
              min="0"
            />
            <button onClick={handleUpdate} className="btn btn-sm btn-primary">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-sm btn-secondary">
              Cancel
            </button>
          </div>
        ) : (
          <div className="point-display">
            <span className="point-number">{point.number} points</span>
            <span className="point-date">
              {point.datetime.toLocaleString()}
            </span>
          </div>
        )}
      </div>
      <div className="point-actions">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-sm btn-outline"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(index)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PointItem;
