# タスク管理の状態管理

このセクションでは、タスク管理アプリケーションの状態管理を実装します。カスタムフック `useTaskManager` を作成して、タスクの追加、削除、更新、フィルタリングなどの機能を実装します。

## 1. useTaskManager カスタムフックの作成

`src/hooks/useTaskManager.js` を作成し、以下のコードを実装します：

```jsx
import { useState, useEffect } from 'react';

const useTaskManager = () => {
  // ローカルストレージからタスクを読み込む
  const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  // 状態の初期化
  const [tasks, setTasks] = useState(loadTasks());
  const [filter, setFilter] = useState('all');

  // タスクが変更されるたびにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // フィルタリングされたタスクの取得
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // タスクの追加
  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  // タスクの削除
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // タスクの完了状態の切り替え
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // タスクの更新
  const updateTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  // すべてのタスクを完了状態にする
  const markAll = () => {
    setTasks(tasks.map((task) => ({ ...task, completed: true })));
  };

  // 完了済みのタスクをすべて削除
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    markAll,
    clearCompleted,
  };
};

export default useTaskManager;
```

## 2. App.jsx の更新

`useTaskManager` フックを使用するように `App.jsx` を更新します：

```jsx
import React from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import TaskHelper from './components/TaskHelper';

const App = () => {
  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    markAll,
    clearCompleted,
  } = useTaskManager();

  return (
    <div className="flex flex-col items-center p-4 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">タスク管理アプリ</h1>
      <TaskForm onAddTask={addTask} />
      <TaskFilters
        filter={filter}
        setFilter={setFilter}
        markAll={markAll}
        clearCompleted={clearCompleted}
      />
      <div className="w-full mt-4 text-sm text-gray-500">
        全タスク: {tasks.length} | 完了済み: {tasks.filter((t) => t.completed).length} | 未完了: {tasks.filter((t) => !t.completed).length}
      </div>
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={toggleComplete}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
      <TaskHelper filteredTasks={filteredTasks} />
    </div>
  );
};

export default App;
```

## 3. TaskList.jsx の更新

タスクの編集機能を追加するために `TaskList.jsx` を更新します：

```jsx
import React, { useState } from 'react';

const TaskList = ({ tasks, onToggleComplete, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleSave = (id) => {
    onUpdate(id, editText);
    setEditingId(null);
  };

  return (
    <div className="w-full">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-2 border-b"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="h-4 w-4"
            />
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleSave(task.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave(task.id)}
                className="flex-1 p-1 border rounded"
                autoFocus
              />
            ) : (
              <span
                className={task.completed ? 'line-through text-gray-500' : ''}
                onDoubleClick={() => handleEdit(task)}
              >
                {task.text}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(task)}
              className="text-blue-500 hover:text-blue-700"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
```

## 4. TaskHelper.jsx の更新

AIアシスタント機能を強化するために `TaskHelper.jsx` を更新します：

```jsx
import React from 'react';

const TaskHelper = ({ filteredTasks }) => {
  const getTaskAnalysis = () => {
    if (filteredTasks.length === 0) {
      return 'タスクがありません。新しいタスクを追加しましょう！';
    }

    const completedTasks = filteredTasks.filter((task) => task.completed).length;
    const totalTasks = filteredTasks.length;
    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    if (completionRate === 100) {
      return '素晴らしい！すべてのタスクが完了しています。';
    } else if (completionRate >= 75) {
      return `順調です！タスクの${completionRate}%が完了しています。`;
    } else if (completionRate >= 50) {
      return `半分以上のタスクが完了しています。あと少し頑張りましょう！`;
    } else {
      return `タスクの進捗は${completionRate}%です。優先順位の高いタスクから取り組みましょう。`;
    }
  };

  return (
    <div className="w-full mt-4 p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-semibold mb-2">AIアシスタント</h2>
      <div className="text-sm text-gray-600">
        <p>{getTaskAnalysis()}</p>
      </div>
    </div>
  );
};

export default TaskHelper;
```

## 次のステップ

これでタスク管理の状態管理が実装できました。次のステップでは、アプリケーションのスタイリングを完成させ、レスポンシブデザインを実装します。 