import React, { useMemo } from 'react';
import type { LottoExtraction } from '../types/lotto';
import { analyzeSelectedNumbers, getMostFrequentWheel } from '../services/numberAnalysis';
import './SelectedNumbers.css';

interface SelectedNumbersProps {
  selectedNumbers: Set<number>;
  onNumberClick: (number: number) => void;
  onClearAll: () => void;
  extractions: LottoExtraction[];
}

const SelectedNumbers: React.FC<SelectedNumbersProps> = ({ 
  selectedNumbers, 
  onNumberClick, 
  onClearAll,
  extractions 
}) => {
  const analyses = useMemo(() => {
    return analyzeSelectedNumbers(selectedNumbers, extractions);
  }, [selectedNumbers, extractions]);

  if (selectedNumbers.size === 0) return null;

  const sortedNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);

  return (
    <div className="selected-numbers-panel">
      <div className="panel-header">
        <h4>🎯 Numeri Selezionati ({selectedNumbers.size})</h4>
        <button className="clear-all-button" onClick={onClearAll}>
          Cancella Tutto
        </button>
      </div>
      
      <div className="selected-numbers-list">
        {sortedNumbers.map(number => (
          <span
            key={number}
            className="selected-number-badge"
            onClick={() => onNumberClick(number)}
            title={`Clicca per deselezionare il numero ${number}`}
          >
            {number.toString().padStart(2, '0')}
            <span className="remove-icon">×</span>
          </span>
        ))}
      </div>
      
      <div className="selection-info">
        <p>💡 Clicca su un numero evidenziato per deselezionarlo</p>
      </div>
      
      {analyses.length > 0 && (
        <div className="statistics-section">
          <h5>📊 Statistiche Numeri Selezionati</h5>
          <div className="stats-grid">
            {analyses.map(analysis => (
              <div key={analysis.number} className="stat-card">
                <div className="stat-number">{analysis.number.toString().padStart(2, '0')}</div>
                <div className="stat-details">
                  <div className="stat-item">
                    <span className="stat-label">Occorrenze:</span>
                    <span className="stat-value">{analysis.totalOccurrences}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ruota preferita:</span>
                    <span className="stat-value">{getMostFrequentWheel(analysis)}</span>
                  </div>
                  {analysis.averageGapDays > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Gap medio:</span>
                      <span className="stat-value">{analysis.averageGapDays} giorni</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedNumbers;
