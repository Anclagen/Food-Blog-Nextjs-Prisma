"use client";

import { KassalBulkPriceItem, ShoppingListItem } from "@/lib/api";

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

export default function BasketSummary({ items, priceData, loading, onRefresh }: BasketSummaryProps) {
  const eans = items.map((i) => i.ean).filter((e): e is string => !!e);
  const storeTotals = eans.length > 0 ? computeTotals(priceData, items) : [];

  if (eans.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Cheapest store</h2>
        <button
          onClick={onRefresh}
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
    </div>
  );
}

function computeTotals(priceData: KassalBulkPriceItem[], items: ShoppingListItem[]): StoreTotal[] {
  // Collect every store that appears anywhere across all products first.
  // This ensures stores that don't stock a particular item still receive a
  // missingCount increment for it, rather than silently appearing cheaper.
  const allStores = new Map<string, string>(); // store code → display name
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
