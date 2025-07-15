// Service for calculating ciclometric distances for lottery wheels
import type { LottoExtraction } from '../types/lotto';

export interface CiclometricDistance {
  number1: number;
  number2: number;
  distance: number;
  isMinimal: boolean;
}

export interface WheelCiclometricData {
  wheelName: string;
  distances: CiclometricDistance[];
  polygonPoints: number[];
}

// Calculate the ciclometric distance between two numbers (1-90)
export const calculateCiclometricDistance = (num1: number, num2: number): number => {
  const diff = Math.abs(num1 - num2);
  // In a circle of 90 numbers, the maximum distance is 45
  return Math.min(diff, 90 - diff);
};

// Calculate all ciclometric distances for 5 numbers of a wheel
export const calculateWheelDistances = (numbers: number[]): CiclometricDistance[] => {
  const distances: CiclometricDistance[] = [];
  
  // Calculate distances between all pairs
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const num1 = numbers[i];
      const num2 = numbers[j];
      const distance = calculateCiclometricDistance(num1, num2);
      
      distances.push({
        number1: num1,
        number2: num2,
        distance,
        isMinimal: distance <= 15 // Consider distances <= 15 as "minimal"
      });
    }
  }
  
  // Sort by distance (ascending)
  return distances.sort((a, b) => a.distance - b.distance);
};

// Calculate ciclometric data for all wheels in an extraction
export const calculateExtractionCiclometrics = (extraction: LottoExtraction): WheelCiclometricData[] => {
  const wheelNames = ['bari', 'cagliari', 'firenze', 'genova', 'milano', 'napoli', 'palermo', 'roma', 'torino', 'venezia', 'nazionale'];
  
  return wheelNames.map(wheelName => {
    const numbers = extraction.results[wheelName] || [];
    const distances = calculateWheelDistances(numbers);
    
    return {
      wheelName,
      distances,
      polygonPoints: numbers.sort((a, b) => a - b)
    };
  });
};

// Get polygon path for SVG based on 5 numbers
export const getPolygonPath = (numbers: number[]): string => {
  if (numbers.length !== 5) return '';
  
  // Sort numbers to create a proper polygon
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  
  // Calculate positions for each number on the circle
  const points = sortedNumbers.map(number => {
    const angle = ((number - 1) * 360) / 90;
    const angleRad = (angle * Math.PI) / 180;
    const radius = 280;
    
    const x = radius * Math.cos(angleRad - Math.PI / 2);
    const y = radius * Math.sin(angleRad - Math.PI / 2);
    
    return `${x},${y}`;
  });
  
  return `M${points.join('L')}Z`;
};

// Get wheel display name in Italian
export const getWheelDisplayName = (wheelName: string): string => {
  const displayNames: Record<string, string> = {
    'bari': 'Bari',
    'cagliari': 'Cagliari',
    'firenze': 'Firenze',
    'genova': 'Genova',
    'milano': 'Milano',
    'napoli': 'Napoli',
    'palermo': 'Palermo',
    'roma': 'Roma',
    'torino': 'Torino',
    'venezia': 'Venezia',
    'nazionale': 'Nazionale'
  };
  return displayNames[wheelName] || wheelName;
};

// Calculate average ciclometric distance for a wheel
export const calculateAverageDistance = (distances: CiclometricDistance[]): number => {
  if (distances.length === 0) return 0;
  const sum = distances.reduce((acc, dist) => acc + dist.distance, 0);
  return Math.round((sum / distances.length) * 10) / 10;
};

// Find the most frequent ciclometric distances across all wheels
export const findMostFrequentDistances = (allWheelData: WheelCiclometricData[]): Record<number, number> => {
  const distanceFrequency: Record<number, number> = {};
  
  allWheelData.forEach(wheelData => {
    wheelData.distances.forEach(dist => {
      distanceFrequency[dist.distance] = (distanceFrequency[dist.distance] || 0) + 1;
    });
  });
  
  return distanceFrequency;
};
