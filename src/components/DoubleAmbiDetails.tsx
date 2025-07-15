import React, { useState } from 'react';
import type { DoubleAmbo } from '../services/amboAnalysis';
import { LOTTO_WHEELS } from '../types/lotto';
import './DoubleAmbiDetails.css';

interface DoubleAmbiDetailsProps {
  doubleAmbi: DoubleAmbo[];
  visible: boolean;
}

const DoubleAmbiDetails: React.FC<DoubleAmbiDetailsProps> = ({ doubleAmbi, visible }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!visible || doubleAmbi.length === 0) return null;

  const getWheelDisplayName = (wheelKey: string) => {
    const wheel = LOTTO_WHEELS.find(w => w.name === wheelKey);
    return wheel ? wheel.displayName : wheelKey;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const topDoubleAmbi = doubleAmbi.slice(0, isExpanded ? doubleAmbi.length : 5);

  return (
    <div className="double-ambi-details">
      <div className="details-header">
        <h3>📊 Dettagli Doppi Ambi Trovati</h3>
        <p>Coppie di numeri uscite contemporaneamente su due o più ruote nella stessa estrazione</p>
      </div>
      
      <div className="ambi-list">
        {topDoubleAmbi.map((ambo) => (
          <div key={`${ambo.numbers[0]}-${ambo.numbers[1]}`} className="ambo-item">
            <div className="ambo-header">
              <span className="ambo-numbers">
                {ambo.numbers.map(num => (
                  <span key={num} className="ambo-number">
                    {num.toString().padStart(2, '0')}
                  </span>
                ))}
              </span>
              <span className="occurrence-count">
                {ambo.occurrences.length} volte
              </span>
            </div>
            
            <div className="occurrences">
              {ambo.occurrences.map((occurrence, occIndex) => (
                <div key={occIndex} className="occurrence">
                  <div className="occurrence-wheels">
                    {occurrence.wheels.map(wheel => (
                      <span key={wheel} className="wheel-badge">
                        {getWheelDisplayName(wheel)}
                      </span>
                    ))}
                  </div>
                  <span className="occurrence-date">
                    {formatDate(occurrence.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {doubleAmbi.length > 5 && (
        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Mostra meno' : `Mostra tutti i ${doubleAmbi.length} doppi ambi`}
        </button>
      )}
    </div>
  );
};

export default DoubleAmbiDetails;
