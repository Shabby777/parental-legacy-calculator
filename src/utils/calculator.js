/**
 * Core calculation logic for the Parental Legacy & Life Factors Calculator.
 *
 * Uses a seeded PRNG to ensure deterministic results for any given DOB.
 * Sum of all Mother values + Sum of all Father values = 100.
 *
 * The min/max ranges define the bounds for EACH individual parent value
 * (i.e., both Mother and Father values fall within [min, max] for that factor).
 */

// Life factor definitions with min/max for each parent's value
export const FACTORS = [
  { name: 'Genetic Inheritance', min: 9.333, max: 10.777 },
  { name: 'Constitutional Vitality', min: 8.111, max: 9.111 },
  { name: 'Mental Patterns', min: 6.111, max: 7.111 },
  { name: 'Intellectual Capacity', min: 6.333, max: 6.999 },
  { name: 'Emotional Foundation', min: 7.111, max: 7.999 },
  { name: 'Spiritual Lineage', min: 5.011, max: 6.011 },
  { name: 'Soul Connections', min: 5.111, max: 6.222 },
];

// Chakra levels use the corresponding parental-legacy factor total.
// Per the reference workbook: current status is 40% of the factor total,
// target level is 135% of current status, and the remaining amount is the gap.
export const CHAKRAS = [
  'Root Chakra Stability',
  'Sacral Chakra Creativity',
  'Solar Plexus Power',
  'Heart Chakra Compassion',
  'Throat Chakra Expression',
  'Third Eye Intuition',
  'Crown Connection',
];

export const AURAS = [
  'Physical Aura',
  'Vital Energy Field',
  'Mental-Emotional Field',
  'Intuitive Wisdom Field',
  'Bliss Consciousness Field',
  'Celestial Resonance Field',
  'Universal Harmony Field',
];

export const POSITIVE_KARMIC_DEEDS = [
  'Harmonious Relationships',
  'Personal Evolution',
  'Mental Clarity',
  'Abundance Flow',
  'Spiritual Alignment',
  'Environmental Harmony',
  'Truth Recognition',
];

export const KARMIC_REFINEMENT_SECTORS = [
  'Anger Management',
  'Mental Flexibility',
  'Truthfulness',
  'Financial Ethics',
  'Mental Peace',
  'Physical Care',
  'Spiritual Connection',
];

export const KARMIC_BALANCING = [
  'Removing Curses',
  'Enhancing Blessings',
  'Workplace Transformation',
  'Avoiding Negativity',
  'Maintaining Virtues',
  'Positive Affirmations',
  'Karmic Corrections',
];

export const EARTH_ELEMENT_FACTORS = [
  'Stability',
  'Structure',
  'Nourishment',
  'Weight',
  'Fertility',
  'Patience',
  'Manifestation',
];

export const WATER_ELEMENT_FACTORS = [
  'Fluidity',
  'Emotion',
  'Cohesion',
  'Memory',
  'Purification',
  'Intuition',
  'Surrender',
];

export const FIRE_ELEMENT_FACTORS = [
  'Digestion',
  'Transformation',
  'Illumination',
  'Vitality',
  'Aspiration',
  'Willpower',
  'Purification',
];

export const AIR_ELEMENT_FACTORS = [
  'Movement',
  'Breath',
  'Communication',
  'Connection',
  'Freedom',
  'Cognition',
  'Transmission',
];

export const ETHER_ELEMENT_FACTORS = [
  'Space',
  'Stillness',
  'Receptivity',
  'Sound',
  'Perception',
  'Unity',
  'Potential',
];

export const TIME_ELEMENT_FACTORS = [
  'Sequence',
  'Rhythm',
  'Change',
  'Timing',
  'Duration',
  'Memory',
  'Eternity',
];

export const SOUL_ELEMENT_FACTORS = [
  'Awareness',
  'Witness',
  'Identity',
  'Freedom',
  'Bliss',
  'Connection',
  'Purpose',
];

export const ROOT_CHAKRA_FACTORS = [
  'Survival',
  'Grounding',
  'Security',
  'Family',
  'Abundance',
  'Health',
  'Presence',
];

