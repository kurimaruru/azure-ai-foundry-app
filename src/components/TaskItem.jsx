import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDueDate, setEditDueDate] = useState(task.dueDate);

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate);
    setIsEditing(false);
  };

  return (
    <li
      className={`p-3 mb-2 border rounded ${
        task.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-grow p-1 border rounded"
              autoFocus
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="ml-2 p-1 border rounded"
            />
          </div>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-1 border rounded"
            rows="2"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              type="button"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              type="button"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="mr-3 h-5 w-5"
              />
              <div>
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <span className="ml-2 text-xs text-gray-500">
                    期限: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {task.dueDate}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200 text-yellow-600"
                type="button"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600"
                type="button"
              >
                削除
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 ml-8">{task.description}</p>
          )}
        </div>
      )}
    </li>
  );
};

export default TaskItem; 