"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { lists as listsApi, ShoppingList } from "@/lib/api";
import { isLoggedIn, getStoredUser, clearSession } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [myLists, setMyLists] = useState<ShoppingList[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    listsApi.getAll().then(({ data }) => setMyLists(data)).finally(() => setLoading(false));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const { data } = await listsApi.create(newTitle.trim());
      setMyLists((prev) => [data, ...prev]);
      setNewTitle("");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    await listsApi.delete(id);
    setMyLists((prev) => prev.filter((l) => l.id !== id));
  }

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Shopping lists</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-700">
            Sign out
          </button>
        </div>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New list name…"
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={creating || !newTitle.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create"}
        </button>
      </form>

      {myLists.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-12">
          No lists yet. Create one above.
        </p>
      ) : (
        <ul className="space-y-2">
          {myLists.map((list) => (
            <li key={list.id} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
              <Link href={`/lists/${list.id}`} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{list.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(list.createdAt).toLocaleDateString("en-GB")}
                </p>
              </Link>
              <button
                onClick={() => handleDelete(list.id)}
                className="ml-3 shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
