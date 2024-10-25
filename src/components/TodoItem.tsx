import React, { useState } from 'react';
import { 
  Star, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import SubTaskList from './SubTaskList';
import TodoNotes from './TodoNotes';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleSubmit = () => {
    if (text.trim()) {
      onUpdate({ ...todo, text });
      setIsEditing(false);
    }
  };

  const handleToggleComplete = () => {
    onUpdate({
      ...todo,
      completed: !todo.completed
    });
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedTodo = {
      ...todo,
      starred: !todo.starred,
      updatedAt: new Date().toISOString()
    };
    onUpdate(updatedTodo);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...todo, dueDate: e.target.value });
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleToggleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotes(!showNotes);
  };

  const handleSubtaskAdd = (todoId: string, text: string) => {
    const newSubtask = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    onUpdate({
      ...todo,
      subtasks: [...(todo.subtasks || []), newSubtask]
    });
  };

  const handleSubtaskToggle = (todoId: string, subtaskId: string) => {
    const updatedSubtasks = todo.subtasks.map(st => {
      if (st.id === subtaskId) {
        return { ...st, completed: !st.completed };
      }
      return st;
    });
    onUpdate({ ...todo, subtasks: updatedSubtasks });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="h-5 w-5 rounded border-gray-300"
        />

        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="flex-1 cursor-pointer"
          >
            <span className={`dark:text-white ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
              {todo.text}
            </span>
          </div>
        )}

        <input
          type="date"
          value={todo.dueDate || ''}
          onChange={handleDueDateChange}
          className="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          onClick={handleStarClick}
          type="button"
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            todo.starred ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          <Star size={20} />
        </button>

        <button
          onClick={handleToggleExpand}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        <button
          onClick={handleToggleNotes}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        >
          <MessageSquare size={20} />
        </button>

        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {expanded && (
        <div className="px-12 pb-4">
          <SubTaskList
            todoId={todo.id}
            subtasks={todo.subtasks || []}
            onAdd={handleSubtaskAdd}
            onToggle={handleSubtaskToggle}
            onDelete={(todoId, subtaskId) => {
              const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);
              onUpdate({ ...todo, subtasks: updatedSubtasks });
            }}
            onUpdate={(todoId, subtaskId, text) => {
              const updatedSubtasks = todo.subtasks.map(st =>
                st.id === subtaskId ? { ...st, text } : st
              );
              onUpdate({ ...todo, subtasks: updatedSubtasks });
            }}
          />
        </div>
      )}

      {showNotes && (
        <TodoNotes
          todoId={todo.id}
          notes={todo.notes || ''}
          onUpdate={(todoId, notes) => {
            onUpdate({ ...todo, notes });
          }}
        />
      )}
    </div>
  );
}
