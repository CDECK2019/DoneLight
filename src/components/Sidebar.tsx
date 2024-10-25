import React, { useState } from 'react';
import { List as ListIcon, Star, Calendar, Trash2, Edit2 } from 'lucide-react';
import type { List } from '../types';

interface SidebarProps {
  lists: List[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onEditList: (id: string, newName: string) => void;
}

export default function Sidebar({
  lists,
  activeListId,
  onSelectList,
  onAddList,
  onDeleteList,
  onEditList,
}: SidebarProps) {
  const [newList, setNewList] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newList.trim()) {
      onAddList(newList);
      setNewList('');
    }
  };

  const handleEditSubmit = (e: React.FormEvent, listId: string) => {
    e.preventDefault();
    if (editingName.trim()) {
      onEditList(listId, editingName);
      setEditingListId(null);
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
              {editingListId === list.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, list.id)} className="flex-1 flex items-center">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    autoFocus
                  />
                  <button type="submit" className="ml-2 p-1 text-green-500 hover:bg-green-100 rounded">
                    <Edit2 size={16} />
                  </button>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => onSelectList(list.id)}
                    className="flex-1 flex items-center space-x-2"
                  >
                    <ListIcon size={20} style={{ color: list.color }} />
                    <span>{list.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingListId(list.id);
                      setEditingName(list.name);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500"
                  >
                    <Edit2 size={16} />
                  </button>
                  {list.id !== 'default' && (
                    <button
                      onClick={() => onDeleteList(list.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </>
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
