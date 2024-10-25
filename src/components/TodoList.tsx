import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Plus } from 'lucide-react';
import type { Todo } from '../types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

interface TodoListProps {
  todos: Todo[];
  onAdd: (text: string) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
  activeListId: string;
}

export default function TodoList({ 
  todos, 
  onAdd, 
  onUpdate, 
  onDelete,
  activeListId 
}: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAdd(newTodoText);
      setNewTodoText('');
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id);
      const newIndex = todos.findIndex(todo => todo.id === over.id);
      
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      
      // Update order for all todos
      newTodos.forEach((todo, index) => {
        onUpdate({ ...todo, order: index });
      });
    }
  };

  const sortedTodos = [...todos].sort((a, b) => a.order - b.order);

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
        <SortableContext items={sortedTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={() => onDelete(todo.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
