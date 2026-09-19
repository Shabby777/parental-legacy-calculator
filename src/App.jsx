import { useState, useCallback } from 'react';
import DateInput from './components/DateInput';
import FactorTable from './components/FactorTable';
import ChakraLevelsTable from './components/ChakraLevelsTable';
import LevelsTable from './components/LevelsTable';
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Date Input */}
        <section className="flex justify-center">
          <DateInput onDateChange={handleDateChange} selectedDate={selectedDate} />
        </section>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Export Buttons — outside the PDF capture area */}
            <section className="flex justify-center">
              <ExportButtons result={result} selectedDate={selectedDate} />
            </section>

            {/* Printable results section — captured by PDF export */}
            <div id="results-section" className="space-y-8">
              {/* Legacy Summary */}
              <section>
                <LegacySummary result={result} />
              </section>

              {/* 2-Column Tables Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Results Table */}
                <section>
                  <FactorTable result={result} />
                </section>

                {/* Chakra Levels Table */}
                <section>
                  <ChakraLevelsTable result={result} />
                </section>

                <section>
                  <LevelsTable
                    title="AURA LEVELS"
                    // description="Current status is 38.332% of each parental legacy factor; target level is 135% of current status."
                    levels={result.auraLevels}
                    currentTotal={result.auraCurrentTotal}
                    targetTotal={result.auraTargetTotal}
                    gapTotal={result.auraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="POSITIVE KARMIC DEEDS"
                    // description="Current status is 41.878% of the corresponding Chakra and Aura current-status values combined; target level is 135% of current status."
                    levels={result.positiveKarmicDeeds}
                    currentTotal={result.positiveKarmicCurrentTotal}
                    targetTotal={result.positiveKarmicTargetTotal}
                    gapTotal={result.positiveKarmicGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="KARMIC REFINEMENT SECTORS"
                    // description="Current status is 39.178% of the corresponding Chakra and Aura current-status values combined; target level is 135% of current status."
                    levels={result.karmicRefinementSectors}
                    currentTotal={result.karmicRefinementCurrentTotal}
                    targetTotal={result.karmicRefinementTargetTotal}
                    gapTotal={result.karmicRefinementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="KARMIC BALANCING"
                    // description="Current status is the average of the corresponding Chakra and Aura current-status values; target level is 135% of current status."
                    levels={result.karmicBalancing}
                    currentTotal={result.karmicBalancingCurrentTotal}
                    targetTotal={result.karmicBalancingTargetTotal}
                    gapTotal={result.karmicBalancingGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="EARTH (Prithvi) ELEMENT"
                    levels={result.earthElement}
                    currentTotal={result.earthElementCurrentTotal}
                    targetTotal={result.earthElementTargetTotal}
                    gapTotal={result.earthElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="WATER (Jala) ELEMENT"
                    levels={result.waterElement}
                    currentTotal={result.waterElementCurrentTotal}
                    targetTotal={result.waterElementTargetTotal}
                    gapTotal={result.waterElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="FIRE (Agni) ELEMENT"
                    levels={result.fireElement}
                    currentTotal={result.fireElementCurrentTotal}
                    targetTotal={result.fireElementTargetTotal}
                    gapTotal={result.fireElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="AIR (Vayu) ELEMENT"
                    levels={result.airElement}
                    currentTotal={result.airElementCurrentTotal}
                    targetTotal={result.airElementTargetTotal}
                    gapTotal={result.airElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="ETHER (Akasha) ELEMENT"
                    levels={result.etherElement}
                    currentTotal={result.etherElementCurrentTotal}
                    targetTotal={result.etherElementTargetTotal}
                    gapTotal={result.etherElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="TIME (Kala) ELEMENT"
                    levels={result.timeElement}
                    currentTotal={result.timeElementCurrentTotal}
                    targetTotal={result.timeElementTargetTotal}
                    gapTotal={result.timeElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="SOUL (Atman) ELEMENT"
                    levels={result.soulElement}
                    currentTotal={result.soulElementCurrentTotal}
                    targetTotal={result.soulElementTargetTotal}
                    gapTotal={result.soulElementGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="ROOT CHAKRA"
                    levels={result.rootChakra}
                    currentTotal={result.rootChakraCurrentTotal}
                    targetTotal={result.rootChakraTargetTotal}
                    gapTotal={result.rootChakraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="SACRAL CHAKRA"
                    levels={result.sacralChakra}
                    currentTotal={result.sacralChakraCurrentTotal}
                    targetTotal={result.sacralChakraTargetTotal}
                    gapTotal={result.sacralChakraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="SOLAR PLEXUS CHAKRA"
                    levels={result.solarPlexusChakra}
                    currentTotal={result.solarPlexusChakraCurrentTotal}
                    targetTotal={result.solarPlexusChakraTargetTotal}
                    gapTotal={result.solarPlexusChakraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="HEART CHAKRA"
                    levels={result.heartChakra}
                    currentTotal={result.heartChakraCurrentTotal}
                    targetTotal={result.heartChakraTargetTotal}
                    gapTotal={result.heartChakraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="THROAT CHAKRA"
                    levels={result.throatChakra}
                    currentTotal={result.throatChakraCurrentTotal}
                    targetTotal={result.throatChakraTargetTotal}
                    gapTotal={result.throatChakraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="THIRD EYE CHAKRA"
                    levels={result.thirdEyeChakra}
                    currentTotal={result.thirdEyeChakraCurrentTotal}
                    targetTotal={result.thirdEyeChakraTargetTotal}
                    gapTotal={result.thirdEyeChakraGapTotal}
                  />
                </section>

                <section>
                  <LevelsTable
                    title="CROWN CHAKRA"
                    levels={result.crownChakra}
                    currentTotal={result.crownChakraCurrentTotal}
                    targetTotal={result.crownChakraTargetTotal}
                    gapTotal={result.crownChakraGapTotal}
                  />
                </section>

                <section className="lg:col-span-2 lg:max-w-2xl lg:mx-auto w-full">
                  <LevelsTable
                    title="THE FOOD SHEATH"
                    levels={result.foodSheath}
                    currentTotal={result.foodSheathCurrentTotal}
                    targetTotal={result.foodSheathTargetTotal}
                    gapTotal={result.foodSheathGapTotal}
                  />
                </section>
              </div>

              {/* Charts */}
              <section>
                <FactorChart result={result} />
              </section>
            </div>
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
