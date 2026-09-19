import React, { useState } from 'react';
import { saveResult } from '../utils/storage';

export default function ExportButtons({ result, selectedDate }) {
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(null);

  if (!result) return null;

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 16;
      const columns = [margin, 88, 125, 160];
      let y = 20;

      const addText = (text, x, textY, options = {}) => {
        pdf.text(String(text), x, textY, options);
      };

      pdf.setFillColor(67, 56, 202);
      pdf.rect(0, 0, pageWidth, 10, 'F');
      pdf.setTextColor(31, 41, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      addText('Parental Legacy Report', margin, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const date = selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not provided';
      addText(`Date of birth: ${date}`, margin, y);
      addText(`Dominant legacy: ${result.dominantParent}`, pageWidth - margin, y, { align: 'right' });
      y += 12;

      pdf.setFillColor(243, 244, 246);
      pdf.roundedRect(margin, y - 6, pageWidth - margin * 2, 22, 2, 2, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      addText('Mother\'s Legacy', margin + 5, y);
      addText('Father\'s Legacy', pageWidth / 2 + 5, y);
      pdf.setFontSize(17);
      addText(result.motherTotal.toFixed(3), margin + 5, y + 9);
      addText(result.fatherTotal.toFixed(3), pageWidth / 2 + 5, y + 9);
      y += 29;

      pdf.setFontSize(14);
      addText('Life Factor Values', margin, y);
      y += 7;

      pdf.setFillColor(67, 56, 202);
      pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      ['Factor', 'Mother', 'Father', 'Total'].forEach((heading, index) => addText(heading, columns[index], y));
      y += 8;

      pdf.setTextColor(31, 41, 55);
      pdf.setFont('helvetica', 'normal');
      result.factors.forEach((factor, index) => {
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
        }
        addText(factor.name, columns[0], y);
        addText(factor.mother.toFixed(3), columns[1], y);
        addText(factor.father.toFixed(3), columns[2], y);
        addText(factor.total.toFixed(3), columns[3], y);
        y += 8;
      });

      pdf.setFillColor(229, 231, 235);
      pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
      pdf.setFont('helvetica', 'bold');
      addText('TOTAL', columns[0], y);
      addText(result.motherTotal.toFixed(3), columns[1], y);
      addText(result.fatherTotal.toFixed(3), columns[2], y);
      addText(result.grandTotal.toFixed(3), columns[3], y);

      y += 14;
      pdf.setFontSize(14);
      addText('Chakra Levels', margin, y);
      y += 7;

      pdf.setFillColor(109, 40, 217);
      pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      ['Life Factor', 'Current', 'Target', 'Gap'].forEach((heading, index) => addText(heading, columns[index], y));
      y += 8;

      pdf.setTextColor(31, 41, 55);
      pdf.setFont('helvetica', 'normal');
      result.chakraLevels.forEach((chakra, index) => {
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
        }
        addText(chakra.name, columns[0], y);
        addText(chakra.currentStatus.toFixed(3), columns[1], y);
        addText(chakra.targetLevel.toFixed(3), columns[2], y);
        addText(chakra.gapToGoal.toFixed(3), columns[3], y);
        y += 8;
      });

      pdf.setFillColor(229, 231, 235);
      pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
      pdf.setFont('helvetica', 'bold');
      addText('TOTAL', columns[0], y);
      addText(result.chakraCurrentTotal.toFixed(3), columns[1], y);
      addText(result.chakraTargetTotal.toFixed(3), columns[2], y);
      addText(result.chakraGapTotal.toFixed(3), columns[3], y);

      pdf.save('parental-legacy-report.pdf');
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
      const chakraHeaders = '\n\nCHAKRA LEVELS\nLife Factor,Current Status,Target Level,Gap to Goal\n';
      const chakraRows = result.chakraLevels
        .map((chakra) => `"${chakra.name}",${chakra.currentStatus.toFixed(3)},${chakra.targetLevel.toFixed(3)},${chakra.gapToGoal.toFixed(3)}`)
        .join('\n');
      const chakraTotals = `\n"TOTAL",${result.chakraCurrentTotal.toFixed(3)},${result.chakraTargetTotal.toFixed(3)},${result.chakraGapTotal.toFixed(3)}`;
      const csv = BOM + headers + rows + totals + chakraHeaders + chakraRows + chakraTotals;

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
