import React from 'react';

export default function LegacySummary({ result }) {
  if (!result) return null;

  const { motherTotal, fatherTotal, grandTotal, dominantParent } = result;

  const motherPercent = ((motherTotal / grandTotal) * 100).toFixed(1);
  const fatherPercent = ((fatherTotal / grandTotal) * 100).toFixed(1);
  
  const isMotherDominant = dominantParent === 'Mother';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 border-t-4 border-indigo-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
          {isMotherDominant ? '👩' : '👨'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Legacy Summary</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Based on your birth day, {dominantParent} values are dominant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg border-2 ${isMotherDominant ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-700'}`}>
          <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-1">Mother's Legacy</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {motherTotal.toFixed(3)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({motherPercent}%)</span>
          </p>
        </div>
        <div className={`p-4 rounded-lg border-2 ${!isMotherDominant ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-700'}`}>
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">Father's Legacy</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {fatherTotal.toFixed(3)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({fatherPercent}%)</span>
          </p>
        </div>
      </div>

      <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-pink-500 transition-all duration-1000" 
          style={{ width: `${motherPercent}%` }}
        />
        <div 
          className="h-full bg-blue-500 transition-all duration-1000" 
          style={{ width: `${fatherPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm font-medium">
        <span className="text-pink-600 dark:text-pink-400">{motherPercent}%</span>
        <span className="text-blue-600 dark:text-blue-400">{fatherPercent}%</span>
      </div>
    </div>
  );
}
