import React from 'react';
import { List, Star, Calendar, Trash2 } from 'lucide-react';
import type { TodoList } from '../types';

interface SidebarProps {
  lists: TodoList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
}

export default function Sidebar({
  lists,
  activeListId,
  onSelectList,
  onAddList,
  onDeleteList,
}: SidebarProps) {
  const [newList, setNewList] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newList.trim()) {
      onAddList(newList);
      setNewList('');
    }
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r dark:border-gray-700 h-screen">
      <div className="space-y-4">
        <button
          onClick={() => onSelectList('starred')}
          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg ${
            activeListId === 'starred'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
          }`}
        >
          <Star size={20} />
          <span>Starred</span>
        </button>

        <button
          onClick={() => onSelectList('today')}
          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg ${
            activeListId === 'today'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
          }`}
        >
          <Calendar size={20} />
          <span>Today</span>
        </button>

        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">My Lists</h3>
          {lists.map((list) => (
            <div
              key={list.id}
              className={`group flex items-center space-x-2 px-3 py-2 rounded-lg ${
                activeListId === list.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <button
                onClick={() => onSelectList(list.id)}
                className="flex-1 flex items-center space-x-2"
              >
                <List size={20} style={{ color: list.color }} />
                <span>{list.name}</span>
              </button>
              {list.id !== 'default' && (
                <button
                  onClick={() => onDeleteList(list.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="pt-2">
          <input
            type="text"
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            placeholder="Add new list..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </form>
      </div>
    </div>
  );
}