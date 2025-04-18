import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTaskTitle);
    setNewTaskTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6 flex">
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
      >
        追加
      </button>
    </form>
  );
};

export default TaskForm; 