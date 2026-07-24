import { useState, useEffect, useRef } from 'react';
import { productsApi, type ProductsQuery } from '../lib/api';
import type { Product } from '../data/products';

interface State {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
}

/**
 * Fetches products from the API.
 * Falls back to the static data array if the server is unreachable
 * (so the UI still works when running `npm run dev` without the server).
 */
export function useProducts(query?: ProductsQuery): State {
  const [state, setState] = useState<State>({
    products: [],
    loading: true,
    error: null,
    total: 0,
  });

  // Stringify query so the effect re-runs only when it actually changes
  const queryKey = JSON.stringify(query ?? {});
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setState((s) => ({ ...s, loading: true, error: null }));

    productsApi.list(query)
      .then((res) => {
        if (ctrl.signal.aborted) return;
        setState({ products: res.items, total: res.total, loading: false, error: null });
      })
      .catch(async (err: Error) => {
        if (ctrl.signal.aborted) return;
        // Server not running — gracefully fall back to static data
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          const { products: staticProducts } = await import('../data/products');
          let fallback = staticProducts;
          if (query?.category && query.category !== 'All') {
            fallback = fallback.filter((p) => p.category === query.category);
          }
          if (query?.search) {
            const q = query.search.toLowerCase();
            fallback = fallback.filter(
              (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            );
          }
          if (query?.deals) {
            fallback = fallback.filter((p) => p.isDeal);
          }
          setState({ products: fallback, total: fallback.length, loading: false, error: null });
        } else {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      });

    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return state;
}