// Sum of all minimums = 47.121, sum of all maximums = 54.230
// So Mother total ranges from ~47.1 to ~54.2, and same for Father.
// Together Mother + Father can range from ~94.2 to ~108.5.
// We need Mother + Father = 100.

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

  // ─── Step 1: Generate raw Mother and Father values within [min, max] ───
  const rawMother = FACTORS.map((f) => f.min + rng() * (f.max - f.min));
  const rawFather = FACTORS.map((f) => f.min + rng() * (f.max - f.min));

  // ─── Step 2: Ensure dominant parent has higher values per factor ───
  const mother = [];
  const father = [];
  for (let i = 0; i < FACTORS.length; i++) {
    if (isMotherDominant) {
      // Mother should be >= Father for each factor
      mother.push(Math.max(rawMother[i], rawFather[i]));
      father.push(Math.min(rawMother[i], rawFather[i]));
    } else {
      // Father should be >= Mother for each factor
      father.push(Math.max(rawMother[i], rawFather[i]));
      mother.push(Math.min(rawMother[i], rawFather[i]));
    }
  }

  // ─── Step 3: Normalize so Mother total + Father total = 100 ───
  const allValues = [...mother, ...father];
  const rawGrandTotal = allValues.reduce((a, b) => a + b, 0);
  const scale = 100 / rawGrandTotal;

  // Scale all values
  let scaledMother = mother.map((v) => v * scale);
  let scaledFather = father.map((v) => v * scale);

  // ─── Step 4: Clamp values to [min, max] and iteratively adjust ───
  // After scaling, some values might fall outside bounds.
  // We iteratively clamp and redistribute.
  for (let iter = 0; iter < 20; iter++) {
    let excess = 0;
    let freeCountM = 0;
    let freeCountF = 0;

    // Clamp Mother values
    for (let i = 0; i < FACTORS.length; i++) {
      if (scaledMother[i] < FACTORS[i].min) {
        excess += FACTORS[i].min - scaledMother[i];
        scaledMother[i] = FACTORS[i].min;
      } else if (scaledMother[i] > FACTORS[i].max) {
        excess -= scaledMother[i] - FACTORS[i].max;
        scaledMother[i] = FACTORS[i].max;
      } else {
        freeCountM++;
      }
    }

    // Clamp Father values
    for (let i = 0; i < FACTORS.length; i++) {
      if (scaledFather[i] < FACTORS[i].min) {
        excess += FACTORS[i].min - scaledFather[i];
        scaledFather[i] = FACTORS[i].min;
      } else if (scaledFather[i] > FACTORS[i].max) {
        excess -= scaledFather[i] - FACTORS[i].max;
        scaledFather[i] = FACTORS[i].max;
      } else {
        freeCountF++;
      }
    }

    if (Math.abs(excess) < 0.0001) break;

    const freeCount = freeCountM + freeCountF;
    if (freeCount === 0) break;

    const perItem = -excess / freeCount;

    // Distribute to unclamped values
    for (let i = 0; i < FACTORS.length; i++) {
      if (scaledMother[i] > FACTORS[i].min && scaledMother[i] < FACTORS[i].max) {
        scaledMother[i] += perItem;
      }
    }
    for (let i = 0; i < FACTORS.length; i++) {
      if (scaledFather[i] > FACTORS[i].min && scaledFather[i] < FACTORS[i].max) {
        scaledFather[i] += perItem;
      }
    }
  }

  // ─── Step 5: Round and build result ───
  const factors = FACTORS.map((f, i) => {
    const m = round(scaledMother[i]);
    const fa = round(scaledFather[i]);
    return {
      name: f.name,
      mother: m,
      father: fa,
      total: round(m + fa),
    };
  });

  let motherTotal = round(factors.reduce((sum, f) => sum + f.mother, 0));
  let fatherTotal = round(factors.reduce((sum, f) => sum + f.father, 0));

  // Fine-tune to ensure exact sum = 100 (fix floating-point drift)
  const drift = round(100 - (motherTotal + fatherTotal), 3);
  if (drift !== 0) {
    const lastFactor = factors[factors.length - 1];
    if (isMotherDominant) {
      lastFactor.mother = round(lastFactor.mother + drift);
    } else {
      lastFactor.father = round(lastFactor.father + drift);
    }
    lastFactor.total = round(lastFactor.mother + lastFactor.father);
    motherTotal = round(factors.reduce((sum, f) => sum + f.mother, 0));
    fatherTotal = round(factors.reduce((sum, f) => sum + f.father, 0));
  }

  const dominantParent = motherTotal >= fatherTotal ? 'Mother' : 'Father';

  const chakraLevels = factors.map((factor, index) => {
    const currentStatus = factor.total * 0.4;
    const targetLevel = currentStatus * 1.35;
    return {
      name: CHAKRAS[index],
      currentStatus,
      targetLevel,
      gapToGoal: targetLevel - currentStatus,
    };
  });

  const chakraCurrentTotal = chakraLevels.reduce((sum, chakra) => sum + chakra.currentStatus, 0);
  const chakraTargetTotal = chakraLevels.reduce((sum, chakra) => sum + chakra.targetLevel, 0);
  const chakraGapTotal = chakraLevels.reduce((sum, chakra) => sum + chakra.gapToGoal, 0);

  const auraLevels = factors.map((factor, index) => {
    const currentStatus = factor.total * 0.38332;
    const targetLevel = currentStatus * 1.35;
    return {
      name: AURAS[index],
      currentStatus,
      targetLevel,
      gapToGoal: targetLevel - currentStatus,
    };
  });

  const auraCurrentTotal = auraLevels.reduce((sum, aura) => sum + aura.currentStatus, 0);
  const auraTargetTotal = auraLevels.reduce((sum, aura) => sum + aura.targetLevel, 0);
  const auraGapTotal = auraLevels.reduce((sum, aura) => sum + aura.gapToGoal, 0);

  const positiveKarmicDeeds = chakraLevels.map((chakra, index) => {
    const currentStatus = (chakra.currentStatus + auraLevels[index].currentStatus) * 0.41878;
    const targetLevel = currentStatus * 1.35;
    return {
      name: POSITIVE_KARMIC_DEEDS[index],
      currentStatus,
      targetLevel,
      gapToGoal: targetLevel - currentStatus,
    };
  });

  const positiveKarmicCurrentTotal = positiveKarmicDeeds.reduce((sum, deed) => sum + deed.currentStatus, 0);
  const positiveKarmicTargetTotal = positiveKarmicDeeds.reduce((sum, deed) => sum + deed.targetLevel, 0);
  const positiveKarmicGapTotal = positiveKarmicDeeds.reduce((sum, deed) => sum + deed.gapToGoal, 0);

  const karmicRefinementSectors = chakraLevels.map((chakra, index) => {
    const currentStatus = (chakra.currentStatus + auraLevels[index].currentStatus) * 0.39178;
    const targetLevel = currentStatus * 1.35;
    return {
      name: KARMIC_REFINEMENT_SECTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal: targetLevel - currentStatus,
    };
  });

  const karmicRefinementCurrentTotal = karmicRefinementSectors.reduce((sum, sector) => sum + sector.currentStatus, 0);
  const karmicRefinementTargetTotal = karmicRefinementSectors.reduce((sum, sector) => sum + sector.targetLevel, 0);
  const karmicRefinementGapTotal = karmicRefinementSectors.reduce((sum, sector) => sum + sector.gapToGoal, 0);

  const karmicBalancing = chakraLevels.map((chakra, index) => {
    const currentStatus = (chakra.currentStatus + auraLevels[index].currentStatus) / 2;
    const targetLevel = currentStatus * 1.35;
    return {
      name: KARMIC_BALANCING[index],
      currentStatus,
      targetLevel,
      gapToGoal: targetLevel - currentStatus,
    };
  });

  const karmicBalancingCurrentTotal = karmicBalancing.reduce((sum, item) => sum + item.currentStatus, 0);
  const karmicBalancingTargetTotal = karmicBalancing.reduce((sum, item) => sum + item.targetLevel, 0);
  const karmicBalancingGapTotal = karmicBalancing.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 7: EARTH (Prithvi) ELEMENT ===
  const earthGapMults = [1.055, 1.065, 1.045, 1.015, 1.06, 1.115, 1.115];
  const earthElement = factors.map((factor, index) => {
    const currentStatus = factor.total * 0.63;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * earthGapMults[index];
    return {
      name: EARTH_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const earthElementCurrentTotal = earthElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const earthElementTargetTotal = earthElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const earthElementGapTotal = earthElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 8: WATER (Jala) ELEMENT ===
  const waterElement = factors.map((factor, index) => {
    const currentStatus = factor.total * 0.61;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * 1.115;
    return {
      name: WATER_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const waterElementCurrentTotal = waterElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const waterElementTargetTotal = waterElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const waterElementGapTotal = waterElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 9: FIRE (Agni) ELEMENT ===
  const fireMults = [1.0, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66];
  const baseFire = factors[0].total * 0.73;
  const fireElement = fireMults.map((mult, index) => {
    const currentStatus = baseFire * mult;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * 1.115;
    return {
      name: FIRE_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const fireElementCurrentTotal = fireElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const fireElementTargetTotal = fireElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const fireElementGapTotal = fireElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 10: AIR (Vayu) ELEMENT ===
  const airMults = [1.0, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66];
  const airGapMults = [1.08, 1.115, 1.09, 1.115, 1.075, 1.115, 1.115];
  const baseAir = factors[0].total * 0.69;
  const airElement = airMults.map((mult, index) => {
    const currentStatus = baseAir * mult;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * airGapMults[index];
    return {
      name: AIR_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const airElementCurrentTotal = airElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const airElementTargetTotal = airElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const airElementGapTotal = airElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 11: ETHER (Akasha) ELEMENT ===
  const etherMults = [1.0, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66];
  const baseEther = factors[0].total * 0.59;
  const etherElement = etherMults.map((mult, index) => {
    const currentStatus = baseEther * mult;
    const targetLevel = currentStatus * 0.525;
    const gapToGoal = targetLevel * 1.115;
    return {
      name: ETHER_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const etherElementCurrentTotal = etherElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const etherElementTargetTotal = etherElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const etherElementGapTotal = etherElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 12: TIME (Kala) ELEMENT ===
  const timeMults = [1.0, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66];
  const timeGapMults = [1.10, 1.115, 1.115, 1.115, 1.115, 1.115, 1.115];
  const baseTime = factors[0].total * 0.79;
  const timeElement = timeMults.map((mult, index) => {
    const currentStatus = baseTime * mult;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * timeGapMults[index];
    return {
      name: TIME_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const timeElementCurrentTotal = timeElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const timeElementTargetTotal = timeElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const timeElementGapTotal = timeElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 13: SOUL (Atman) ELEMENT ===
  const soulMults = [1.0, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66];
  const soulGapMults = [1.065, 1.115, 1.115, 1.115, 1.115, 1.115, 1.115];
  const baseSoul = factors[0].total * 0.75;
  const soulElement = soulMults.map((mult, index) => {
    const currentStatus = baseSoul * mult;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * soulGapMults[index];
    return {
      name: SOUL_ELEMENT_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const soulElementCurrentTotal = soulElement.reduce((sum, item) => sum + item.currentStatus, 0);
  const soulElementTargetTotal = soulElement.reduce((sum, item) => sum + item.targetLevel, 0);
  const soulElementGapTotal = soulElement.reduce((sum, item) => sum + item.gapToGoal, 0);

  // === Table 14: ROOT CHAKRA ===
  const rootMults = [1.0, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66];
  const rootGapMults = [1.095, 1.115, 1.115, 1.115, 1.115, 1.115, 1.115];
  const baseRoot = factors[0].total * 0.78;
  const rootChakra = rootMults.map((mult, index) => {
    const currentStatus = baseRoot * mult;
    const targetLevel = currentStatus * 0.625;
    const gapToGoal = targetLevel * rootGapMults[index];
    return {
      name: ROOT_CHAKRA_FACTORS[index],
      currentStatus,
      targetLevel,
      gapToGoal,
    };
  });
  const rootChakraCurrentTotal = rootChakra.reduce((sum, item) => sum + item.currentStatus, 0);
  const rootChakraTargetTotal = rootChakra.reduce((sum, item) => sum + item.targetLevel, 0);
  const rootChakraGapTotal = rootChakra.reduce((sum, item) => sum + item.gapToGoal, 0);

  return {
    factors,
    motherTotal,
    fatherTotal,
    grandTotal: round(motherTotal + fatherTotal),
    dominantParent,
    chakraLevels,
    chakraCurrentTotal,
    chakraTargetTotal,
    chakraGapTotal,
    auraLevels,
    auraCurrentTotal,
    auraTargetTotal,
    auraGapTotal,
    positiveKarmicDeeds,
    positiveKarmicCurrentTotal,
    positiveKarmicTargetTotal,
    positiveKarmicGapTotal,
    karmicRefinementSectors,
    karmicRefinementCurrentTotal,
    karmicRefinementTargetTotal,
    karmicRefinementGapTotal,
    karmicBalancing,
    karmicBalancingCurrentTotal,
    karmicBalancingTargetTotal,
    karmicBalancingGapTotal,
    earthElement,
    earthElementCurrentTotal,
    earthElementTargetTotal,
    earthElementGapTotal,
    waterElement,
    waterElementCurrentTotal,
    waterElementTargetTotal,
    waterElementGapTotal,
    fireElement,
    fireElementCurrentTotal,
    fireElementTargetTotal,
    fireElementGapTotal,
    airElement,
    airElementCurrentTotal,
    airElementTargetTotal,
    airElementGapTotal,
    etherElement,
    etherElementCurrentTotal,
    etherElementTargetTotal,
    etherElementGapTotal,
    timeElement,
    timeElementCurrentTotal,
    timeElementTargetTotal,
    timeElementGapTotal,
    soulElement,
    soulElementCurrentTotal,
    soulElementTargetTotal,
    soulElementGapTotal,
    rootChakra,
    rootChakraCurrentTotal,
    rootChakraTargetTotal,
    rootChakraGapTotal,
    dateOfBirth: dob.toISOString(),
    day,
  };
}
