import React from 'react';
import type { DoubleAmbo } from '../services/amboAnalysis';
import './AmboControls.css';

interface AmboControlsProps {
  highlightDoubleAmbi: boolean;
  onToggleHighlight: () => void;
  doubleAmbi: DoubleAmbo[];
}

const AmboControls: React.FC<AmboControlsProps> = ({ 
  highlightDoubleAmbi, 
  onToggleHighlight, 
  doubleAmbi 
}) => {
  return (
    <div className="ambo-controls">
      <div className="controls-container">
        <button 
          className={`highlight-button ${highlightDoubleAmbi ? 'active' : ''}`}
          onClick={onToggleHighlight}
        >
          <span className="button-icon">🎯</span>
          <span className="button-text">
            {highlightDoubleAmbi ? 'Nascondi' : 'Evidenzia'} Doppi Ambi
          </span>
        </button>
        
        {doubleAmbi.length > 0 && (
          <div className="ambo-stats">
            <span className="stats-text">
              Trovati <strong>{doubleAmbi.length}</strong> doppi ambi
            </span>
          </div>
        )}
      </div>
      
      {highlightDoubleAmbi && doubleAmbi.length > 0 && (
        <div className="ambo-legend">
          <div className="legend-item">
            <span className="legend-sample double-ambo-highlight">00</span>
            <span className="legend-text">Numeri che fanno parte di doppi ambi</span>
          </div>
        </div>
      )}
      
      <div className="number-selection-legend">
        <div className="legend-item">
          <span className="legend-sample selected-number">00</span>
          <span className="legend-text">Numeri selezionati (clicca per evidenziare)</span>
        </div>
      </div>
    </div>
  );
};

export default AmboControls;
