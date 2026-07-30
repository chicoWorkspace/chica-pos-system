import { whiteTheme as theme } from "@/lib/theme/white-theme";

import {
  ChevronDown,
  CircleDollarSign,
  Eye,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import type { Metadata } from "next";
import QuantityAdjustDemo from "./_components/quantity-adjust-demo";

export const metadata: Metadata = {
  title: "商品頁白色配色稽核",
};

const cls = theme.classes;
const colors = theme.tokens.colors;
const defaultProductCardCls = theme.classes.defaultProductCard;

const currentPalette = [
  {
    label: "應用背景",
    value: "商品模組主背景畫布",
    hex: colors.appBg,
  },
  {
    label: "層級底色 1",
    value: "主要區塊、卡片背景",
    hex: colors.surface1,
  },
  {
    label: "層級底色 2",
    value: "次要內嵌區塊、HUD 背景",
    hex: colors.surface2,
  },
  {
    label: "主要文字",
    value: "重要標題與內文",
    hex: colors.textMain,
  },
];

export default function AuditPage() {
  return (
    <main className={`min-h-screen ${cls.appShell} p-6 md:p-12`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 頂部標題 */}
        <header className="border-b border-black/[0.08] pb-6">
          <h1 className={`${cls.text.title} text-3xl font-bold tracking-tight mb-2`}>
            白色主題樣式稽核與修正頁面
          </h1>
          <p className={`${cls.text.sub} text-base`}>
            此頁面已將 Live Metrics、商品卡片與購物車元件完全對齊 Ivory & Stone 白色主題 Token。
          </p>
        </header>

        {/* 1. Live Metrics 區塊 */}
        <section className={`${cls.section.shell} space-y-6`}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
            <div>
              <h2 className={`${cls.text.title} text-xl font-semibold`}>即時指標 (Live Metrics)</h2>
              <p className={`${cls.text.muted} text-xs mt-0.5`}>即時監控數據面板</p>
            </div>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A7F5A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1A7F5A]"></span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 指標卡片 1 */}
            <div className={`${cls.section.innerCard} p-4 rounded-xl`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${cls.text.sub} text-sm font-medium`}>今日營業額</span>
                <CircleDollarSign className="w-4 h-4 text-[#3D52A0]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`${cls.text.title} text-2xl font-bold font-mono`}>NT$ 48,250</span>
                <span className="text-xs font-medium text-[#1A7F5A] flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </span>
              </div>
              <div className="mt-3 w-full bg-black/[0.08] rounded-full h-1.5">
                <div className="bg-[#3D52A0] h-1.5 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>

            {/* 指標卡片 2 */}
            <div className={`${cls.section.innerCard} p-4 rounded-xl`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${cls.text.sub} text-sm font-medium`}>當前在線人數</span>
                <Eye className="w-4 h-4 text-[#6B6760]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`${cls.text.title} text-2xl font-bold font-mono`}>1,248</span>
                <span className={`${cls.text.muted} text-xs`}>人正在瀏覽</span>
              </div>
              <div className="mt-3 w-full bg-black/[0.08] rounded-full h-1.5">
                <div className="bg-[#6B6760] h-1.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            {/* 指標卡片 3 */}
            <div className={`${cls.section.innerCard} p-4 rounded-xl`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${cls.text.sub} text-sm font-medium`}>未處理訂單</span>
                <Package className="w-4 h-4 text-[#B76E00]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`${cls.text.title} text-2xl font-bold font-mono`}>14</span>
                <span className="text-xs font-medium text-[#B76E00]">需緊急出貨</span>
              </div>
              <div className="mt-3 w-full bg-black/[0.08] rounded-full h-1.5">
                <div className="bg-[#B76E00] h-1.5 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 商品卡片區塊 */}
        <section className={`${cls.section.shell} space-y-6`}>
          <div>
            <h2 className={`${cls.text.title} text-xl font-semibold`}>商品卡片樣式對齊</h2>
            <p className={`${cls.text.muted} text-xs mt-0.5`}>將原本寫死的元件樣式統一接入 defaultProductCardCls</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 修正後的直向商品卡片 */}
            <div className={defaultProductCardCls.shell}>
              <div className={defaultProductCardCls.imageArea}>
                <div className="w-full h-full bg-black/[0.03] flex items-center justify-center relative">
                  <span className={defaultProductCardCls.imageHotBadge}>HOT</span>
                  <ShoppingCart className="w-12 h-12 text-black/[0.15]" />
                </div>
              </div>
              <div className={defaultProductCardCls.body}>
                <div className={defaultProductCardCls.titleWrap}>
                  <h3 className={defaultProductCardCls.title}>
                    衣索比亞 耶加雪菲 經典單品豆
                  </h3>
                </div>
                <div className={defaultProductCardCls.descWrap}>
                  <p className={defaultProductCardCls.desc}>
                    淺烘焙，帶有迷人的柑橘與茉莉花香調，尾韻展現細緻茶感與清甜。
                  </p>
                </div>

                <div className={defaultProductCardCls.selectWrap}>
                  <select className={defaultProductCardCls.select}>
                    <option className={defaultProductCardCls.selectOption}>半磅 (227g)</option>
                    <option className={defaultProductCardCls.selectOption}>一磅 (454g)</option>
                  </select>
                  <div className={defaultProductCardCls.selectCaretWrap}>
                    <ChevronDown className={defaultProductCardCls.selectCaretIcon} />
                  </div>
                </div>

                <div className={defaultProductCardCls.stockWrap}>
                  <div className={defaultProductCardCls.stockChip}>
                    <span className={defaultProductCardCls.stockText}>庫存狀態</span>
                    <span className={defaultProductCardCls.stockValue}>充足</span>
                  </div>
                </div>

                <div className={defaultProductCardCls.priceSection}>
                  <div className={defaultProductCardCls.priceRow}>
                    <span className={defaultProductCardCls.priceMain}>NT$ 420</span>
                    <span className={defaultProductCardCls.priceOrigin}>NT$ 500</span>
                  </div>
                  <div className={defaultProductCardCls.metaRow}>
                    <span className={defaultProductCardCls.metaText}>
                      運費: <span className={defaultProductCardCls.metaValue}>滿千免運</span>
                    </span>
                  </div>
                </div>

                <div className={defaultProductCardCls.footer}>
                  <button className={`${cls.button.primary} w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2`}>
                    <ShoppingCart className="w-4 h-4" /> 加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 購物車區塊 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：互動 Demo 區 (數量調整) */}
          <div className={`${cls.section.shell} lg:col-span-1`}>
            <QuantityAdjustDemo />
          </div>

          {/* 右側：購物車清單區 */}
          <div className={`${cls.section.shell} lg:col-span-2 space-y-4`}>
            <div>
              <h2 className={`${cls.text.title} text-xl font-semibold`}>購物車內容</h2>
              <p className={`${cls.text.muted} text-xs mt-0.5`}>完全移除舊有深色配置，對齊主題外殼與內嵌樣式</p>
            </div>

            <div className="space-y-3">
              {/* 購物車商品項目 1 */}
              <div className={`${cls.section.innerCard} border border-black/[0.06] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F0EEE9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-8 h-8 text-black/[0.2]" />
                  </div>
                  <div>
                    <h4 className={`${cls.text.title} font-medium text-base`}>
                      衣索比亞 耶加雪菲 (半磅)
                    </h4>
                    <p className={`${cls.text.muted} text-xs mt-0.5`}>
                      規格: 淺烘焙 / 咖啡豆
                    </p>
                    <p className="text-sm font-semibold font-mono text-[#3D52A0] mt-1">
                      NT$ 420
                    </p>
                  </div>
                </div>

                {/* 數量調整與小計 */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-black/[0.05]">
                  <div className="flex items-center gap-2">
                    <button className={`${cls.button.iconSecondary} w-8 h-8 rounded-lg flex items-center justify-center`}>
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className={`${cls.text.title} text-base font-medium font-mono w-6 text-center`}>
                      2
                    </span>
                    <button className={`${cls.button.iconSecondary} w-8 h-8 rounded-lg flex items-center justify-center`}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className={`${cls.text.muted} text-[11px] mb-0.5`}>小計</p>
                    <p className={`${cls.text.title} text-lg font-medium font-mono`}>
                      NT$ 840
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}