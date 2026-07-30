"use client";

import { whiteTheme as theme } from "@/lib/theme/white-theme";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const cls = theme.classes;
const colors = theme.tokens.colors;

const quantityItems = [
  { key: "熱銷豆包", label: "熱銷豆包", min: 0, max: 99, defaultValue: 2 },
  { key: "濾紙組", label: "濾紙組", min: 0, max: 99, defaultValue: 1 },
  { key: "禮盒加購", label: "禮盒加購", min: 0, max: 20, defaultValue: 0 },
] as const;

export default function QuantityAdjustDemo() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(quantityItems.map((item) => [item.key, item.defaultValue])),
  );

  return (
    <div className="space-y-3">
      <div className={`text-sm ${cls.text.sub}`}>數量調整範例</div>
      {quantityItems.map((item) => {
        const value = quantities[item.key] ?? 0;
        const canDecrease = value > item.min;
        const canIncrease = value < item.max;

        return (
          <div
            key={item.key}
            className={`flex items-center justify-between px-3 py-2 ${cls.section.mutedBlock}`}
          >
            <div>
              <div className={`text-sm ${cls.text.strong}`}>{item.label}</div>
              <div className={`text-xs ${cls.text.muted}`}>
                範圍 {item.min} - {item.max}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`${item.label} 減少數量`}
                disabled={!canDecrease}
                className={`${cls.button.iconSecondary} h-9 w-9 p-0 disabled:cursor-not-allowed disabled:opacity-40`}
                onClick={() =>
                  setQuantities((prev) => ({
                    ...prev,
                    [item.key]: Math.max(item.min, (prev[item.key] ?? 0) - 1),
                  }))
                }
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className={`min-w-[56px] rounded-xl px-3 py-2 text-center text-sm font-semibold ${cls.input.staticField}`}>
                {value}
              </div>

              <button
                type="button"
                aria-label={`${item.label} 增加數量`}
                disabled={!canIncrease}
                className={`${cls.button.iconSecondary} h-9 w-9 p-0 disabled:cursor-not-allowed disabled:opacity-40`}
                onClick={() =>
                  setQuantities((prev) => ({
                    ...prev,
                    [item.key]: Math.min(item.max, (prev[item.key] ?? 0) + 1),
                  }))
                }
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