import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';
import useTodos from './hooks/useTodos';
import { Toaster } from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';
import type { List } from './types';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { todos, lists, addTodo, updateTodo, deleteTodo, addList, deleteList, editList } = useTodos();
  const [activeListId, setActiveListId] = useState('default');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Handle auth state changes
  useEffect(() => {
    console.log('Auth state changed:', { currentUser, isLoading });
    if (currentUser && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [currentUser, isLoading, navigate, location]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getFilteredTodos = useCallback(() => {
    return todos.filter(todo => {
      switch (activeListId) {
        case 'starred':
          return todo.starred;
        case 'today':
          const today = new Date().toISOString().split('T')[0];
          return todo.dueDate === today;
        default:
          return todo.listId === activeListId;
      }
    });
  }, [todos, activeListId]);

  const filteredTodos = useMemo(() => getFilteredTodos(), [getFilteredTodos]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="bottom-right" />
      <Routes>
        <Route 
          path="/" 
          element={
            !currentUser ? (
              <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-md px-4">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-yellow-500">DoneLight</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Effortless Task Management
                    </p>
                  </div>
                  <AuthForm />
                </div>
              </div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Sidebar
                lists={lists}
                activeListId={activeListId}
                onSelectList={setActiveListId}
                onAddList={(name) => addList(name, currentUser?.id || 'default')}
                onDeleteList={deleteList}
                onEditList={editList}
              />
              <div className="flex-1 flex flex-col">
                <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-4xl font-bold text-yellow-500">DoneLight</h1>
                    </div>
                    <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {activeListId === 'starred' ? 'Starred Tasks' :
                       activeListId === 'today' ? 'Today\'s Tasks' :
                       lists.find(l => l.id === activeListId)?.name || 'My Tasks'}
                    </h2>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </header>
                <main className="flex-1 overflow-auto p-4">
                  <TodoList
                    todos={filteredTodos}
                    onAdd={(text) => addTodo(text, activeListId, currentUser?.id || 'default')}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    activeListId={activeListId}
                  />
                </main>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
