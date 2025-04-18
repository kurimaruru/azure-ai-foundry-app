import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const handleSave = () => {
    onUpdate(task.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.title);
    setIsEditing(false);
  };

  return (
    <li
      className={`p-3 mb-2 border rounded flex items-center justify-between ${
        task.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      {isEditing ? (
        <div className="flex-grow flex">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-grow p-1 border rounded"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            type="button"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="ml-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
            type="button"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="mr-3 h-5 w-5"
            />
            <span className={task.completed ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">
              {task.createdAt}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="mr-2 px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200 text-yellow-600"
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
        </>
      )}
    </li>
  );
};

export default TaskItem; 