import { useState, useCallback } from 'react';
import DateInput from './components/DateInput';
import FactorTable from './components/FactorTable';
import FactorChart from './components/FactorChart';
import LegacySummary from './components/LegacySummary';
import ExportButtons from './components/ExportButtons';
import ThemeToggle from './components/ThemeToggle';
import { calculateFactors } from './utils/calculator';
import useTheme from './hooks/useTheme';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [result, setResult] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    if (date) {
      const calcResult = calculateFactors(date);
      setResult(calcResult);
    } else {
      setResult(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              Parental Legacy Calculator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Discover your life factor values based on your date of birth
            </p>
          </div>
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Date Input */}
        <section className="flex justify-center">
          <DateInput onDateChange={handleDateChange} selectedDate={selectedDate} />
        </section>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Legacy Summary */}
            <section>
              <LegacySummary result={result} />
            </section>

            {/* Export Buttons */}
            <section className="flex justify-center">
              <ExportButtons result={result} selectedDate={selectedDate} />
            </section>

            {/* Results Table */}
            <section>
              <FactorTable result={result} />
            </section>

            {/* Charts */}
            <section>
              <FactorChart result={result} />
            </section>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              Enter your date of birth to discover your parental legacy
            </h2>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Your life factor values will be calculated automatically
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>Parental Legacy & Life Factors Calculator • Built with React & Tailwind CSS</p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
