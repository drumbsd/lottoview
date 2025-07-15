import type { LottoExtraction } from '../types/lotto';
import { LOTTO_WHEELS } from '../types/lotto';

export interface NumberOccurrence {
  number: number;
  wheel: string;
  date: string;
  extractionIndex: number;
}

export interface NumberAnalysis {
  number: number;
  totalOccurrences: number;
  occurrences: NumberOccurrence[];
  wheelFrequency: Record<string, number>;
  lastSeen: string;
  averageGapDays: number;
}

// Function to analyze selected numbers across all extractions
export const analyzeSelectedNumbers = (
  selectedNumbers: Set<number>, 
  extractions: LottoExtraction[]
): NumberAnalysis[] => {
  const analyses: NumberAnalysis[] = [];

  selectedNumbers.forEach(number => {
    const occurrences: NumberOccurrence[] = [];
    const wheelFrequency: Record<string, number> = {};

    // Initialize wheel frequency counter
    LOTTO_WHEELS.forEach(wheel => {
      wheelFrequency[wheel.name] = 0;
    });

    // Find all occurrences of this number
    extractions.forEach((extraction, extractionIndex) => {
      Object.entries(extraction.results).forEach(([wheel, numbers]) => {
        if (numbers && numbers.includes(number)) {
          occurrences.push({
            number,
            wheel,
            date: extraction.date,
            extractionIndex
          });
          wheelFrequency[wheel]++;
        }
      });
    });

    // Calculate statistics
    const lastSeen = occurrences.length > 0 ? occurrences[0].date : '';
    
    // Calculate average gap between occurrences
    let averageGapDays = 0;
    if (occurrences.length > 1) {
      const dates = occurrences.map(occ => new Date(occ.date)).sort((a, b) => b.getTime() - a.getTime());
      let totalGap = 0;
      for (let i = 0; i < dates.length - 1; i++) {
        const gap = (dates[i].getTime() - dates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
        totalGap += gap;
      }
      averageGapDays = Math.round(totalGap / (dates.length - 1));
    }

    analyses.push({
      number,
      totalOccurrences: occurrences.length,
      occurrences,
      wheelFrequency,
      lastSeen,
      averageGapDays
    });
  });

  // Sort by total occurrences (most frequent first)
  return analyses.sort((a, b) => b.totalOccurrences - a.totalOccurrences);
};

// Function to get the most frequent wheel for a number
export const getMostFrequentWheel = (analysis: NumberAnalysis): string => {
  let maxCount = 0;
  let mostFrequentWheel = '';
  
  Object.entries(analysis.wheelFrequency).forEach(([wheel, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentWheel = wheel;
    }
  });
  
  const wheelDisplay = LOTTO_WHEELS.find(w => w.name === mostFrequentWheel);
  return wheelDisplay ? wheelDisplay.displayName : mostFrequentWheel;
};
