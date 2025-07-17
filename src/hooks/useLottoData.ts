import { useState, useEffect } from 'react';
import type { LottoExtraction } from '../types/lotto';
import { fetchLottoData } from '../services/lottoService';

interface UseLottoDataReturn {
  extractions: LottoExtraction[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export const useLottoData = (): UseLottoDataReturn => {
  const [extractions, setExtractions] = useState<LottoExtraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLottoData();
      setExtractions(data);
      setLastUpdated(new Date());
      
      // Store last update time in localStorage
      localStorage.setItem('lottoview_last_update', Date.now().toString());
    } catch (err) {
      setError('Errore nel caricamento dei dati del lotto');
      console.error('Error loading lotto data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadData();
  };

  useEffect(() => {
    // Check if we need to update based on time
    const shouldUpdate = () => {
      const lastUpdate = localStorage.getItem('lottoview_last_update');
      if (!lastUpdate) return true;
      
      const timeDiff = Date.now() - parseInt(lastUpdate);
      const hoursSinceUpdate = timeDiff / (1000 * 60 * 60);
      
      // Update if more than 2 hours have passed
      return hoursSinceUpdate > 2;
    };

    // Load data on mount or if update needed
    if (shouldUpdate()) {
      loadData();
    } else {
      // Load cached data if available but still trigger a background check
      setLoading(false);
      loadData();
    }

    // Set up interval to check for updates every 30 minutes
    const interval = setInterval(() => {
      if (shouldUpdate()) {
        console.log('🔄 Auto-refreshing lottery data...');
        loadData();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    extractions,
    loading,
    error,
    lastUpdated,
    refresh
  };
};
