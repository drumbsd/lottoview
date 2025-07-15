import React from 'react';
import type { LottoExtraction } from '../types/lotto';
import { LOTTO_WHEELS } from '../types/lotto';
import { getAmbiForWheelExtraction, isDoubleAmbo, type DoubleAmbo } from '../services/amboAnalysis';
import './LottoTable.css';

interface LottoTableProps {
  extractions: LottoExtraction[];
  highlightDoubleAmbi: boolean;
  doubleAmbi: DoubleAmbo[];
  selectedNumbers: Set<number>;
  onNumberClick: (number: number) => void;
}

const LottoTable: React.FC<LottoTableProps> = ({ 
  extractions, 
  highlightDoubleAmbi, 
  doubleAmbi, 
  selectedNumbers, 
  onNumberClick 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isNumberInDoubleAmbo = (number: number, wheelNumbers: number[]): boolean => {
    if (!highlightDoubleAmbi || !wheelNumbers) return false;
    
    const ambi = getAmbiForWheelExtraction(wheelNumbers);
    return ambi.some(ambo => {
      const includesNumber = ambo.includes(number);
      const isDouble = isDoubleAmbo(ambo, doubleAmbi);
      return includesNumber && isDouble;
    });
  };

  return (
    <div className="lotto-table-container">
      <div className="table-wrapper">
        <table className="lotto-table">
          <thead>
            <tr>
              <th className="date-header">Data Estrazione</th>
              {LOTTO_WHEELS.map(wheel => (
                <th key={wheel.name} className="wheel-header">
                  {wheel.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {extractions.map((extraction, index) => (
              <tr key={extraction.date} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="date-cell">
                  {formatDate(extraction.date)}
                </td>
                {LOTTO_WHEELS.map(wheel => (
                  <td key={wheel.name} className="numbers-cell">
                    <div className="numbers-container">
                      {extraction.results[wheel.name]?.map((number, numIndex) => {
                        const isInDoubleAmbo = isNumberInDoubleAmbo(number, extraction.results[wheel.name]);
                        const isSelected = selectedNumbers.has(number);
                        
                        return (
                          <span 
                            key={numIndex} 
                            className={`lottery-number ${isInDoubleAmbo && highlightDoubleAmbi ? 'double-ambo-highlight' : ''} ${isSelected ? 'selected-number' : ''}`}
                            onClick={() => onNumberClick(number)}
                          >
                            {number.toString().padStart(2, '0')}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LottoTable;
