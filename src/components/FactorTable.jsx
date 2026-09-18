import React from 'react';

export default function FactorTable({ result }) {
  if (!result) return null;

  const { factors, motherTotal, fatherTotal, grandTotal } = result;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Life Factor Values</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">Factor</th>
              <th className="p-3 font-semibold text-pink-600 dark:text-pink-400 border-b border-gray-200 dark:border-gray-600">Mother</th>
              <th className="p-3 font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-600">Father</th>
              <th className="p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {factors.map((factor, index) => (
              <tr 
                key={factor.name} 
                className={`border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}
              >
                <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{factor.name}</td>
                <td className={`p-3 text-pink-600 dark:text-pink-400 ${factor.mother > factor.father ? 'font-bold' : ''}`}>{factor.mother.toFixed(3)}</td>
                <td className={`p-3 text-blue-600 dark:text-blue-400 ${factor.father > factor.mother ? 'font-bold' : ''}`}>{factor.father.toFixed(3)}</td>
                <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{factor.total.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
              <td className="p-3 text-gray-800 dark:text-white">TOTAL</td>
              <td className="p-3 text-pink-600 dark:text-pink-400">{motherTotal.toFixed(3)}</td>
              <td className="p-3 text-blue-600 dark:text-blue-400">{fatherTotal.toFixed(3)}</td>
              <td className="p-3 text-gray-800 dark:text-white">{grandTotal.toFixed(3)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
