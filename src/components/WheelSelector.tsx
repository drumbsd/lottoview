import React from 'react';
import type { WheelCiclometricData } from '../services/ciclometricService';
import { getWheelDisplayName, calculateAverageDistance } from '../services/ciclometricService';
import './WheelSelector.css';

interface WheelSelectorProps {
  wheelsData: WheelCiclometricData[];
  selectedWheel: string | null;
  onWheelSelect: (wheelName: string) => void;
}

const WheelSelector: React.FC<WheelSelectorProps> = ({
  wheelsData,
  selectedWheel,
  onWheelSelect
}) => {
  return (
    <div className="wheel-selector">
      <h3>Seleziona una Ruota per vedere la Distanza Ciclometrica</h3>
      <div className="wheels-grid">
        {wheelsData.map(wheelData => {
          const isSelected = selectedWheel === wheelData.wheelName;
          const avgDistance = calculateAverageDistance(wheelData.distances);
          const displayName = getWheelDisplayName(wheelData.wheelName);
          
          return (
            <div
              key={wheelData.wheelName}
              className={`wheel-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onWheelSelect(wheelData.wheelName)}
            >
              <div className="wheel-header">
                <h4>{displayName}</h4>
                <span className="wheel-average">Avg: {avgDistance}</span>
              </div>
              
              <div className="wheel-numbers">
                {wheelData.polygonPoints.map(number => (
                  <span key={number} className="wheel-number">
                    {number}
                  </span>
                ))}
              </div>
              
              <div className="wheel-distances">
                <div className="distance-summary">
                  <span className="distance-count">
                    {wheelData.distances.length} distanze
                  </span>
                  <span className="minimal-count">
                    {wheelData.distances.filter(d => d.isMinimal).length} minimali
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <div className="selection-indicator">
                  ✓ Selezionata
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="wheel-selector-info">
        <p>
          <strong>Distanza Ciclometrica:</strong> La distanza più breve tra due numeri su un cerchio di 90 posizioni.
        </p>
        <p>
          <strong>Distanze Minimali:</strong> Distanze ≤ 15 considerate "vicine" nel cerchio ciclometrico.
        </p>
      </div>
    </div>
  );
};

export default WheelSelector;
