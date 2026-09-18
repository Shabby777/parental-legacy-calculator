import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { saveResult } from '../utils/storage';

export default function ExportButtons({ result, selectedDate }) {
  const [saved, setSaved] = useState(false);

  if (!result) return null;

  const exportPDF = () => {
    const element = document.getElementById('results-section');
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: 'parental-legacy-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const exportCSV = () => {
    const headers = 'Factor,Mother,Father,Total\n';
    const rows = result.factors.map(f => `${f.name},${f.mother},${f.father},${f.total}`).join('\n');
    const totals = `\nTOTAL,${result.motherTotal},${result.fatherTotal},${result.grandTotal}`;
    const csv = headers + rows + totals;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parental-legacy-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    try {
      if (typeof saveResult === 'function') {
        saveResult(result, selectedDate);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save result', e);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-8 justify-center">
      <button 
        onClick={exportPDF}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-colors"
      >
        📄 Export as PDF
      </button>
      <button 
        onClick={exportCSV}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-md transition-colors"
      >
        📊 Export as CSV
      </button>
      <button 
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors w-40 justify-center"
      >
        {saved ? '✅ Saved!' : '💾 Save Result'}
      </button>
    </div>
  );
}
