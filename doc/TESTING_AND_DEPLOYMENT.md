# テストとデプロイ

このセクションでは、アプリケーションのテストとデプロイについて説明します。

## 1. テストの設定

### 1.1 テスト環境のセットアップ

JestとReact Testing Libraryをインストールします：

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

`jest.config.js`を作成します：

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

`src/setupTests.js`を作成します：

```javascript
import '@testing-library/jest-dom';
```

### 1.2 コンポーネントのテスト

#### TaskForm.test.jsx

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  it('タスクを追加できる', () => {
    const onAddTask = jest.fn();
    render(<TaskForm onAddTask={onAddTask} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.click(button);

    expect(onAddTask).toHaveBeenCalledWith('新しいタスク');
    expect(input.value).toBe('');
  });

  it('空のタスクは追加できない', () => {
    const onAddTask = jest.fn();
    render(<TaskForm onAddTask={onAddTask} />);

    const button = screen.getByText('追加');
    fireEvent.click(button);

    expect(onAddTask).not.toHaveBeenCalled();
  });
});
```

#### TaskList.test.jsx

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList', () => {
  const tasks = [
    { id: 1, text: 'タスク1', completed: false },
    { id: 2, text: 'タスク2', completed: true },
  ];

  it('タスク一覧を表示する', () => {
    render(
      <TaskList
        tasks={tasks}
        onToggleComplete={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    );

    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
  });

  it('タスクの完了状態を切り替えられる', () => {
    const onToggleComplete = jest.fn();
    render(
      <TaskList
        tasks={tasks}
        onToggleComplete={onToggleComplete}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(onToggleComplete).toHaveBeenCalledWith(1);
  });
});
```

### 1.3 カスタムフックのテスト

#### useTaskManager.test.js

```jsx
import { renderHook, act } from '@testing-library/react-hooks';
import useTaskManager from './useTaskManager';

describe('useTaskManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('タスクを追加できる', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('新しいタスク');
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].text).toBe('新しいタスク');
  });

  it('タスクを削除できる', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.addTask('タスク1');
      result.current.addTask('タスク2');
    });

    act(() => {
      result.current.deleteTask(result.current.tasks[0].id);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].text).toBe('タスク2');
  });
});
```

## 2. デプロイ

### 2.1 ビルドの作成

アプリケーションをビルドします：

```bash
npm run build
```

### 2.2 Vercelへのデプロイ

1. Vercelにアカウントを作成します（https://vercel.com）
2. Vercel CLIをインストールします：

```bash
npm install -g vercel
```

3. プロジェクトをデプロイします：

```bash
vercel
```

4. デプロイ設定を確認し、必要に応じて環境変数を設定します。

### 2.3 GitHub Pagesへのデプロイ

1. `package.json`に以下のスクリプトを追加します：

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. gh-pagesをインストールします：

```bash
npm install --save-dev gh-pages
```

3. `vite.config.js`を更新します：

```javascript
export default {
  base: '/task-manager/',
  // ... 他の設定
}
```

4. デプロイを実行します：

```bash
npm run deploy
```

## 3. 継続的インテグレーション（CI）

### 3.1 GitHub Actionsの設定

`.github/workflows/ci.yml`を作成します：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
```

## 4. パフォーマンス最適化

### 4.1 コード分割

`vite.config.js`を更新して、コード分割を有効にします：

```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
}
```

### 4.2 キャッシュ戦略

`index.html`に以下のメタタグを追加します：

```html
<meta http-equiv="Cache-Control" content="public, max-age=31536000" />
```

## 5. セキュリティ対策

### 5.1 Content Security Policy (CSP)

`index.html`にCSPメタタグを追加します：

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
```

### 5.2 環境変数の管理

`.env`ファイルを作成し、機密情報を管理します：

```env
VITE_API_URL=https://api.example.com
```

## 次のステップ

これでアプリケーションのテストとデプロイが完了しました。次のステップでは、アプリケーションの機能拡張や改善について検討します。 