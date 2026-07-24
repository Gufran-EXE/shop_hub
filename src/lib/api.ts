/**
 * Typed API client — all calls go to /api/* which Vite proxies
 * to the Express server during dev, and a real server in production.
 */
import type { Product } from '../data/products';

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// ── Generic fetch wrapper ──────────────────────────────────────────────────
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch (e) {
    // Network error — server not reachable
    throw new Error('Failed to fetch');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

// ── Products ───────────────────────────────────────────────────────────────
export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductsQuery {
  category?: string;
  search?: string;
  deals?: boolean;
  limit?: number;
  page?: number;
}

export const productsApi = {
  list(query?: ProductsQuery): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (query?.category && query.category !== 'All') params.set('category', query.category);
    if (query?.search)   params.set('search', query.search);
    if (query?.deals)    params.set('deals', 'true');
    if (query?.limit)    params.set('limit', String(query.limit));
    if (query?.page)     params.set('page', String(query.page));
    const qs = params.toString();
    return request<ProductsResponse>(`/products${qs ? `?${qs}` : ''}`);
  },

  get(id: string): Promise<Product> {
    return request<Product>(`/products/${id}`);
  },
};

// ── Orders ─────────────────────────────────────────────────────────────────
export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod?: string;
}

export interface OrderResponse {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
}

export const ordersApi = {
  create(payload: CreateOrderPayload): Promise<OrderResponse> {
    return request<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  get(orderNumber: string): Promise<OrderResponse> {
    return request<OrderResponse>(`/orders/${orderNumber}`);
  },
};
