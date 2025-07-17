// Service for 10eLotto number generation based on ciclometric predictions
import type { LottoExtraction } from '../types/lotto';
import { generateWheelPredictions } from './predictionService';

export interface TeneLottoSuggestion {
  numbers: number[];
  explanations: string[];
  confidence: number;
  basedOnWheels: string[];
  generatedAt: string;
}

// Generate 10eLotto numbers from first ambata prediction of each wheel
export const generate10eLottoNumbers = (extractions: LottoExtraction[]): TeneLottoSuggestion => {
  const wheelNames = ['bari', 'cagliari', 'firenze', 'genova', 'milano', 'napoli', 'palermo', 'roma', 'torino', 'venezia', 'nazionale'];
  
  const selectedNumbers: number[] = [];
  const explanations: string[] = [];
  const usedWheels: string[] = [];
  let totalConfidence = 0;
  
  // Get first ambata from each wheel
  for (const wheelName of wheelNames) {
    try {
      const predictions = generateWheelPredictions(wheelName, extractions);
      
      if (predictions.ambate.length > 0) {
        const firstAmbata = predictions.ambate[0];
        const suggestedNumber = firstAmbata.numbers[0];
        
        // Avoid duplicates
        if (!selectedNumbers.includes(suggestedNumber)) {
          selectedNumbers.push(suggestedNumber);
          explanations.push(`${suggestedNumber} da ${wheelName.toUpperCase()} - ${firstAmbata.reasoning}`);
          usedWheels.push(wheelName.toUpperCase());
          totalConfidence += firstAmbata.confidence;
        } else {
          // If the first ambata is duplicate, try the second one
          if (predictions.ambate.length > 1) {
            const secondAmbata = predictions.ambate[1];
            const secondNumber = secondAmbata.numbers[0];
            if (!selectedNumbers.includes(secondNumber)) {
              selectedNumbers.push(secondNumber);
              explanations.push(`${secondNumber} da ${wheelName.toUpperCase()} - ${secondAmbata.reasoning} (alternativa)`);
              usedWheels.push(wheelName.toUpperCase());
              totalConfidence += secondAmbata.confidence;
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Could not get prediction for wheel ${wheelName}:`, error);
    }
  }
  
  // If we have less than 10 numbers, add backup numbers from remaining wheels' ambi
  if (selectedNumbers.length < 10) {
    // Only use wheels that haven't contributed yet to avoid multiple numbers from same wheel
    const unusedWheels = wheelNames.filter(wheel => !usedWheels.includes(wheel.toUpperCase()));
    
    for (const wheelName of unusedWheels) {
      if (selectedNumbers.length >= 10) break;
      
      try {
        const predictions = generateWheelPredictions(wheelName, extractions);
        
        // Add numbers from ambi predictions
        for (const ambo of predictions.ambi) {
          if (selectedNumbers.length >= 10) break;
          
          for (const number of ambo.numbers) {
            if (selectedNumbers.length >= 10) break;
            
            if (!selectedNumbers.includes(number)) {
              selectedNumbers.push(number);
              explanations.push(`${number} da ${wheelName.toUpperCase()} - Ambo: ${ambo.reasoning}`);
              if (!usedWheels.includes(wheelName.toUpperCase())) {
                usedWheels.push(wheelName.toUpperCase());
              }
              totalConfidence += (ambo.confidence * 0.7); // Lower weight for ambi
              break; // Take only one number per wheel in backup phase
            }
          }
        }
      } catch (error) {
        console.warn(`Could not get ambi prediction for wheel ${wheelName}:`, error);
      }
    }
  }
  
  // If still less than 10, add statistically frequent numbers
  if (selectedNumbers.length < 10) {
    const frequentNumbers = [11, 22, 33, 44, 55, 66, 77, 88, 1, 90];
    
    for (const number of frequentNumbers) {
      if (selectedNumbers.length >= 10) break;
      
      if (!selectedNumbers.includes(number)) {
        selectedNumbers.push(number);
        explanations.push(`${number} - Numero statisticamente frequente`);
      }
    }
  }
  
  // Take only first 10 numbers and sort them
  const finalNumbers = selectedNumbers.slice(0, 10).sort((a, b) => a - b);
  const finalExplanations = explanations.slice(0, 10);
  
  return {
    numbers: finalNumbers,
    explanations: finalExplanations,
    confidence: Math.round(totalConfidence / finalNumbers.length),
    basedOnWheels: usedWheels,
    generatedAt: new Date().toLocaleString('it-IT')
  };
};

// Format 10eLotto suggestion for display
export const format10eLottoDisplay = (suggestion: TeneLottoSuggestion): string => {
  const numbersText = suggestion.numbers.join(' - ');
  const confidenceText = `Affidabilità: ${suggestion.confidence}%`;
  const wheelsText = `Ruote analizzate: ${suggestion.basedOnWheels.join(', ')}`;
  const timeText = `Generato il: ${suggestion.generatedAt}`;
  
  return `🎲 Numeri 10eLotto: ${numbersText}\n\n${confidenceText}\n${wheelsText}\n${timeText}`;
};
