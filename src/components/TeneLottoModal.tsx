import React from 'react';
import type { TeneLottoSuggestion } from '../services/teneLottoService';
import './TeneLottoModal.css';

interface TeneLottoModalProps {
  suggestion: TeneLottoSuggestion;
  isOpen: boolean;
  onClose: () => void;
}

export const TeneLottoModal: React.FC<TeneLottoModalProps> = ({
  suggestion,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="tenelotto-modal-overlay" onClick={onClose}>
      <div className="tenelotto-modal" onClick={e => e.stopPropagation()}>
        <div className="tenelotto-header">
          <h2>🎯 10eLotto - Numeri Consigliati</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="tenelotto-content">
          <div className="numbers-display">
            <h3>I tuoi 10 numeri:</h3>
            <div className="numbers-grid">
              {suggestion.numbers.map((number, index) => (
                <div key={index} className="number-ball">
                  {number}
                </div>
              ))}
            </div>
          </div>
          
          <div className="confidence-info">
            <div className="confidence-score">
              <span className="confidence-label">Affidabilità:</span>
              <span 
                className="confidence-value"
                style={{
                  color: suggestion.confidence >= 70 ? '#4caf50' : 
                         suggestion.confidence >= 60 ? '#ff9800' : '#f44336'
                }}
              >
                {suggestion.confidence}%
              </span>
            </div>
          </div>
          
          <div className="wheels-info">
            <h4>🎰 Ruote Analizzate:</h4>
            <p>{suggestion.basedOnWheels.join(', ')}</p>
          </div>
          
          <div className="explanations">
            <h4>📋 Spiegazioni:</h4>
            <div className="explanations-list">
              {suggestion.explanations.map((explanation, index) => (
                <div key={index} className="explanation-item">
                  <span className="bullet">•</span>
                  {explanation}
                </div>
              ))}
            </div>
          </div>
          
          <div className="generation-info">
            <p className="generated-time">
              <strong>Generato:</strong> {suggestion.generatedAt}
            </p>
          </div>
        </div>
        
        <div className="tenelotto-actions">
          <button className="btn-close" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
