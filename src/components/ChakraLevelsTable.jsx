import React from 'react';

export default function ChakraLevelsTable({ result }) {
  if (!result) return null;

  const {
    chakraLevels,
    chakraCurrentTotal,
    chakraTargetTotal,
    chakraGapTotal,
  } = result;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">CHAKRA LEVELS</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">Life Factor</th>
              <th className="p-3 font-semibold text-violet-600 dark:text-violet-400 border-b border-gray-200 dark:border-gray-600">Current Status</th>
              <th className="p-3 font-semibold text-emerald-600 dark:text-emerald-400 border-b border-gray-200 dark:border-gray-600">Target Level</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">Gap to Goal</th>
            </tr>
          </thead>
          <tbody>
            {chakraLevels.map((chakra, index) => (
              <tr
                key={chakra.name}
                className={`border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}
              >
                <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{chakra.name}</td>
                <td className="p-3 text-violet-600 dark:text-violet-400">{chakra.currentStatus.toFixed(3)}</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400">{chakra.targetLevel.toFixed(3)}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{chakra.gapToGoal.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
              <td className="p-3 text-gray-800 dark:text-white">TOTAL</td>
              <td className="p-3 text-violet-600 dark:text-violet-400">{chakraCurrentTotal.toFixed(3)}</td>
              <td className="p-3 text-emerald-600 dark:text-emerald-400">{chakraTargetTotal.toFixed(3)}</td>
              <td className="p-3 text-gray-800 dark:text-white">{chakraGapTotal.toFixed(3)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
