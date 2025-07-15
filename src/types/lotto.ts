// Types for Italian lottery data
export interface LottoWheel {
  name: string;
  displayName: string;
}

export interface LottoExtraction {
  date: string;
  results: Record<string, number[]>; // wheel name -> array of 5 numbers
}

export interface LottoData {
  extractions: LottoExtraction[];
}

// Italian lottery wheels
export const LOTTO_WHEELS: LottoWheel[] = [
  { name: 'bari', displayName: 'Bari' },
  { name: 'cagliari', displayName: 'Cagliari' },
  { name: 'firenze', displayName: 'Firenze' },
  { name: 'genova', displayName: 'Genova' },
  { name: 'milano', displayName: 'Milano' },
  { name: 'napoli', displayName: 'Napoli' },
  { name: 'palermo', displayName: 'Palermo' },
  { name: 'roma', displayName: 'Roma' },
  { name: 'torino', displayName: 'Torino' },
  { name: 'venezia', displayName: 'Venezia' },
  { name: 'nazionale', displayName: 'Nazionale' },
];
