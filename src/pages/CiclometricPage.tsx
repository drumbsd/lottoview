import React, { useState, useMemo } from 'react';
import CiclometricCircle from '../components/CiclometricCircle';
import WheelSelector from '../components/WheelSelector';
import CiclometricDetails from '../components/CiclometricDetails';
import PredictionPanel from '../components/PredictionPanel';
import { calculateExtractionCiclometrics } from '../services/ciclometricService';
import { generateWheelPredictions } from '../services/predictionService';
import type { LottoExtraction } from '../types/lotto';
import './CiclometricPage.css';

interface CiclometricPageProps {
  onBack: () => void;
  initialSelectedNumbers?: Set<number>;
  latestExtraction?: LottoExtraction;
  allExtractions?: LottoExtraction[];
}

const CiclometricPage: React.FC<CiclometricPageProps> = ({ 
  onBack, 
  initialSelectedNumbers = new Set(),
  latestExtraction,
  allExtractions = []
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(
    new Set(initialSelectedNumbers)
  );
  const [selectedWheel, setSelectedWheel] = useState<string | null>(null);

  // Calculate ciclometric data for all wheels if we have extraction data
  const wheelsData = useMemo(() => {
    if (!latestExtraction) return [];
    return calculateExtractionCiclometrics(latestExtraction);
  }, [latestExtraction]);

  // Get data for the selected wheel
  const selectedWheelData = selectedWheel 
    ? wheelsData.find(w => w.wheelName === selectedWheel) 
    : null;

  // Generate predictions for the selected wheel
  const wheelPredictions = useMemo(() => {
    if (!selectedWheel || allExtractions.length === 0) return null;
    return generateWheelPredictions(selectedWheel, allExtractions);
  }, [selectedWheel, allExtractions]);

  const handleNumberClick = (number: number) => {
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
      } else {
        newSet.add(number);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedNumbers(new Set());
  };

  const selectDecade = (decade: number) => {
    const start = (decade - 1) * 10 + 1;
    const end = Math.min(decade * 10, 90);
    
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      for (let i = start; i <= end; i++) {
        newSet.add(i);
      }
      return newSet;
    });
  };

  const handleWheelSelect = (wheelName: string) => {
    if (selectedWheel === wheelName) {
      setSelectedWheel(null); // Deselect if clicking the same wheel
    } else {
      setSelectedWheel(wheelName);
    }
  };

  return (
    <div className="ciclometric-page">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          ← Torna al Tabellone
        </button>
        
        <div className="page-controls">
          <button className="control-button clear" onClick={clearSelection}>
            Cancella Selezione
          </button>
          
          <div className="decade-buttons">
            <span>Seleziona decade:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(decade => (
              <button
                key={decade}
                className="decade-button"
                onClick={() => selectDecade(decade)}
              >
                {decade === 9 ? '81-90' : `${(decade - 1) * 10 + 1}-${decade * 10}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {wheelsData.length > 0 && (
        <WheelSelector
          wheelsData={wheelsData}
          selectedWheel={selectedWheel}
          onWheelSelect={handleWheelSelect}
        />
      )}

      <CiclometricCircle
        selectedNumbers={selectedNumbers}
        onNumberClick={handleNumberClick}
        polygonNumbers={selectedWheelData?.polygonPoints}
        showPolygon={!!selectedWheelData}
      />

      {selectedWheelData && (
        <CiclometricDetails wheelData={selectedWheelData} />
      )}

      <PredictionPanel 
        predictions={wheelPredictions}
        onNumberClick={handleNumberClick}
      />

      {selectedNumbers.size > 0 && (
        <div className="selection-summary">
          <h3>Numeri Selezionati ({selectedNumbers.size})</h3>
          <div className="selected-numbers-list">
            {Array.from(selectedNumbers)
              .sort((a, b) => a - b)
              .map(number => (
                <span key={number} className="selected-number">
                  {number}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CiclometricPage;
