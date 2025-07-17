import { useState, useMemo } from 'react';
import LottoTable from './components/LottoTable';
import ExtractionInfo from './components/ExtractionInfo';
import AmboControls from './components/AmboControls';
import DoubleAmbiDetails from './components/DoubleAmbiDetails';
import SelectedNumbers from './components/SelectedNumbers';
import CiclometricPage from './pages/CiclometricPage';
import { TeneLottoModal } from './components/TeneLottoModal';
import { useLottoData } from './hooks/useLottoData';
import { findDoubleAmbi } from './services/amboAnalysis';
import { generate10eLottoNumbers, type TeneLottoSuggestion } from './services/teneLottoService';
import './App.css';

function App() {
  const { extractions, loading, error, lastUpdated, refresh } = useLottoData();
  const [highlightDoubleAmbi, setHighlightDoubleAmbi] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [showCiclometricPage, setShowCiclometricPage] = useState(false);
  const [show10eLottoModal, setShow10eLottoModal] = useState(false);
  const [teneLottoSuggestion, setTeneLottoSuggestion] = useState<TeneLottoSuggestion | null>(null);

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

  const handleShow10eLotto = () => {
    if (extractions.length > 0) {
      const suggestion = generate10eLottoNumbers(extractions);
      setTeneLottoSuggestion(suggestion);
      setShow10eLottoModal(true);
    }
  };

  const handleClose10eLotto = () => {
    setShow10eLottoModal(false);
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

  if (loading && extractions.length === 0) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>🎲 Caricamento dati del lotto...</h2>
          <p>Verificando nuove estrazioni...</p>
        </div>
      </div>
    );
  }

  if (error && extractions.length === 0) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>❌ Errore nel caricamento</h2>
          <p>{error}</p>
          <button onClick={refresh} className="retry-button">
            🔄 Riprova
          </button>
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
          <div className="header-controls">
            <button 
              className="tenelotto-button"
              onClick={handleShow10eLotto}
              disabled={loading || extractions.length === 0}
            >
              🎯 10eLotto
            </button>
            <button 
              className="ciclometric-button"
              onClick={handleShowCiclometric}
            >
              🔄 Cerchio Ciclometrico
            </button>
            <button 
              onClick={refresh}
              className="refresh-button"
              disabled={loading}
            >
              {loading ? '🔄' : '↻'} Aggiorna
            </button>
          </div>
        </div>
        {lastUpdated && (
          <div className="update-info">
            <small>
              Ultimo aggiornamento: {lastUpdated.toLocaleString('it-IT')}
              {loading && ' - Verificando nuovi dati...'}
            </small>
          </div>
        )}
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
      
      {/* 10eLotto Modal */}
      {teneLottoSuggestion && (
        <TeneLottoModal
          suggestion={teneLottoSuggestion}
          isOpen={show10eLottoModal}
          onClose={handleClose10eLotto}
        />
      )}
    </div>
  );
}

export default App;
