import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Star, 
  Trash2, 
  GripVertical, 
  ChevronRight, 
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onUpdate({ ...todo, text });
      setIsEditing(false);
    }
  };

  const handleAddSubtask = (todoId: string, text: string) => {
    onUpdate({
      ...todo,
      subtasks: [
        ...todo.subtasks,
        { id: Date.now().toString(), text, completed: false }
      ]
    });
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    onUpdate({
      ...todo,
      subtasks: todo.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    });
  };

  const handleDeleteSubtask = (todoId: string, subtaskId: string) => {
    onUpdate({
      ...todo,
      subtasks: todo.subtasks.filter(st => st.id !== subtaskId)
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="text-gray-400" />
        </div>
        
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
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
          onChange={(e) => onUpdate({ ...todo, dueDate: e.target.value })}
          className="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          onClick={() => onUpdate({ ...todo, starred: !todo.starred })}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            todo.starred ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          <Star size={20} />
        </button>

        <button
          onClick={() => setShowNotes(!showNotes)}
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

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        >
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="px-12 pb-4">
          <SubTaskList
            todoId={todo.id}
            subtasks={todo.subtasks}
            onAdd={handleAddSubtask}
            onToggle={handleToggleSubtask}
            onDelete={handleDeleteSubtask}
          />
        </div>
      )}

      {showNotes && (
        <TodoNotes
          todoId={todo.id}
          notes={todo.notes || ''}
          onUpdate={(todoId, notes) => onUpdate({ ...todo, notes })}
        />
      )}
    </div>
  );
}