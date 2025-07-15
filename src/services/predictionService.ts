// Service for generating lottery predictions based on ciclometric analysis
import type { LottoExtraction } from '../types/lotto';
import { calculateCiclometricDistance } from './ciclometricService';

export interface CiclometricPrediction {
  type: 'ambata' | 'ambo';
  numbers: number[];
  confidence: number; // 0-100
  reasoning: string;
  basedOnPattern: string;
  ciclometricDistance?: number;
}

export interface WheelPredictions {
  wheelName: string;
  ambate: CiclometricPrediction[];
  ambi: CiclometricPrediction[];
  analysisDate: string;
  extractionsAnalyzed: number;
}

// Find numbers with specific ciclometric distances from recent extractions
const findCiclometricSequences = (recentNumbers: number[], targetDistance: number): {numbers: number[], details: string[]} => {
  const suggestions: number[] = [];
  const details: string[] = [];
  
  recentNumbers.forEach(baseNumber => {
    for (let candidate = 1; candidate <= 90; candidate++) {
      const distance = calculateCiclometricDistance(baseNumber, candidate);
      if (distance === targetDistance && !recentNumbers.includes(candidate) && !suggestions.includes(candidate)) {
        suggestions.push(candidate);
        details.push(`${candidate} (da ${baseNumber}, distanza ${distance})`);
      }
    }
  });
  
  // Sort suggestions
  const sortedIndices = suggestions
    .map((num, index) => ({ num, index }))
    .sort((a, b) => a.num - b.num);
  
  return {
    numbers: sortedIndices.map(item => item.num),
    details: sortedIndices.map(item => details[item.index])
  };
};

// Calculate frequency of numbers in recent extractions
const calculateNumberFrequency = (wheelName: string, extractions: LottoExtraction[]): Record<number, number> => {
  const frequency: Record<number, number> = {};
  
  extractions.slice(0, 20).forEach(extraction => {
    const wheelNumbers = extraction.results[wheelName] || [];
    wheelNumbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
  });
  
  return frequency;
};

// Find "cold" numbers (not extracted recently)
const findColdNumbers = (wheelName: string, extractions: LottoExtraction[]): number[] => {
  const recentNumbers = new Set<number>();
  
  // Look at last 5 extractions
  extractions.slice(0, 5).forEach(extraction => {
    const wheelNumbers = extraction.results[wheelName] || [];
    wheelNumbers.forEach(num => recentNumbers.add(num));
  });
  
  const coldNumbers: number[] = [];
  for (let i = 1; i <= 90; i++) {
    if (!recentNumbers.has(i)) {
      coldNumbers.push(i);
    }
  }
  
  return coldNumbers;
};

// Generate ambata predictions based on ciclometric analysis
const generateAmbatePredictions = (wheelName: string, extractions: LottoExtraction[]): CiclometricPrediction[] => {
  const predictions: CiclometricPrediction[] = [];
  const latestNumbers = extractions[0]?.results[wheelName] || [];
  const frequency = calculateNumberFrequency(wheelName, extractions);
  const coldNumbers = findColdNumbers(wheelName, extractions);
  
  // 1. Ciclometric distance patterns (distance 9 - very frequent in lotto)
  const distance9Result = findCiclometricSequences(latestNumbers, 9);
  if (distance9Result.numbers.length > 0) {
    predictions.push({
      type: 'ambata',
      numbers: distance9Result.numbers.slice(0, 3),
      confidence: 75,
      reasoning: `Distanza 9: ${distance9Result.details.slice(0, 3).join(', ')}`,
      basedOnPattern: 'Distanza Ciclometrica 9',
      ciclometricDistance: 9
    });
  }
  
  // 2. Ciclometric distance 18 (double of 9)
  const distance18Result = findCiclometricSequences(latestNumbers, 18);
  if (distance18Result.numbers.length > 0) {
    predictions.push({
      type: 'ambata',
      numbers: distance18Result.numbers.slice(0, 2),
      confidence: 65,
      reasoning: `Distanza 18: ${distance18Result.details.slice(0, 2).join(', ')}`,
      basedOnPattern: 'Distanza Ciclometrica 18',
      ciclometricDistance: 18
    });
  }
  
  // 3. Cold numbers with high historical frequency
  const coldWithFrequency = coldNumbers
    .filter(num => frequency[num] >= 2)
    .sort((a, b) => (frequency[b] || 0) - (frequency[a] || 0))
    .slice(0, 3);
    
  if (coldWithFrequency.length > 0) {
    predictions.push({
      type: 'ambata',
      numbers: coldWithFrequency,
      confidence: 60,
      reasoning: 'Numeri "freddi" con alta frequenza storica',
      basedOnPattern: 'Recupero Numeri Freddi'
    });
  }
  
  // 4. Quadranti ciclometrici (numbers in same circular sectors)
  const lastNumber = latestNumbers[latestNumbers.length - 1];
  if (lastNumber) {
    const sameQuadrant: number[] = [];
    const quadrantSize = 22.5; // 90/4 = 22.5 numbers per quadrant
    const baseQuadrant = Math.floor((lastNumber - 1) / quadrantSize);
    
    for (let i = 1; i <= 90; i++) {
      const numQuadrant = Math.floor((i - 1) / quadrantSize);
      if (numQuadrant === baseQuadrant && i !== lastNumber && !latestNumbers.includes(i)) {
        sameQuadrant.push(i);
      }
    }
    
    if (sameQuadrant.length > 0) {
      predictions.push({
        type: 'ambata',
        numbers: sameQuadrant.slice(0, 2),
        confidence: 55,
        reasoning: `Numeri nello stesso quadrante ciclometrico di ${lastNumber}`,
        basedOnPattern: 'Stesso Quadrante Ciclometrico'
      });
    }
  }
  
  return predictions.sort((a, b) => b.confidence - a.confidence);
};

