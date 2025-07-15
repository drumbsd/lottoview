import type { LottoExtraction } from '../types/lotto';

export interface AmboOccurrence {
  numbers: [number, number];
  wheels: string[]; // Multiple wheels where the ambo appears in the same extraction
  date: string;
  extractionIndex: number;
}

export interface DoubleAmbo {
  numbers: [number, number];
  occurrences: AmboOccurrence[]; // Each occurrence represents same ambo on multiple wheels in same extraction
}

// Function to get all combinations of 2 numbers from an array of 5
const getCombinations = (numbers: number[]): [number, number][] => {
  const combinations: [number, number][] = [];
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const pair: [number, number] = [numbers[i], numbers[j]];
      combinations.push(pair);
    }
  }
  return combinations;
};

// Function to create a unique key for an ambo (pair of numbers)
const getAmboKey = (numbers: [number, number]): string => {
  const sorted = [...numbers].sort((a, b) => a - b);
  return `${sorted[0]}-${sorted[1]}`;
};

// Function to find all double ambi in the extractions
export const findDoubleAmbi = (extractions: LottoExtraction[]): DoubleAmbo[] => {
  const doubleAmbi: DoubleAmbo[] = [];

  // Analyze each extraction individually
  extractions.forEach((extraction, extractionIndex) => {
    // For each extraction, find all ambi and group by ambo key
    const ambiInExtraction = new Map<string, string[]>(); // key -> wheels where this ambo appears

    Object.entries(extraction.results).forEach(([wheel, numbers]) => {
      if (numbers && numbers.length === 5) {
        const combinations = getCombinations(numbers);
        
        combinations.forEach(combination => {
          const key = getAmboKey(combination);
          
          if (!ambiInExtraction.has(key)) {
            ambiInExtraction.set(key, []);
          }
          ambiInExtraction.get(key)!.push(wheel);
        });
      }
    });

    // Find ambi that appear on 2 or more wheels in this extraction (double ambi)
    ambiInExtraction.forEach((wheels, key) => {
      if (wheels.length >= 2) {
        const numbers = key.split('-').map(Number) as [number, number];
        
        // Check if this ambo already exists in our results
        let existingAmbo = doubleAmbi.find(ambo => getAmboKey(ambo.numbers) === key);
        
        if (!existingAmbo) {
          existingAmbo = {
            numbers,
            occurrences: []
          };
          doubleAmbi.push(existingAmbo);
        }
        
        // Add this occurrence
        existingAmbo.occurrences.push({
          numbers,
          wheels: wheels.sort(), // Sort wheels for consistency
          date: extraction.date,
          extractionIndex
        });
      }
    });
  });

  // Sort by total number of occurrences (most frequent first)
  doubleAmbi.sort((a, b) => b.occurrences.length - a.occurrences.length);

  return doubleAmbi;
};

// Function to check if a specific ambo is a double ambo
export const isDoubleAmbo = (numbers: [number, number], doubleAmbi: DoubleAmbo[]): boolean => {
  const key = getAmboKey(numbers);
  return doubleAmbi.some(ambo => getAmboKey(ambo.numbers) === key);
};

// Function to get all ambi for a specific wheel and extraction
export const getAmbiForWheelExtraction = (numbers: number[]): [number, number][] => {
  if (!numbers || numbers.length !== 5) return [];
  return getCombinations(numbers);
};
