import React from 'react';

const TaskFilters = ({ filter, setFilter, markAll, clearCompleted }) => {
  return (
    <div className="w-full mb-4 flex justify-between items-center">
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          type="button"
        >
          全て
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded ${
            filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          type="button"
        >
          未完了
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          type="button"
        >
          完了済み
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => markAll(true)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          type="button"
        >
          全て完了
        </button>
        <button
          onClick={() => markAll(false)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          type="button"
        >
          全て未完了
        </button>
        <button
          onClick={clearCompleted}
          className="px-3 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600"
          type="button"
        >
          完了を削除
        </button>
      </div>
    </div>
  );
};

export default TaskFilters; 