import React, { useState, useEffect } from "react";

const TaskManager = () => {
  // タスクのステート管理
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // ローカルストレージへの保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // タスクの追加
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  // タスクの削除
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // タスクの完了/未完了トグル
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 編集開始
  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditText(currentTitle);
  };

  // 編集保存
  const saveEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: editText } : task
      )
    );
    setEditingId(null);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
  };

  // タスクのフィルタリング
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // 全てのタスクを完了/未完了に設定
  const markAll = (completed) => {
    setTasks(tasks.map((task) => ({ ...task, completed })));
  };

  // 完了済みのタスクを全て削除
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">タスク管理アプリ</h1>

      {/* 新タスク追加フォーム */}
      <form onSubmit={handleAddTask} className="w-full mb-6 flex">
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

      {/* フィルター */}
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

      {/* タスクリスト */}
      <ul className="w-full">
        {filteredTasks.length === 0 ? (
          <li className="p-4 text-center text-gray-500">タスクがありません</li>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`p-3 mb-2 border rounded flex items-center justify-between ${
                task.completed ? "bg-gray-50" : "bg-white"
              }`}
            >
              {editingId === task.id ? (
                <div className="flex-grow flex">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow p-1 border rounded"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    type="button"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
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
                      onChange={() => toggleComplete(task.id)}
                      className="mr-3 h-5 w-5"
                    />
                    <span
                      className={
                        task.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {task.createdAt}
                    </span>
                    <button
                      onClick={() => startEditing(task.id, task.title)}
                      className="mr-2 px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200 text-yellow-600"
                      type="button"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600"
                      type="button"
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>

      {/* タスク統計 */}
      <div className="w-full mt-4 text-sm text-gray-500">
        全タスク: {tasks.length} | 完了済み:{" "}
        {tasks.filter((t) => t.completed).length} | 未完了:{" "}
        {tasks.filter((t) => !t.completed).length}
      </div>
    </div>
  );
};

export default TaskManager;
