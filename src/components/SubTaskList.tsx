import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SubTask } from '../types';

interface SubTaskListProps {
  todoId: string;
  subtasks: SubTask[];
  onAdd: (todoId: string, text: string) => void;
  onToggle: (todoId: string, subtaskId: string) => void;
  onDelete: (todoId: string, subtaskId: string) => void;
}

export default function SubTaskList({
  todoId,
  subtasks,
  onAdd,
  onToggle,
  onDelete,
}: SubTaskListProps) {
  const [newSubTask, setNewSubTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTask.trim()) {
      onAdd(todoId, newSubTask);
      setNewSubTask('');
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          placeholder="Add subtask..."
          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        >
          <Plus size={16} />
        </button>
      </form>

      {subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className="flex items-center space-x-2 group text-sm"
        >
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={() => onToggle(todoId, subtask.id)}
            className="rounded text-blue-500"
          />
          <span className={subtask.completed ? 'line-through text-gray-400' : ''}>
            {subtask.text}
          </span>
          <button
            onClick={() => onDelete(todoId, subtask.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}