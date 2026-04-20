import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

import { CRM_CURRENCY, CRM_PORTFOLIO, CRM_WATCHLIST } from '@/constants/crm';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const DEMO_API_KEY = 'CG-VWfoRkwoeDVJg7eKHqDhJRCV';

type GlobalResponse = {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    market_cap_percentage: Record<string, number>;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
};

type TrendingResponse = {
  coins: {
    item: {
      coin_id: number;
      id: string;
      name: string;
      symbol: string;
      thumb: string;
      data?: {
        price: number;
        price_change_percentage_24h?: Record<string, number>;
      };
    };
  }[];
};

export type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  sparkline_in_7d?: {
    price: number[];
  };
};

type PortfolioRow = {
  id: string;
  symbol: string;
  name: string;
  units: number;
  bucket: string;
  price: number;
  value: number;
  image: string;
  change24h: number | null;
  sparkline?: number[];
};

type TrendingCoin = {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  price: number | null;
  change24h: number | null;
};

type CryptoCrmState = {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  global: GlobalResponse['data'] | null;
  markets: MarketCoin[];
  portfolio: PortfolioRow[];
  trending: TrendingCoin[];
  refetch: () => Promise<void>;
};

const CryptoCrmContext = createContext<CryptoCrmState | null>(null);

async function fetchCoinGecko<T>(path: string, params: Record<string, string>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': DEMO_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function buildPortfolioRows(markets: MarketCoin[]) {
  const coinMap = new Map(markets.map((coin) => [coin.id, coin]));

  return CRM_PORTFOLIO.map((holding) => {
    const coin = coinMap.get(holding.id);

    return {
      id: holding.id,
      symbol: holding.symbol,
      name: coin?.name ?? holding.id,
      units: holding.units,
      bucket: holding.bucket,
      price: coin?.current_price ?? 0,
      value: (coin?.current_price ?? 0) * holding.units,
      image: coin?.image ?? '',
      change24h: coin?.price_change_percentage_24h ?? null,
      sparkline: coin?.sparkline_in_7d?.price,
    };
  }).sort((left, right) => right.value - left.value);
}

export function CryptoCrmProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<CryptoCrmState>({
    isLoading: true,
    error: null,
    lastUpdated: null,
    global: null,
    markets: [],
    portfolio: [],
    trending: [],
    refetch: async () => undefined,
  });

  const load = useCallback(async () => {
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      const marketIds = Array.from(new Set([...CRM_PORTFOLIO.map((coin) => coin.id), ...CRM_WATCHLIST]));

      const [globalResponse, trendingResponse, marketResponse] = await Promise.all([
        fetchCoinGecko<GlobalResponse>('/global', {}),
        fetchCoinGecko<TrendingResponse>('/search/trending', {}),
        fetchCoinGecko<MarketCoin[]>('/coins/markets', {
          vs_currency: CRM_CURRENCY,
          ids: marketIds.join(','),
          order: 'market_cap_desc',
          per_page: '100',
          page: '1',
          sparkline: 'true',
          price_change_percentage: '24h',
        }),
      ]);

      const trending = trendingResponse.coins.map(({ item }) => ({
        id: item.id,
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        thumb: item.thumb,
        price: item.data?.price ?? null,
        change24h: item.data?.price_change_percentage_24h?.[CRM_CURRENCY] ?? null,
      }));

      setState({
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
        global: globalResponse.data,
        markets: marketResponse,
        portfolio: buildPortfolioRows(marketResponse),
        trending,
        refetch: load,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load CoinGecko data.';

      setState((current) => ({
        ...current,
        isLoading: false,
        error: message,
        refetch: load,
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return <CryptoCrmContext.Provider value={state}>{children}</CryptoCrmContext.Provider>;
}

export function useCryptoCrm() {
  const context = useContext(CryptoCrmContext);

  if (!context) {
    throw new Error('useCryptoCrm must be used within CryptoCrmProvider');
  }

  return context;
}
