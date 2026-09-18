import React from 'react';
import { format, parseISO } from 'date-fns';

export default function DateInput({ onDateChange, selectedDate }) {
  const maxDate = new Date().toISOString().split('T')[0];

  let formattedDate = '';
  let dayMessage = '';
  
  if (selectedDate) {
    const dateObj = typeof selectedDate === 'string' ? parseISO(selectedDate) : selectedDate;
    formattedDate = format(dateObj, 'do MMMM yyyy');
    const dayOfMonth = dateObj.getDate();
    const isEven = dayOfMonth % 2 === 0;
    dayMessage = isEven 
      ? `Even day (${dayOfMonth}): Father values will be higher.` 
      : `Odd day (${dayOfMonth}): Mother values will be higher.`;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Enter Your Date of Birth</h2>
      <input
        type="date"
        max={maxDate}
        onChange={(e) => onDateChange(e.target.value)}
        value={selectedDate || ''}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      {selectedDate && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-750 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Selected Date:</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{formattedDate}</p>
          <p className="text-sm mt-2 text-indigo-600 dark:text-indigo-400 font-medium">{dayMessage}</p>
        </div>
      )}
    </div>
  );
}
