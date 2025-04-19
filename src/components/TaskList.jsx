import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleComplete, onDelete, onUpdate }) => {
  return (
    <ul className="w-full">
      {tasks.length === 0 ? (
        <li className="p-4 text-center text-gray-500">タスクがありません</li>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      )}
    </ul>
  );
};

export default TaskList; 