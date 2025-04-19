# プロジェクトのセットアップと基本的なコンポーネントの作成

## 1. プロジェクトのセットアップ

### 1.1 プロジェクトの作成

以下のコマンドを実行して、新しいReactプロジェクトを作成します：

```bash
# Viteを使用して新しいReactプロジェクトを作成
npm create vite@latest task-manager -- --template react

# プロジェクトディレクトリに移動
cd task-manager

# 依存関係のインストール
npm install
```

### 1.2 Tailwind CSSのセットアップ

Tailwind CSSをインストールして設定します：

```bash
# Tailwind CSSと必要な依存関係をインストール
npm install -D tailwindcss postcss autoprefixer

# Tailwind CSSの設定ファイルを生成
npx tailwindcss init -p
```

`tailwind.config.js`を以下のように設定します：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`src/index.css`にTailwind CSSの基本スタイルを追加します：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 2. 基本的なコンポーネントの作成

### 2.1 ディレクトリ構造の作成

以下のディレクトリ構造を作成します：

```
src/
  ├── components/
  │   ├── TaskForm.jsx
  │   ├── TaskList.jsx
  │   ├── TaskFilters.jsx
  │   └── TaskHelper.jsx
  ├── hooks/
  │   └── useTaskManager.js
  ├── App.jsx
  └── index.js
```

### 2.2 各コンポーネントの基本実装

#### TaskForm.jsx

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
      <div className="flex gap-2">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
```

#### TaskList.jsx

```jsx
import React from 'react';

const TaskList = ({ tasks, onToggleComplete, onDelete, onUpdate }) => {
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
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.text}
            </span>
          </div>
          <div className="flex gap-2">
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

#### TaskFilters.jsx

```jsx
import React from 'react';

const TaskFilters = ({ filter, setFilter, markAll, clearCompleted }) => {
  return (
    <div className="flex justify-between w-full mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded ${
            filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          未完了
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded ${
            filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          完了済み
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={markAll}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          すべて完了
        </button>
        <button
          onClick={clearCompleted}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          完了済みを削除
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
```

#### TaskHelper.jsx

```jsx
import React from 'react';

const TaskHelper = ({ filteredTasks }) => {
  return (
    <div className="w-full mt-4 p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-semibold mb-2">AIアシスタント</h2>
      <div className="text-sm text-gray-600">
        {filteredTasks.length === 0 ? (
          <p>タスクがありません。新しいタスクを追加しましょう！</p>
        ) : (
          <p>現在のタスク状況を分析中...</p>
        )}
      </div>
    </div>
  );
};

export default TaskHelper;
```

### 2.3 App.jsxの更新

```jsx
import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import TaskHelper from './components/TaskHelper';

const App = () => {
  return (
    <div className="flex flex-col items-center p-4 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">タスク管理アプリ</h1>
      <TaskForm onAddTask={() => {}} />
      <TaskFilters
        filter="all"
        setFilter={() => {}}
        markAll={() => {}}
        clearCompleted={() => {}}
      />
      <TaskList
        tasks={[]}
        onToggleComplete={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
      <TaskHelper filteredTasks={[]} />
    </div>
  );
};

export default App;
```

## 次のステップ

これで基本的なコンポーネントの作成が完了しました。次のステップでは、タスク管理の状態管理を実装します。`useTaskManager` カスタムフックを作成して、タスクの追加、削除、更新などの機能を実装していきます。 