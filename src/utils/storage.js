/**
 * LocalStorage utilities for saving and retrieving calculation results.
 */

const STORAGE_KEY = 'parental-legacy-results';

/**
 * Save a calculation result to localStorage.
 * @param {object} result - The calculation result from calculateFactors()
 * @param {string|Date} dateOfBirth - The DOB used for the calculation
 */
export function saveResult(result, dateOfBirth) {
  const results = getResults();

  const entry = {
    id: Date.now(),
    dateOfBirth: typeof dateOfBirth === 'string' ? dateOfBirth : dateOfBirth?.toISOString?.() || result.dateOfBirth,
    calculatedAt: new Date().toISOString(),
    result,
  };

  results.unshift(entry); // Most recent first

  // Keep max 50 entries
  if (results.length > 50) {
    results.length = 50;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  return entry;
}

/**
 * Retrieve all saved results from localStorage.
 * @returns {Array} Saved results, most recent first
 */
export function getResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return [];
  }
}

/**
 * Delete a saved result by its ID.
 * @param {number} id - The result entry ID (timestamp)
 */
export function deleteResult(id) {
  const results = getResults().filter((entry) => entry.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to update localStorage:', e);
  }
}

/**
 * Clear all saved results.
 */
export function clearResults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}
