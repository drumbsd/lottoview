import React from 'react';
import { getPolygonPath } from '../services/ciclometricService';
import './CiclometricCircle.css';

interface CiclometricCircleProps {
  selectedNumbers?: Set<number>;
  onNumberClick?: (number: number) => void;
  highlightedNumbers?: Set<number>;
  polygonNumbers?: number[];
  showPolygon?: boolean;
}

const CiclometricCircle: React.FC<CiclometricCircleProps> = ({
  selectedNumbers = new Set(),
  onNumberClick,
  highlightedNumbers = new Set(),
  polygonNumbers = [],
  showPolygon = false
}) => {
  // Calculate position for each number on the circle
  const getNumberPosition = (number: number) => {
    // 90 numbers arranged in a circle
    const angle = ((number - 1) * 360) / 90;
    const angleRad = (angle * Math.PI) / 180;
    
    // Circle radius
    const radius = 280;
    
    // Calculate x, y coordinates
    const x = radius * Math.cos(angleRad - Math.PI / 2);
    const y = radius * Math.sin(angleRad - Math.PI / 2);
    
    return { x, y, angle };
  };

  const handleNumberClick = (number: number) => {
    if (onNumberClick) {
      onNumberClick(number);
    }
  };

  // Create polygon path for the selected wheel
  const polygonPath = showPolygon && polygonNumbers.length === 5 
    ? getPolygonPath(polygonNumbers) 
    : null;

  return (
    <div className="ciclometric-container">
      <h2>Cerchio Ciclometrico del Lotto</h2>
      <div className="circle-wrapper">
        <svg 
          viewBox="-350 -350 700 700" 
          className="ciclometric-circle"
        >
          {/* Background circle */}
          <circle
            cx="0"
            cy="0"
            r="280"
            fill="none"
            stroke="#ddd"
            strokeWidth="2"
          />
          
          {/* Center point */}
          <circle
            cx="0"
            cy="0"
            r="5"
            fill="#333"
          />
          
          {/* Numbers around the circle */}
          {Array.from({ length: 90 }, (_, i) => i + 1).map(number => {
            const { x, y } = getNumberPosition(number);
            const isSelected = selectedNumbers.has(number);
            const isHighlighted = highlightedNumbers.has(number);
            
            return (
              <g key={number}>
                {/* Number background circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill={isSelected ? "#ff6b6b" : isHighlighted ? "#4ecdc4" : "#fff"}
                  stroke={isSelected ? "#ff5252" : isHighlighted ? "#26a69a" : "#666"}
                  strokeWidth="2"
                  className={`number-circle ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={() => handleNumberClick(number)}
                />
                
                {/* Number text */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isSelected || isHighlighted ? "#fff" : "#333"}
                  className="number-text"
                  onClick={() => handleNumberClick(number)}
                >
                  {number}
                </text>
              </g>
            );
          })}
          
          {/* Quadrant lines for reference */}
          <line x1="0" y1="-280" x2="0" y2="280" stroke="#eee" strokeWidth="1" />
          <line x1="-280" y1="0" x2="280" y2="0" stroke="#eee" strokeWidth="1" />
          
          {/* Ciclometric polygon for selected wheel */}
          {polygonPath && (
            <path
              d={polygonPath}
              fill="rgba(255, 107, 107, 0.2)"
              stroke="#ff6b6b"
              strokeWidth="3"
              className="ciclometric-polygon"
            />
          )}
          
          {/* Decade markers */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(decade => {
            const { x, y } = getNumberPosition(decade);
            return (
              <circle
                key={`decade-${decade}`}
                cx={x}
                cy={y}
                r="20"
                fill="none"
                stroke="#ff9800"
                strokeWidth="2"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="circle-legend">
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Numeri selezionati</span>
        </div>
        <div className="legend-item">
          <div className="legend-color highlighted"></div>
          <span>Numeri evidenziati</span>
        </div>
        <div className="legend-item">
          <div className="legend-color decade"></div>
          <span>Decine (10, 20, 30...)</span>
        </div>
      </div>
      
      <div className="circle-info">
        <p>Clicca sui numeri per selezionarli. I numeri sono disposti in ordine crescente in senso orario.</p>
        <p>Le decine sono evidenziate con cerchi arancioni per facilitare l'orientamento.</p>
      </div>
    </div>
  );
};

export default CiclometricCircle;
