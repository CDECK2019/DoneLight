import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  const addTodo = (text: string, listId: string, userId: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      starred: false,
      subtasks: [],
      listId,
      order: todos.length,
      userId,
      dueDate: '',
      notes: '',
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setTodos(prevTodos => {
      const newTodos = prevTodos.map(todo => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      
      queueMicrotask(() => {
        localStorage.setItem('todos', JSON.stringify(newTodos));
      });
      
      return newTodos;
    });
  }, []);

  const deleteTodo = (todoId: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
  };

  const addList = (name: string, userId: string) => {
    const newList: List = {
      id: Date.now().toString(),
      name,
      userId
    };
    setLists(prevLists => [...prevLists, newList]);
  };

  const deleteList = (listId: string) => {
    if (listId === 'default') return;
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
    setTodos(prevTodos => prevTodos.filter(todo => todo.listId !== listId));
  };

  const editList = (listId: string, newName: string) => {
    const updatedLists = lists.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    );
    setLists(updatedLists);
    localStorage.setItem('lists', JSON.stringify(updatedLists));
  };

  const getFilteredTodos = (listId: string) => {
    console.log('Filtering todos for list:', listId);
    const filtered = todos.filter(todo => {
      if (listId === 'starred') {
        console.log('Checking starred todo:', todo.id, todo.starred);
        return todo.starred;
      }
      if (listId === 'today') {
        const today = new Date().toISOString().split('T')[0];
        console.log('Checking today\'s todo:', todo.id, todo.dueDate, today);
        return todo.dueDate === today;
      }
      return listId === 'default' ? true : todo.listId === listId;
    }).sort((a, b) => a.order - b.order);
    console.log('Filtered todos:', filtered);
    return filtered;
  };

  return {
    todos,
    lists,
    addTodo,
    updateTodo,
    deleteTodo,
    addList,
    deleteList,
    editList,
    getFilteredTodos
  };
}
