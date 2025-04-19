# スタイリングとレスポンシブデザイン

このセクションでは、アプリケーションのスタイリングを完成させ、レスポンシブデザインを実装します。

## 1. グローバルスタイルの設定

`src/index.css` を更新して、アプリケーション全体のスタイルを設定します：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-100 min-h-screen;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded transition-colors duration-200;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }
  
  .btn-danger {
    @apply bg-red-500 text-white hover:bg-red-600;
  }
  
  .btn-success {
    @apply bg-green-500 text-white hover:bg-green-600;
  }
  
  .input {
    @apply p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

## 2. コンポーネントのスタイリング更新

### 2.1 TaskForm.jsx の更新

```jsx
import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText);
      setTaskText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="input flex-1"
        />
        <button
          type="submit"
          className="btn btn-primary"
        >
          追加
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
```

### 2.2 TaskList.jsx の更新

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
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleSave(task.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave(task.id)}
                className="input flex-1"
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
                onDoubleClick={() => handleEdit(task)}
              >
                {task.text}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => handleEdit(task)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
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

### 2.3 TaskFilters.jsx の更新

```jsx
import React from 'react';

const TaskFilters = ({ filter, setFilter, markAll, clearCompleted }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between w-full mb-4 gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`btn ${
            filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          未完了
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`btn ${
            filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          完了済み
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={markAll}
          className="btn btn-success"
        >
          すべて完了
        </button>
        <button
          onClick={clearCompleted}
          className="btn btn-danger"
        >
          完了済みを削除
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
```

### 2.4 TaskHelper.jsx の更新

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
    <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">AIアシスタント</h2>
      <div className="text-sm text-gray-600">
        <p>{getTaskAnalysis()}</p>
      </div>
    </div>
  );
};

export default TaskHelper;
```

### 2.5 App.jsx の更新

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
    <div className="flex flex-col items-center p-4 sm:p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">タスク管理アプリ</h1>
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

## 3. レスポンシブデザインの実装

Tailwind CSSのレスポンシブクラスを使用して、モバイルファーストのデザインを実装します。主な変更点は以下の通りです：

1. モバイル表示（デフォルト）:
   - 1カラムレイアウト
   - 小さいパディングとマージン
   - 縦に並んだボタン

2. タブレット表示（sm:）:
   - 2カラムレイアウト
   - 中程度のパディングとマージン
   - 横に並んだボタン

3. デスクトップ表示（md:）:
   - 最大幅の制限
   - 大きいパディングとマージン
   - 最適化されたレイアウト

## 4. アニメーションとトランジション

ユーザーエクスペリエンスを向上させるために、以下のアニメーションとトランジションを追加しました：

1. ボタンのホバーエフェクト
2. タスクアイテムのホバーエフェクト
3. スムーズなカラートランジション

## 次のステップ

これでアプリケーションのスタイリングとレスポンシブデザインが完成しました。次のステップでは、アプリケーションのテストとデプロイについて説明します。 