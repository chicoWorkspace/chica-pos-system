"use client";

import { whiteTheme as theme } from "@/lib/theme/white-theme";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const cls = theme.classes;

const quantityItems = [
  { key: "coffee-beans", label: "招牌綜合咖啡豆", min: 0, max: 99, defaultValue: 2 },
  { key: "filter-paper", label: "手沖濾紙組", min: 0, max: 99, defaultValue: 1 },
  { key: "cold-brew-bottle", label: "冷萃隨行瓶", min: 0, max: 20, defaultValue: 0 },
] as const;

export default function QuantityAdjustDemo() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(quantityItems.map((item) => [item.key, item.defaultValue])),
  );
  const adjustQuantity = (key: string, amount: number) => {
    setQuantities((prev) => {
      const current = prev[key] ?? 0;
      const item = quantityItems.find((i) => i.key === key);
      if (!item) return prev;
      const nextValue = Math.max(item.min, Math.min(item.max, current + amount));
      return { ...prev, [key]: nextValue };
    });
  };

  return (
    <div className="space-y-3">
      <div className={`text-sm font-medium ${cls.text.sub}`}>購物車數量調整</div>
      {quantityItems.map((item) => {
        const value = quantities[item.key] ?? 0;
        const canDecrease = value > item.min;
        const canIncrease = value < item.max;

        return (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-2xl border border-black/[0.10] bg-white px-3 py-2"
          >
            <div>
              <div className={`text-sm font-medium ${cls.text.title}`}>{item.label}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`${item.label} 減少數量`}
                disabled={!canDecrease}
                className={`${cls.button.iconSecondary} h-9 w-9 p-0 disabled:cursor-not-allowed disabled:opacity-40`}
                onClick={() => adjustQuantity(item.key, -1)}
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="min-w-[56px] rounded-xl border border-black/[0.08] bg-[#F0EEE9] px-3 py-2 text-center text-sm font-semibold text-[#1A1917]">
                {value}
              </div>

              <button
                type="button"
                aria-label={`${item.label} 增加數量`}
                disabled={!canIncrease}
                className={`${cls.button.iconSecondary} h-9 w-9 p-0 disabled:cursor-not-allowed disabled:opacity-40`}
                onClick={() => adjustQuantity(item.key, 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}