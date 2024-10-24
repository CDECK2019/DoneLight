import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import TodoList from './components/TodoList';
import Sidebar from './components/Sidebar';
import AuthForm from './components/AuthForm';
import { Moon, Sun, LogOut, Lightbulb } from 'lucide-react';
import useTodos from './hooks/useTodos';
import useAuth from './hooks/useAuth';
import type { Todo, List } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [activeListId, setActiveListId] = useState<string>('default');
  const { currentUser, signOut } = useAuth();
  const { todos, lists, addTodo, updateTodo, deleteTodo, addList, deleteList } = useTodos();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Toaster position="bottom-right" />
      
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {currentUser ? (
          <>
            <Sidebar
              lists={lists}
              activeListId={activeListId}
              onSelectList={setActiveListId}
              onAddList={(name) => addList(name, currentUser.id)}
              onDeleteList={deleteList}
            />

            <div className="flex-1 flex flex-col">
              <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="text-yellow-500 h-6 w-6" />
                    <span className="text-xl font-semibold text-yellow-500">DoneLight</span>
                  </div>
                  <h2 className="text-lg font-medium dark:text-white">
                    {lists.find(l => l.id === activeListId)?.name || 'All Tasks'}
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
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
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-4">
                <TodoList
                  todos={todos.filter(todo => 
                    activeListId === 'default' ? true : todo.listId === activeListId
                  )}
                  onAdd={(text) => addTodo(text, activeListId, currentUser.id)}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              </main>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Lightbulb className="text-yellow-500 h-10 w-10" />
                <h1 className="text-4xl font-bold text-yellow-500">DoneLight</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Effortless task management for modern minds</p>
            </div>
            <AuthForm />
          </div>
        )}
      </div>
    </div>
  );
}