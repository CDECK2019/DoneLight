import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoItem } from './TodoItem';
import { Plus } from 'lucide-react';
import type { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onTodosChange: (todos: Todo[]) => void;
  listId?: string;
}

export default function TodoList({ todos, onTodosChange, listId = 'default' }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      onTodosChange(arrayMove(todos, oldIndex, newIndex));
    }
  };

  const handleUpdate = (updatedTodo: Todo) => {
    const newTodos = todos.map((todo) => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    onTodosChange(newTodos);
  };

  const handleDelete = (todoId: string) => {
    onTodosChange(todos.filter((todo) => todo.id !== todoId));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText,
        completed: false,
        starred: false,
        subtasks: [],
        listId: listId,
        order: todos.length,
        userId: 'default',
        dueDate: '',
        notes: '',
      };
      onTodosChange([...todos, newTodo]);
      setNewTodoText('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdate}
                onDelete={() => handleDelete(todo.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}