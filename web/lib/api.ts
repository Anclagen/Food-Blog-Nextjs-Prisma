const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorised");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Auth
export const auth = {
  register: (email: string, name: string, password: string) =>
    request<{ data: User; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    }),
  login: (email: string, password: string) =>
    request<{ data: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// Shopping lists
export const lists = {
  getAll: () => request<{ data: ShoppingList[] }>("/api/lists"),
  create: (title: string) =>
    request<{ data: ShoppingList }>("/api/lists", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),
  delete: (id: string) => request<void>(`/api/lists/${id}`, { method: "DELETE" }),
  addItem: (listId: string, item: AddItemPayload) =>
    request<{ data: ShoppingListItem }>(`/api/lists/${listId}/items`, {
      method: "POST",
      body: JSON.stringify(item),
    }),
  updateItem: (listId: string, itemId: string, patch: UpdateItemPayload) =>
    request<{ data: ShoppingListItem }>(`/api/lists/${listId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  removeItem: (listId: string, itemId: string) =>
    request<void>(`/api/lists/${listId}/items/${itemId}`, { method: "DELETE" }),
};

// Products
export const products = {
  search: (q: string) => request<{ data: KassalProduct[] }>(`/api/products/search?q=${encodeURIComponent(q)}`),
  getByEan: (ean: string) => request<{ data: KassalProductComparison }>(`/api/products/ean/${ean}`),
  bulkPrices: (eans: string[]) =>
    request<{ data: KassalBulkPriceItem[] }>("/api/products/bulk-prices", {
      method: "POST",
      body: JSON.stringify({ eans }),
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  items?: ShoppingListItem[];
  createdAt: string;
}

export type SubstitutionSetting = "allow_any" | "no_store_brand" | "exact_only";

export interface ShoppingListItem {
  id: string;
  listId: string;
  ean: string | null;
  name: string;
  image: string | null;
  quantity: number;
  substitutionSetting: SubstitutionSetting;
  checked: boolean;
}

export interface AddItemPayload {
  name: string;
  ean?: string;
  kassalProductId?: number;
  image?: string;
  quantity?: number;
}

export interface UpdateItemPayload {
  checked?: boolean;
  substitutionSetting?: SubstitutionSetting;
  quantity?: number;
}

export interface KassalProduct {
  id: number;
  name: string;
  brand: string | null;
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
    image: string;
  }>;
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
  stores: KassalBulkPriceStore[];
}
