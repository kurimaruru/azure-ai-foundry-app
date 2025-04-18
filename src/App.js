import React from "react";
import { useTaskManager } from "./hooks/useTaskManager";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import { AITaskHelper } from "./components/TaskHelper";

const TaskManager = () => {
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
      <TaskList
        tasks={filteredTasks}
        onToggleComplete={toggleComplete}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />

      <div className="w-full mt-4 text-sm text-gray-500">
        全タスク: {tasks.length} | 完了済み:{" "}
        {tasks.filter((t) => t.completed).length} | 未完了:{" "}
        {tasks.filter((t) => !t.completed).length}
      </div>
      <AITaskHelper />
    </div>
  );
};

export default TaskManager;
