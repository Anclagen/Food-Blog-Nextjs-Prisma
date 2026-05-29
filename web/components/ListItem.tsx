"use client";

import { ShoppingListItem, SubstitutionSetting } from "@/lib/api";

const SUBSTITUTION_LABELS: Record<SubstitutionSetting, string> = {
  allow_any: "Any brand",
  no_store_brand: "No own-brand",
  exact_only: "Exact item",
};

interface ListItemProps {
  item: ShoppingListItem;
  cheapestPrice?: { price: number; store: string } | null;
  onCheck: (checked: boolean) => void;
  onSubstitution: (setting: SubstitutionSetting) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function ListItem({ item, cheapestPrice, onCheck, onSubstitution, onQuantityChange, onRemove }: ListItemProps) {
  return (
    <li className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${item.checked ? "bg-gray-50 opacity-60" : "bg-white"}`}>
      <input
        type="checkbox"
        checked={item.checked}
        onChange={(e) => onCheck(e.target.checked)}
        className="w-4 h-4 rounded accent-green-600 shrink-0"
      />

      <div className="w-8 h-8 shrink-0 rounded bg-gray-100 overflow-hidden">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" className="w-full h-full object-contain" loading="lazy"
            onError={(e) => { e.currentTarget.hidden = true; }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${item.checked ? "line-through text-gray-400" : "text-gray-900"}`}>
          {item.name}
          {item.quantity > 1 && <span className="text-gray-400 font-normal"> ×{item.quantity}</span>}
        </p>
        {cheapestPrice && !item.checked && (
          <p className="text-xs font-medium text-green-700">
            kr {cheapestPrice.price.toFixed(2)}
            {item.quantity > 1 && (
              <span className="font-normal"> ×{item.quantity} = kr {(cheapestPrice.price * item.quantity).toFixed(2)}</span>
            )}
            <span className="font-normal text-gray-400"> · {cheapestPrice.store}</span>
          </p>
        )}
        {!item.checked && (
          <div className="flex items-center gap-1 mt-0.5">
            {(["allow_any", "no_store_brand", "exact_only"] as SubstitutionSetting[]).map((s) => (
              <button
                key={s}
                onClick={() => onSubstitution(s)}
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  item.substitutionSetting === s
                    ? "bg-green-100 text-green-700 font-medium"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {SUBSTITUTION_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 text-sm font-medium leading-none"
        >
          −
        </button>
        <span className="w-5 text-center text-sm text-gray-700">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.quantity + 1)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium leading-none"
        >
          +
        </button>
      </div>

      <button onClick={onRemove} className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}
