import React from 'react';
import type { WheelPredictions, CiclometricPrediction } from '../services/predictionService';
import { getConfidenceColor, getConfidenceText } from '../services/predictionService';
import './PredictionPanel.css';

interface PredictionPanelProps {
  predictions: WheelPredictions | null;
  onNumberClick?: (number: number) => void;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ 
  predictions, 
  onNumberClick 
}) => {
  if (!predictions) {
    return (
      <div className="prediction-panel placeholder">
        <h3>🔮 Suggerimenti Ciclometrici</h3>
        <p>Seleziona una ruota per vedere i suggerimenti di gioco basati sull'analisi ciclometrica</p>
      </div>
    );
  }

  const handleNumberClick = (number: number) => {
    if (onNumberClick) {
      onNumberClick(number);
    }
  };

  const renderPrediction = (prediction: CiclometricPrediction, index: number) => {
    const confidenceColor = getConfidenceColor(prediction.confidence);
    const confidenceText = getConfidenceText(prediction.confidence);
    
    return (
      <div key={index} className="prediction-item">
        <div className="prediction-header">
          <div className="prediction-type">
            {prediction.type === 'ambata' ? '🎯' : '🎲'} {prediction.type.toUpperCase()}
          </div>
          <div 
            className="confidence-badge"
            style={{ backgroundColor: confidenceColor }}
          >
            {confidenceText} ({prediction.confidence}%)
          </div>
        </div>
        
        <div className="prediction-numbers">
          {prediction.numbers.map((number, numIndex) => (
            <span
              key={numIndex}
              className="prediction-number"
              onClick={() => handleNumberClick(number)}
            >
              {number.toString().padStart(2, '0')}
            </span>
          ))}
        </div>
        
        <div className="prediction-details">
          <div className="prediction-reasoning">
            <strong>Motivo:</strong> {prediction.reasoning}
          </div>
          <div className="prediction-pattern">
            <strong>Pattern:</strong> {prediction.basedOnPattern}
            {prediction.ciclometricDistance && (
              <span className="distance-info">
                {' '}(Distanza: {prediction.ciclometricDistance})
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="prediction-panel">
      <div className="prediction-header-main">
        <h3>🔮 Suggerimenti per {predictions.wheelName.toUpperCase()}</h3>
        <div className="analysis-info">
          <span>Analisi su {predictions.extractionsAnalyzed} estrazioni</span>
          <span>•</span>
          <span>{predictions.analysisDate}</span>
        </div>
      </div>

      <div className="predictions-grid">
        <div className="predictions-section">
          <h4>🎯 AMBATE CONSIGLIATE</h4>
          {predictions.ambate.length > 0 ? (
            predictions.ambate.map((prediction, index) => renderPrediction(prediction, index))
          ) : (
            <div className="no-predictions">Nessuna ambata suggerita</div>
          )}
        </div>

        <div className="predictions-section">
          <h4>🎲 AMBI CONSIGLIATI</h4>
          {predictions.ambi.length > 0 ? (
            predictions.ambi.map((prediction, index) => renderPrediction(prediction, index))
          ) : (
            <div className="no-predictions">Nessun ambo suggerito</div>
          )}
        </div>
      </div>

      <div className="prediction-disclaimer">
        <p>
          <strong>⚠️ Disclaimer:</strong> I suggerimenti sono basati su analisi statistica e ciclometrica. 
          Il lotto è un gioco di fortuna. Gioca responsabilmente.
        </p>
      </div>
    </div>
  );
};

export default PredictionPanel;
