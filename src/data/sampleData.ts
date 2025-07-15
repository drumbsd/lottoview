import type { LottoExtraction } from '../types/lotto';
import { LOTTO_WHEELS } from '../types/lotto';

// Generate random lottery numbers for demonstration
const generateRandomNumbers = (): number[] => {
  const numbers: number[] = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 90) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

// Generate sample extraction data
const generateSampleExtractions = (): LottoExtraction[] => {
  const extractions: LottoExtraction[] = [];
  const today = new Date();
  
  // Generate data for the last 10 extractions (roughly 3 weeks)
  for (let i = 0; i < 10; i++) {
    const extractionDate = new Date(today);
    
    // Go back to find extraction days (Tuesday, Thursday, Saturday)
    let daysBack = i * 2 + 1; // Start with recent extractions
    if (i > 0) {
      daysBack = i * 3; // Roughly 3 days apart
    }
    
    extractionDate.setDate(today.getDate() - daysBack);
    
    const results: Record<string, number[]> = {};
    LOTTO_WHEELS.forEach(wheel => {
      results[wheel.name] = generateRandomNumbers();
    });
    
    extractions.push({
      date: extractionDate.toISOString().split('T')[0], // YYYY-MM-DD format
      results
    });
  }
  
  return extractions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sampleLottoData = {
  extractions: generateSampleExtractions()
};
