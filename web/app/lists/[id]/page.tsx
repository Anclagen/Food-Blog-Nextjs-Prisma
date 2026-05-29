"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { lists as listsApi, products as productsApi, ShoppingListItem, SubstitutionSetting, AddItemPayload, KassalBulkPriceItem } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import ProductSearch from "@/components/ProductSearch";
import ListItem from "@/components/ListItem";
import BasketSummary from "@/components/BasketSummary";

export default function ListPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState<KassalBulkPriceItem[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [clearingChecked, setClearingChecked] = useState(false);

  const fetchList = useCallback(async () => {
    const { data } = await listsApi.getAll();
    const list = data.find((l) => l.id === id);
    if (!list) { router.replace("/"); return; }
    setTitle(list.title);
    setItems(list.items ?? []);
  }, [id, router]);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    fetchList().finally(() => setLoading(false));
  }, [fetchList, router]);

  const eans = items.map((i) => i.ean).filter((e): e is string => !!e);

  const fetchPrices = useCallback(async () => {
    if (eans.length === 0) { setPriceData([]); return; }
    setPricesLoading(true);
    try {
      const { data } = await productsApi.bulkPrices(eans);
      setPriceData(data);
    } catch {
      // best-effort
    } finally {
      setPricesLoading(false);
    }
  }, [eans.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  async function handleAddItem(payload: AddItemPayload) {
    const { data } = await listsApi.addItem(id, payload);
    setItems((prev) => [...prev, data]);
  }

  async function handleCheck(item: ShoppingListItem, checked: boolean) {
    const { data } = await listsApi.updateItem(id, item.id, { checked });
    setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)));
  }

  async function handleSubstitution(item: ShoppingListItem, setting: SubstitutionSetting) {
    const { data } = await listsApi.updateItem(id, item.id, { substitutionSetting: setting });
    setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)));
  }

  async function handleQuantityChange(item: ShoppingListItem, quantity: number) {
    const { data } = await listsApi.updateItem(id, item.id, { quantity });
    setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)));
  }

  async function handleRemove(item: ShoppingListItem) {
    await listsApi.removeItem(id, item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function handleClearChecked() {
    const checkedItems = items.filter((i) => i.checked);
    if (checkedItems.length === 0) return;
    setClearingChecked(true);
    try {
      await Promise.all(checkedItems.map((item) => listsApi.removeItem(id, item.id)));
      setItems((prev) => prev.filter((i) => !i.checked));
    } finally {
      setClearingChecked(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 flex-1 truncate">{title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <ProductSearch onAdd={handleAddItem} />

          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Search for a product above to add it to your list.
            </p>
          ) : (
            <>
              <ul className="space-y-1">
                {unchecked.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    cheapestPrice={cheapestFor(item.ean, priceData)}
                    onCheck={(c) => handleCheck(item, c)}
                    onSubstitution={(s) => handleSubstitution(item, s)}
                    onQuantityChange={(q) => handleQuantityChange(item, q)}
                    onRemove={() => handleRemove(item)}
                  />
                ))}
              </ul>

              {checked.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-1 mb-1">
                    <p className="text-xs text-gray-400">In basket</p>
                    <button
                      onClick={handleClearChecked}
                      disabled={clearingChecked}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {clearingChecked ? "Clearing…" : "Clear all"}
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {checked.map((item) => (
                      <ListItem
                        key={item.id}
                        item={item}
                        onCheck={(c) => handleCheck(item, c)}
                        onSubstitution={(s) => handleSubstitution(item, s)}
                        onQuantityChange={(q) => handleQuantityChange(item, q)}
                        onRemove={() => handleRemove(item)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="md:sticky md:top-8 self-start">
          <BasketSummary items={unchecked} priceData={priceData} loading={pricesLoading} onRefresh={fetchPrices} />
        </div>
      </div>
    </div>
  );
}

function cheapestFor(ean: string | null, priceData: KassalBulkPriceItem[]) {
  if (!ean) return null;
  const item = priceData.find((p) => p.ean === ean);
  if (!item) return null;
  let best: { price: number; store: string } | null = null;
  for (const s of item.stores) {
    const price = Number(s.current_price);
    if (!isNaN(price) && s.current_price != null && (!best || price < best.price)) {
      best = { price, store: s.name };
    }
  }
  return best;
}