// Generate ambo predictions
const generateAmboPredictions = (wheelName: string, extractions: LottoExtraction[]): CiclometricPrediction[] => {
  const predictions: CiclometricPrediction[] = [];
  const latestNumbers = extractions[0]?.results[wheelName] || [];
  
  // 1. Ambi ciclometrici classici (distanze frequenti: 9, 18, 27, 36, 45)
  const frequentDistances = [9, 18, 27, 36, 45];
  
  frequentDistances.forEach(distance => {
    const ambiAtDistance: number[][] = [];
    
    for (let base = 1; base <= 90; base++) {
      for (let target = base + 1; target <= 90; target++) {
        if (calculateCiclometricDistance(base, target) === distance) {
          // Check if these numbers have good probability
          const isGoodCandidate = !latestNumbers.includes(base) && !latestNumbers.includes(target);
          if (isGoodCandidate && ambiAtDistance.length < 3) {
            ambiAtDistance.push([base, target]);
          }
        }
      }
    }
    
    if (ambiAtDistance.length > 0) {
      predictions.push({
        type: 'ambo',
        numbers: ambiAtDistance[0], // Take first good candidate
        confidence: 70 - (distance / 9) * 5, // Higher confidence for smaller distances
        reasoning: `Ambo ciclometrico a distanza ${distance}`,
        basedOnPattern: `Distanza Ciclometrica ${distance}`,
        ciclometricDistance: distance
      });
    }
  });
  
  // 2. Ambi consecutivi ciclometrici
  const consecutivePairs: number[][] = [];
  for (let i = 1; i <= 90; i++) {
    const next = i === 90 ? 1 : i + 1; // Nel cerchio: 90 seguito da 1
    if (!latestNumbers.includes(i) && !latestNumbers.includes(next)) {
      consecutivePairs.push([Math.min(i, next), Math.max(i, next)]); // Ordina sempre dal minore al maggiore
    }
  }
  
  if (consecutivePairs.length > 0) {
    const randomPair = consecutivePairs[Math.floor(Math.random() * Math.min(3, consecutivePairs.length))];
    predictions.push({
      type: 'ambo',
      numbers: randomPair,
      confidence: 50,
      reasoning: `Ambo consecutivo: ${randomPair[0]}-${randomPair[1]} (consecutivi nel cerchio)`,
      basedOnPattern: 'Consecutivi Ciclometrici',
      ciclometricDistance: 1
    });
  }
  
  // 3. Ambi speculari (opposti nel cerchio - distanza 45)
  const specularPairs: number[][] = [];
  for (let i = 1; i <= 45; i++) {
    const opposite = i + 45; // Gli opposti sono sempre: 1↔46, 2↔47, ..., 45↔90
    if (!latestNumbers.includes(i) && !latestNumbers.includes(opposite)) {
      specularPairs.push([i, opposite]);
    }
  }
  
  if (specularPairs.length > 0) {
    const randomSpecular = specularPairs[Math.floor(Math.random() * Math.min(2, specularPairs.length))];
    predictions.push({
      type: 'ambo',
      numbers: randomSpecular,
      confidence: 45,
      reasoning: `Ambo speculare: ${randomSpecular[0]}-${randomSpecular[1]} (opposti nel cerchio, distanza 45)`,
      basedOnPattern: 'Ambo Speculare',
      ciclometricDistance: 45
    });
  }
  
  return predictions.sort((a, b) => b.confidence - a.confidence);
};

// Main function to generate predictions for a wheel
export const generateWheelPredictions = (
  wheelName: string, 
  extractions: LottoExtraction[]
): WheelPredictions => {
  const ambate = generateAmbatePredictions(wheelName, extractions);
  const ambi = generateAmboPredictions(wheelName, extractions);
  
  return {
    wheelName,
    ambate: ambate.slice(0, 5), // Top 5 ambate
    ambi: ambi.slice(0, 4), // Top 4 ambi
    analysisDate: new Date().toISOString().split('T')[0],
    extractionsAnalyzed: Math.min(20, extractions.length)
  };
};

// Get confidence color for UI
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 70) return '#4caf50'; // Green
  if (confidence >= 60) return '#ff9800'; // Orange
  if (confidence >= 50) return '#2196f3'; // Blue
  return '#9e9e9e'; // Gray
};

// Get confidence text
export const getConfidenceText = (confidence: number): string => {
  if (confidence >= 70) return 'Alta';
  if (confidence >= 60) return 'Media';
  if (confidence >= 50) return 'Bassa';
  return 'Molto Bassa';
};
