import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { SubTask } from '../types';

interface SubTaskListProps {
  todoId: string;
  subtasks: SubTask[];
  onAdd: (todoId: string, text: string) => void;
  onToggle: (todoId: string, subtaskId: string) => void;
  onDelete: (todoId: string, subtaskId: string) => void;
  onUpdate: (todoId: string, subtaskId: string, text: string) => void;
}

export default function SubTaskList({
  todoId,
  subtasks,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
}: SubTaskListProps) {
  const [newSubTask, setNewSubTask] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTask.trim()) {
      onAdd(todoId, newSubTask);
      setNewSubTask('');
    }
  };

  const handleEdit = (subtask: SubTask) => {
    setEditingId(subtask.id);
    setEditingText(subtask.text);
  };

  const handleEditSubmit = (subtaskId: string) => {
    if (editingText.trim()) {
      onUpdate(todoId, subtaskId, editingText);
      setEditingId(null);
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
          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
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
          {editingId === subtask.id ? (
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={() => handleEditSubmit(subtask.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(subtask.id)}
              className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          ) : (
            <span
              onClick={() => handleEdit(subtask)}
              className={`flex-1 cursor-pointer dark:text-white ${
                subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}
            >
              {subtask.text}
            </span>
          )}
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
