/**
 * Core calculation logic for the Parental Legacy & Life Factors Calculator.
 * 
 * Uses a seeded PRNG to ensure deterministic results for any given DOB.
 * Mother + Father values always sum to exactly 100.
 */

// Life factor definitions with min/max total ranges
export const FACTORS = [
  { name: 'Genetic Inheritance', min: 9.333, max: 10.777 },
  { name: 'Constitutional Vitality', min: 8.111, max: 9.111 },
  { name: 'Mental Patterns', min: 6.111, max: 7.111 },
  { name: 'Intellectual Capacity', min: 6.333, max: 6.999 },
  { name: 'Emotional Foundation', min: 7.111, max: 7.999 },
  { name: 'Spiritual Lineage', min: 5.011, max: 6.011 },
  { name: 'Soul Connections', min: 5.111, max: 6.222 },
];

/**
 * Seeded pseudo-random number generator (Lehmer / Park-Miller).
 * Returns a function that produces deterministic values in (0, 1).
 */
function seededRandom(seed) {
  let s = Math.abs(seed) || 1;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Round a number to n decimal places.
 */
function round(value, decimals = 3) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculate parental legacy factors for a given Date of Birth.
 *
 * @param {Date|string} dateOfBirth - A Date object or ISO date string.
 * @returns {{ factors, motherTotal, fatherTotal, grandTotal, dominantParent }}
 */
export function calculateFactors(dateOfBirth) {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;

  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();

  // Odd day → Mother higher; Even day → Father higher
  const isMotherDominant = day % 2 !== 0;

  // Create deterministic seed from full DOB
  const seed = day * 1000000 + month * 10000 + year;
  const rng = seededRandom(seed);

  // ─── Step 1: Generate raw totals for each factor within [min, max] ───
  const rawTotals = FACTORS.map((factor) => {
    const t = rng();
    return factor.min + t * (factor.max - factor.min);
  });

  // ─── Step 2: Normalize totals so they sum to exactly 100 ───
  const rawSum = rawTotals.reduce((a, b) => a + b, 0);
  const normalizedTotals = rawTotals.map((val) => (val / rawSum) * 100);

  // ─── Step 3: Clamp each total to [min, max] and re-distribute remainder ───
  // After proportional scaling, values might technically fall outside their
  // original narrow ranges. We use an iterative clamping approach.
  const totals = clampAndRedistribute(normalizedTotals, FACTORS);

  // ─── Step 4: Split each total into Mother & Father values ───
  const factors = FACTORS.map((factor, i) => {
    const total = totals[i];

    // Dominant parent gets between 52–60% of the total
    const dominantShare = 0.52 + rng() * 0.08;

    let mother, father;
    if (isMotherDominant) {
      mother = round(total * dominantShare);
      father = round(total - mother);
    } else {
      father = round(total * dominantShare);
      mother = round(total - father);
    }

    return {
      name: factor.name,
      mother,
      father,
      total: round(mother + father),
    };
  });

  // ─── Step 5: Compute totals ───
  let motherTotal = factors.reduce((sum, f) => sum + f.mother, 0);
  let fatherTotal = factors.reduce((sum, f) => sum + f.father, 0);

  // Fine-tune to ensure exact sum = 100 (fix floating-point drift)
  const drift = round(100 - (motherTotal + fatherTotal), 3);
  if (drift !== 0) {
    // Apply drift correction to the last factor's dominant parent
    const lastFactor = factors[factors.length - 1];
    if (isMotherDominant) {
      lastFactor.mother = round(lastFactor.mother + drift);
    } else {
      lastFactor.father = round(lastFactor.father + drift);
    }
    lastFactor.total = round(lastFactor.mother + lastFactor.father);
  }

  motherTotal = round(factors.reduce((sum, f) => sum + f.mother, 0));
  fatherTotal = round(factors.reduce((sum, f) => sum + f.father, 0));

  const dominantParent = motherTotal >= fatherTotal ? 'Mother' : 'Father';

  return {
    factors,
    motherTotal,
    fatherTotal,
    grandTotal: round(motherTotal + fatherTotal),
    dominantParent,
    dateOfBirth: dob.toISOString(),
    day,
  };
}

/**
 * Iteratively clamp values to their [min, max] ranges while
 * keeping the overall sum at 100.
 */
function clampAndRedistribute(values, factors) {
  const result = [...values];
  const n = result.length;

  for (let iter = 0; iter < 10; iter++) {
    let excess = 0;
    let freeIndices = [];

    for (let i = 0; i < n; i++) {
      if (result[i] < factors[i].min) {
        excess += result[i] - factors[i].min; // negative
        result[i] = factors[i].min;
      } else if (result[i] > factors[i].max) {
        excess += result[i] - factors[i].max; // positive
        result[i] = factors[i].max;
      } else {
        freeIndices.push(i);
      }
    }

    if (Math.abs(excess) < 0.0001 || freeIndices.length === 0) break;

    // Distribute excess evenly among unclamped values
    const perItem = excess / freeIndices.length;
    for (const idx of freeIndices) {
      result[idx] += perItem;
    }
  }

  // Final rounding
  return result.map((v) => round(v));
}
