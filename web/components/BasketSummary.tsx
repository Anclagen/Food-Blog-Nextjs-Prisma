"use client";

import { useEffect, useState, useCallback } from "react";
import { products as productsApi, KassalBulkPriceItem, ShoppingListItem } from "@/lib/api";

interface StoreTotal {
  store: string;
  name: string;
  total: number;
  missingCount: number;
}

interface BasketSummaryProps {
  items: ShoppingListItem[];
}

export default function BasketSummary({ items }: BasketSummaryProps) {
  const [storeTotals, setStoreTotals] = useState<StoreTotal[]>([]);
  const [loading, setLoading] = useState(false);

  const eans = items.map((i) => i.ean).filter((e): e is string => !!e);

  const fetchPrices = useCallback(async () => {
    if (eans.length === 0) {
      setStoreTotals([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await productsApi.bulkPrices(eans);
      setStoreTotals(computeTotals(data, items));
    } catch {
      // silently skip — prices are best-effort
    } finally {
      setLoading(false);
    }
  }, [eans.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  if (eans.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Cheapest store</h2>
        <button
          onClick={fetchPrices}
          disabled={loading}
          className="text-xs text-green-600 hover:underline disabled:opacity-50"
        >
          {loading ? "Updating…" : "Refresh"}
        </button>
      </div>

      {loading && storeTotals.length === 0 ? (
        <p className="text-sm text-gray-400">Fetching prices…</p>
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
                  <p className="text-xs text-gray-400">{s.missingCount} item{s.missingCount > 1 ? "s" : ""} not available</p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${i === 0 ? "text-green-700" : "text-gray-700"}`}>
                  kr {s.total.toFixed(2)}
                </p>
                {i === 0 && <p className="text-xs text-green-600">Cheapest</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function computeTotals(priceData: KassalBulkPriceItem[], items: ShoppingListItem[]): StoreTotal[] {
  const storeMap = new Map<string, { name: string; total: number; missingCount: number }>();

  for (const priceItem of priceData) {
    const listItem = items.find((i) => i.ean === priceItem.ean);
    const qty = listItem?.quantity ?? 1;

    for (const store of priceItem.stores) {
      if (!storeMap.has(store.store)) {
        storeMap.set(store.store, { name: store.name, total: 0, missingCount: 0 });
      }
      const entry = storeMap.get(store.store)!;
      if (store.current_price != null) {
        entry.total += store.current_price * qty;
      } else {
        entry.missingCount++;
      }
    }
  }

  return Array.from(storeMap.values())
    .map((v, i) => ({ store: Array.from(storeMap.keys())[i], ...v }))
    .sort((a, b) => a.total - b.total);
}
