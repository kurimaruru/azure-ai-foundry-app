import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTaskTitle, description, dueDate);
    setNewTaskTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="flex mb-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="タスクのタイトルを入力..."
          className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none"
          required
        />
        <div　className="p-2 border border-gray-300 rounded-l focus:outline-none">期限</div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          追加
        </button>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="タスクの詳細を入力..."
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        rows="2"
      />
    </form>
  );
};

export default TaskForm; 