import { useState, useEffect } from 'react';
import type { LottoExtraction } from '../types/lotto';
import { fetchRealLottoData, realLottoExtractions } from '../services/lottoService';

interface UseLottoDataReturn {
  extractions: LottoExtraction[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useLottoData = (): UseLottoDataReturn => {
  const [extractions, setExtractions] = useState<LottoExtraction[]>(realLottoExtractions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchRealLottoData();
      setExtractions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati');
      console.error('Error refreshing lotto data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data if needed
    if (extractions.length === 0) {
      refreshData();
    }
  }, []);

  return {
    extractions,
    loading,
    error,
    refreshData
  };
};
