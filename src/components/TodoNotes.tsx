import React from 'react';

interface TodoNotesProps {
  todoId: string;
  notes: string;
  onUpdate: (todoId: string, notes: string) => void;
}

export default function TodoNotes({ todoId, notes, onUpdate }: TodoNotesProps) {
  return (
    <div className="px-4 pb-4">
      <textarea
        value={notes}
        onChange={(e) => onUpdate(todoId, e.target.value)}
        placeholder="Add notes..."
        className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={3}
      />
    </div>
  );
}