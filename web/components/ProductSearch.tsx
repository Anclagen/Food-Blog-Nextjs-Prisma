"use client";

import { useState, useRef, useCallback } from "react";
import { products as productsApi, KassalProduct, AddItemPayload } from "@/lib/api";

interface ProductSearchProps {
  onAdd: (item: AddItemPayload) => Promise<void>;
}

export default function ProductSearch({ onAdd }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KassalProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await productsApi.search(q.trim());
        setResults(data.filter((p) => p.current_price !== null));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    search(e.target.value);
  }

  async function handleAdd(product: KassalProduct) {
    setAdding(product.id);
    try {
      await onAdd({
        name: product.name,
        ean: product.ean ?? undefined,
        kassalProductId: product.id,
        image: product.image ?? undefined,
      });
      setQuery("");
      setResults([]);
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-green-500">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for a product…"
          className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
        />
        {searching && (
          <svg className="w-4 h-4 text-gray-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
          {results.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50">
              <div className="w-9 h-9 shrink-0 rounded bg-gray-100 overflow-hidden">
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="w-full h-full object-contain" loading="lazy"
                    onError={(e) => { e.currentTarget.hidden = true; }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {p.brand ?? ""}
                  {p.current_price != null ? ` · kr ${p.current_price.toFixed(2)}` : ""}
                  {p.current_unit_price != null && p.weight_unit
                    ? ` · kr ${p.current_unit_price.toFixed(2)}/${p.weight_unit}`
                    : ""}
                </p>
              </div>
              <button
                onClick={() => handleAdd(p)}
                disabled={adding === p.id}
                className="shrink-0 text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {adding === p.id ? "Adding…" : "Add"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 3 && !searching && results.length === 0 && (
        <p className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 text-sm text-gray-500">
          No results — try a shorter word or check your spelling.
        </p>
      )}
    </div>
  );
}
