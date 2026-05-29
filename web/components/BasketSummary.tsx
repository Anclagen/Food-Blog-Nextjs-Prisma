"use client";

import { useEffect, useRef, useState } from "react";
import { KassalBulkPriceItem, ShoppingListItem } from "@/lib/api";

const LS_KEY = "kassal_preferred_stores";

interface StoreTotal {
  store: string;
  name: string;
  total: number;
  missingCount: number;
}

interface BasketSummaryProps {
  items: ShoppingListItem[];
  priceData: KassalBulkPriceItem[];
  loading: boolean;
  onRefresh: () => void;
}

function loadPreferred(): Set<string> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw === null) return null;
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return null;
  }
}

function savePreferred(codes: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...codes]));
}

export default function BasketSummary({ items, priceData, loading, onRefresh }: BasketSummaryProps) {
  const eans = items.map((i) => i.ean).filter((e): e is string => !!e);
  const unpricedCount = items.filter((i) => !i.ean).length;
  const allTotals = eans.length > 0 ? computeTotals(priceData, items) : [];
  const allStoreCodes = allTotals.map((s) => ({ store: s.store, name: s.name }));

  const [preferred, setPreferred] = useState<Set<string> | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPreferred(loadPreferred());
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const storeTotals = preferred && preferred.size > 0
    ? allTotals.filter((s) => preferred.has(s.store))
    : allTotals;

  function toggleStore(code: string) {
    const current = preferred ?? new Set(allStoreCodes.map((s) => s.store));
    const next = new Set(current);
    if (next.has(code)) next.delete(code);
    else next.add(code);

    if (next.size === allStoreCodes.length) {
      setPreferred(null);
      localStorage.removeItem(LS_KEY);
    } else {
      setPreferred(next);
      savePreferred(next);
    }
  }

  function selectAll() {
    setPreferred(null);
    localStorage.removeItem(LS_KEY);
    setFilterOpen(false);
  }

  if (eans.length === 0 && unpricedCount === 0) return null;

  const isFiltered = preferred && preferred.size > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4" ref={panelRef}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Cheapest store</h2>
        <div className="flex items-center gap-2">
          {allStoreCodes.length > 1 && (
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                filterOpen || isFiltered
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {isFiltered ? `${preferred.size} store${preferred.size > 1 ? "s" : ""}` : "Filter stores"}
            </button>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-xs text-green-600 hover:underline disabled:opacity-50"
          >
            {loading ? "Updating…" : "Refresh"}
          </button>
        </div>
      </div>

      {filterOpen && allStoreCodes.length > 1 && (
        <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-600">Show stores</p>
            <button onClick={selectAll} className="text-xs text-green-600 hover:underline">All</button>
          </div>
          {allStoreCodes.map(({ store, name }) => {
            const checked = !preferred || preferred.has(store);
            return (
              <label key={store} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleStore(store)}
                  className="w-3.5 h-3.5 accent-green-600"
                />
                <span className="text-xs text-gray-700">{name}</span>
              </label>
            );
          })}
        </div>
      )}

      {loading && storeTotals.length === 0 ? (
        <p className="text-sm text-gray-400">Fetching prices…</p>
      ) : storeTotals.length === 0 && isFiltered ? (
        <p className="text-sm text-gray-400">No stores match your filter.</p>
      ) : (
        <ul className="space-y-2">
          {storeTotals.map((s, i) => (
            <li
              key={s.store}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                i === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                {s.missingCount > 0 && (
                  <p className="text-xs text-gray-400">
                    {s.missingCount} item{s.missingCount > 1 ? "s" : ""} not available
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${i === 0 ? "text-green-700" : "text-gray-700"}`}>
                  kr {s.total.toFixed(2)}
                </p>
                {i === 0 && (
                  <p className={`text-xs ${s.missingCount === 0 ? "text-green-600" : "text-orange-500"}`}>
                    {s.missingCount === 0 ? "Cheapest" : "Best available"}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {unpricedCount > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {unpricedCount} item{unpricedCount > 1 ? "s" : ""} without a barcode — not included in totals.
        </p>
      )}
    </div>
  );
}

function computeTotals(priceData: KassalBulkPriceItem[], items: ShoppingListItem[]): StoreTotal[] {
  const allStores = new Map<string, string>();
  for (const priceItem of priceData) {
    for (const s of priceItem.stores) {
      if (!allStores.has(s.store)) allStores.set(s.store, s.name);
    }
  }

  if (allStores.size === 0) return [];

  const storeMap = new Map<string, { name: string; total: number; missingCount: number }>();
  for (const [code, name] of allStores) {
    storeMap.set(code, { name, total: 0, missingCount: 0 });
  }

  for (const priceItem of priceData) {
    const qty = (items.find((i) => i.ean === priceItem.ean)?.quantity) ?? 1;
    const storePrice = new Map(priceItem.stores.map((s) => [s.store, s.current_price != null ? Number(s.current_price) : null]));

    for (const [code, entry] of storeMap) {
      if (storePrice.has(code)) {
        const price = storePrice.get(code);
        if (price != null) entry.total += price * qty;
        else entry.missingCount++;
      } else {
        entry.missingCount++;
      }
    }
  }

  return Array.from(storeMap.entries())
    .map(([store, v]) => ({ store, ...v }))
    .sort((a, b) => {
      if (a.missingCount === 0 && b.missingCount > 0) return -1;
      if (a.missingCount > 0 && b.missingCount === 0) return 1;
      return a.total - b.total;
    });
}
