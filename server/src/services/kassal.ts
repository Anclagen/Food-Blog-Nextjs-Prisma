const BASE_URL = "https://kassal.app/api/v1";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setInCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function kassalFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiKey = process.env.KASSAL_API_KEY;
  if (!apiKey) throw new Error("KASSAL_API_KEY is not set");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Kassal API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export interface KassalProduct {
  id: number;
  name: string;
  brand: string | null;
  vendor: string | null;
  ean: string | null;
  image: string | null;
  current_price: number | null;
  current_unit_price: number | null;
  weight: number | null;
  weight_unit: string | null;
  store: Array<{ name: string; code: string; logo: string }>;
}

export interface KassalProductComparison {
  ean: string;
  products: Array<{
    id: string;
    name: string;
    brand: string;
    store: Array<{ name: string; code: string; logo: string }>;
    current_price: Array<{ price: number; unit_price: number; date: string }> | null;
    weight: number | null;
    weight_unit: string | null;
    image: string;
  }>;
  allergens: Array<{ code: string; display_name: string; contains: string }>;
}

export interface KassalBulkPriceStore {
  store: string;
  name: string;
  current_price: number | null;
  current_unit_price: number | null;
  current_unit_price_unit: string | null;
}

export interface KassalBulkPriceItem {
  ean: string;
  name: string;
  weight: number | null;
  weight_unit: string | null;
  stores: KassalBulkPriceStore[];
}

export async function searchProducts(query: string, size = 10): Promise<KassalProduct[]> {
  const cacheKey = `search:${query}:${size}`;
  const cached = getFromCache<KassalProduct[]>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    search: query,
    size: String(size),
    unique: "1",
    exclude_without_ean: "1",
  });

  const data = await kassalFetch<{ data: KassalProduct[] }>(`/products?${params}`);
  setInCache(cacheKey, data.data);
  return data.data;
}

export async function getProductByEan(ean: string): Promise<KassalProductComparison> {
  const cacheKey = `ean:${ean}`;
  const cached = getFromCache<KassalProductComparison>(cacheKey);
  if (cached) return cached;

  const data = await kassalFetch<{ data: KassalProductComparison }>(`/products/ean/${ean}`);
  setInCache(cacheKey, data.data);
  return data.data;
}

export async function getBulkPrices(eans: string[]): Promise<KassalBulkPriceItem[]> {
  const cacheKey = `bulk:${eans.sort().join(",")}`;
  const cached = getFromCache<KassalBulkPriceItem[]>(cacheKey);
  if (cached) return cached;

  const data = await kassalFetch<{ data: KassalBulkPriceItem[] }>("/products/prices-bulk", {
    method: "POST",
    body: JSON.stringify({ eans, aggregation: "min" }),
  });
  setInCache(cacheKey, data.data);
  return data.data;
}
