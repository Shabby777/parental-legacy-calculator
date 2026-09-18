# Parental Legacy & Life Factors Calculator

A web application that calculates parental legacy and life factor values based on a user's Date of Birth. Built with React.js and Tailwind CSS.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)

## 🔮 Overview

The **Parental Legacy Calculator** takes a user's Date of Birth and automatically generates 7 life factor values, split between Mother and Father contributions. The values are deterministic — the same DOB always produces the same results.

### How It Works

- **Odd Birth Days** (1, 3, 5, ... 31): Mother values are higher
- **Even Birth Days** (2, 4, 6, ... 30): Father values are higher
- Each factor has a Mother value + Father value = Total
- **Grand Total always equals 100**

### Life Factors

| Factor | Min | Max |
|---|---|---|
| Genetic Inheritance | 9.333 | 10.777 |
| Constitutional Vitality | 8.111 | 9.111 |
| Mental Patterns | 6.111 | 7.111 |
| Intellectual Capacity | 6.333 | 6.999 |
| Emotional Foundation | 7.111 | 7.999 |
| Spiritual Lineage | 5.011 | 6.011 |
| Soul Connections | 5.111 | 6.222 |

## ✨ Features

### Core Features
- ✅ Date of Birth input with validation (no future dates)
- ✅ Automatic calculation on date selection
- ✅ Structured display of all factor values (Mother, Father, Total)
- ✅ Grand totals (Mother Total + Father Total = 100)
- ✅ Parental legacy indicator (which parent has higher values)
- ✅ Visual charts (Bar chart + Pie chart) using Recharts
- ✅ Fully responsive design (desktop & mobile)

### Bonus Features
- 🌗 Dark / Light mode toggle (persisted to localStorage)
- 📄 Export results as PDF
- 📊 Export results as CSV
- 💾 Save results to localStorage (view history)

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd parental-legacy-calculator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI library (functional components + hooks) |
| [Vite 6](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS framework |
| [Recharts](https://recharts.org) | Charting library |
| [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) | PDF export |
| [date-fns](https://date-fns.org) | Date utilities |

## 📁 Project Structure

```
src/
├── components/
│   ├── DateInput.jsx          # DOB picker with validation
│   ├── FactorTable.jsx        # Results table
│   ├── FactorChart.jsx        # Bar & Pie charts
│   ├── LegacySummary.jsx      # Parental legacy summary
│   ├── ExportButtons.jsx      # PDF, CSV export & save
│   └── ThemeToggle.jsx        # Dark/Light mode toggle
├── utils/
│   ├── calculator.js          # Core calculation logic
│   └── storage.js             # localStorage utilities
├── hooks/
│   └── useTheme.js            # Dark/Light mode hook
├── App.jsx                    # Main application
├── main.jsx                   # Entry point
└── index.css                  # Tailwind imports & custom styles
```

## 📝 Calculation Logic

1. Extract the **day of the month** from the DOB
2. Determine the **dominant parent** (odd day → Mother, even day → Father)
3. Use a **seeded pseudo-random generator** (based on full DOB) for deterministic results
4. Generate each factor's **total value** within its defined [min, max] range
5. **Normalize** all totals so they sum to exactly 100
6. **Split** each total into Mother & Father values (dominant parent gets higher share)
7. Apply final adjustments to ensure **Mother Total + Father Total = 100**

## 📄 License

This project was built as an assessment task.
