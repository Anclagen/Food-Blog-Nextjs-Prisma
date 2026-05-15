"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { lists as listsApi, ShoppingListItem, SubstitutionSetting, AddItemPayload } from "@/lib/api";
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

  async function handleRemove(item: ShoppingListItem) {
    await listsApi.removeItem(id, item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
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
                    onCheck={(c) => handleCheck(item, c)}
                    onSubstitution={(s) => handleSubstitution(item, s)}
                    onRemove={() => handleRemove(item)}
                  />
                ))}
              </ul>

              {checked.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 px-1 mb-1">In basket</p>
                  <ul className="space-y-1">
                    {checked.map((item) => (
                      <ListItem
                        key={item.id}
                        item={item}
                        onCheck={(c) => handleCheck(item, c)}
                        onSubstitution={(s) => handleSubstitution(item, s)}
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
          <BasketSummary items={unchecked} />
        </div>
      </div>
    </div>
  );
}
