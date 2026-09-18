import React, { useState } from 'react';
import { saveResult } from '../utils/storage';

export default function ExportButtons({ result, selectedDate }) {
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(null);

  if (!result) return null;

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      // Dynamic import to avoid CJS/ESM interop issues
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = document.getElementById('results-section');
      if (!element) {
        console.error('PDF export: #results-section element not found');
        setExporting(null);
        return;
      }

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'parental-legacy-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF export failed. Please check the console for details.');
    } finally {
      setExporting(null);
    }
  };

  const exportCSV = () => {
    setExporting('csv');
    try {
      const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
      const headers = 'Factor,Mother,Father,Total\n';
      const rows = result.factors
        .map((f) => `"${f.name}",${f.mother.toFixed(3)},${f.father.toFixed(3)},${f.total.toFixed(3)}`)
        .join('\n');
      const totals = `\n"TOTAL",${result.motherTotal.toFixed(3)},${result.fatherTotal.toFixed(3)},${result.grandTotal.toFixed(3)}`;
      const csv = BOM + headers + rows + totals;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'parental-legacy-report.csv';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Cleanup after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (e) {
      console.error('CSV export failed:', e);
      alert('CSV export failed. Please check the console for details.');
    } finally {
      setExporting(null);
    }
  };

  const handleSave = () => {
    try {
      saveResult(result, selectedDate);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save result:', e);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={exportPDF}
        disabled={exporting === 'pdf'}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium shadow-md transition-colors cursor-pointer disabled:cursor-wait"
      >
        {exporting === 'pdf' ? (
          <>⏳ Generating PDF...</>
        ) : (
          <>📄 Export as PDF</>
        )}
      </button>
      <button
        onClick={exportCSV}
        disabled={exporting === 'csv'}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium shadow-md transition-colors cursor-pointer disabled:cursor-wait"
      >
        {exporting === 'csv' ? (
          <>⏳ Generating CSV...</>
        ) : (
          <>📊 Export as CSV</>
        )}
      </button>
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors w-40 justify-center cursor-pointer"
      >
        {saved ? '✅ Saved!' : '💾 Save Result'}
      </button>
    </div>
  );
}
