import React from 'react';
import type { LottoExtraction } from '../types/lotto';
import './ExtractionInfo.css';

interface ExtractionInfoProps {
  latestExtraction: LottoExtraction;
}

const ExtractionInfo: React.FC<ExtractionInfoProps> = ({ latestExtraction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="extraction-info">
      <div className="info-card">
        <h3>📅 Ultima Estrazione</h3>
        <p className="extraction-date">{formatDate(latestExtraction.date)}</p>
        <div className="info-stats">
          <div className="stat">
            <span className="stat-label">Estrazioni mostrate:</span>
            <span className="stat-value">50</span>
          </div>
          <div className="stat">
            <span className="stat-label">Ruote attive:</span>
            <span className="stat-value">11</span>
          </div>
          <div className="stat">
            <span className="stat-label">Numeri per ruota:</span>
            <span className="stat-value">5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionInfo;
