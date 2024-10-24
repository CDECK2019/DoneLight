import { useState, useEffect } from 'react';
import type { Todo, List } from '../types';

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [lists, setLists] = useState<List[]>(() => {
    const saved = localStorage.getItem('lists');
    return saved ? JSON.parse(saved) : [
      { id: 'default', name: 'My Tasks', userId: 'default' }
    ];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  const addList = (name: string, userId: string) => {
    const newList: List = {
      id: Date.now().toString(),
      name,
      userId
    };
    setLists([...lists, newList]);
  };

  const deleteList = (listId: string) => {
    if (listId === 'default') return;
    setLists(lists.filter(list => list.id !== listId));
    setTodos(todos.filter(todo => todo.listId !== listId));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return {
    todos,
    lists,
    darkMode,
    updateTodos,
    addList,
    deleteList,
    toggleDarkMode
  };
}