import { useState, useMemo } from 'react';
import LottoTable from './components/LottoTable';
import ExtractionInfo from './components/ExtractionInfo';
import AmboControls from './components/AmboControls';
import DoubleAmbiDetails from './components/DoubleAmbiDetails';
import SelectedNumbers from './components/SelectedNumbers';
import CiclometricPage from './pages/CiclometricPage';
import { useLottoData } from './hooks/useLottoData';
import { findDoubleAmbi } from './services/amboAnalysis';
import './App.css';

function App() {
  const { extractions, loading, error } = useLottoData();
  const [highlightDoubleAmbi, setHighlightDoubleAmbi] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [showCiclometricPage, setShowCiclometricPage] = useState(false);

  // Calculate double ambi when extractions change
  const doubleAmbi = useMemo(() => {
    return findDoubleAmbi(extractions);
  }, [extractions]);

  const handleToggleHighlight = () => {
    setHighlightDoubleAmbi(!highlightDoubleAmbi);
  };

  const handleNumberClick = (number: number) => {
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
      } else {
        newSet.add(number);
      }
      return newSet;
    });
  };

  const clearSelectedNumbers = () => {
    setSelectedNumbers(new Set());
  };

  const handleShowCiclometric = () => {
    setShowCiclometricPage(true);
  };

  const handleBackFromCiclometric = () => {
    setShowCiclometricPage(false);
  };

  // Show ciclometric page if requested
  if (showCiclometricPage) {
    return (
      <CiclometricPage 
        onBack={handleBackFromCiclometric}
        initialSelectedNumbers={selectedNumbers}
        latestExtraction={extractions[0]}
        allExtractions={extractions}
      />
    );
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <h2>Caricamento estrazioni del lotto...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Errore nel caricamento</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (extractions.length === 0) {
    return (
      <div className="app">
        <div className="no-data-container">
          <h2>Nessun dato disponibile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🎲 Tabellone Estrazioni del Lotto</h1>
            <p>Dati reali delle ultime 50 estrazioni del lotto italiano</p>
          </div>
          <button 
            className="ciclometric-button"
            onClick={handleShowCiclometric}
          >
            🔄 Cerchio Ciclometrico
          </button>
        </div>
      </header>
      <ExtractionInfo latestExtraction={extractions[0]} />
      <AmboControls 
        highlightDoubleAmbi={highlightDoubleAmbi}
        onToggleHighlight={handleToggleHighlight}
        doubleAmbi={doubleAmbi}
      />
      <DoubleAmbiDetails 
        doubleAmbi={doubleAmbi}
        visible={highlightDoubleAmbi}
      />
      <SelectedNumbers 
        selectedNumbers={selectedNumbers}
        onNumberClick={handleNumberClick}
        onClearAll={clearSelectedNumbers}
        extractions={extractions}
      />
      <main>
        <LottoTable 
          extractions={extractions} 
          highlightDoubleAmbi={highlightDoubleAmbi}
          doubleAmbi={doubleAmbi}
          selectedNumbers={selectedNumbers}
          onNumberClick={handleNumberClick}
        />
      </main>
    </div>
  );
}

export default App;
