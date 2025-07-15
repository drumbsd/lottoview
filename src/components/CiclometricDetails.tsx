import React from 'react';
import type { WheelCiclometricData } from '../services/ciclometricService';
import { getWheelDisplayName } from '../services/ciclometricService';
import './CiclometricDetails.css';

interface CiclometricDetailsProps {
  wheelData: WheelCiclometricData | null;
}

const CiclometricDetails: React.FC<CiclometricDetailsProps> = ({ wheelData }) => {
  if (!wheelData) {
    return (
      <div className="ciclometric-details placeholder">
        <p>Seleziona una ruota per vedere le distanze ciclometriche</p>
      </div>
    );
  }

  const displayName = getWheelDisplayName(wheelData.wheelName);
  const minimalDistances = wheelData.distances.filter(d => d.isMinimal);
  const maxDistance = Math.max(...wheelData.distances.map(d => d.distance));
  const minDistance = Math.min(...wheelData.distances.map(d => d.distance));

  return (
    <div className="ciclometric-details">
      <div className="details-header">
        <h3>Distanze Ciclometriche - {displayName}</h3>
        <div className="summary-stats">
          <span className="stat">
            <strong>Min:</strong> {minDistance}
          </span>
          <span className="stat">
            <strong>Max:</strong> {maxDistance}
          </span>
          <span className="stat">
            <strong>Minimali:</strong> {minimalDistances.length}/{wheelData.distances.length}
          </span>
        </div>
      </div>

      <div className="distances-list">
        {wheelData.distances.map((distance, index) => (
          <div
            key={index}
            className={`distance-item ${distance.isMinimal ? 'minimal' : ''}`}
          >
            <div className="distance-numbers">
              <span className="number">{distance.number1}</span>
              <span className="separator">↔</span>
              <span className="number">{distance.number2}</span>
            </div>
            <div className="distance-value">
              <span className={`distance ${distance.isMinimal ? 'minimal-badge' : ''}`}>
                {distance.distance}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="distance-analysis">
        <h4>Analisi Distanze</h4>
        <div className="analysis-grid">
          <div className="analysis-item">
            <span className="label">Distanze Minimali (≤15):</span>
            <span className="value">{minimalDistances.length}</span>
          </div>
          <div className="analysis-item">
            <span className="label">Distanze Medie (16-30):</span>
            <span className="value">
              {wheelData.distances.filter(d => d.distance > 15 && d.distance <= 30).length}
            </span>
          </div>
          <div className="analysis-item">
            <span className="label">Distanze Massime (&gt;30):</span>
            <span className="value">
              {wheelData.distances.filter(d => d.distance > 30).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CiclometricDetails;
