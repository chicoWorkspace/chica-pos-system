import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  CircleDollarSign,
  CreditCard,
  Ellipsis,
  ImagePlus,
  Layers3,
  ListFilter,
  Minus,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  ReceiptText,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Star,
  TabletSmartphone,
  Trash2,
  TrendingUp,
  XCircle,
  Edit3,
  BarChart3,
  Eye,
} from "lucide-react";
import { paletteTheme as theme } from "@/lib/theme/palette-theme";

import QuantityAdjustDemo from "./_components/quantity-adjust-demo";
import Image from "next/image";

export const metadata: Metadata = {
  title: "商品頁配色稽核",
};

const cls = theme.classes;
const colors = theme.tokens.colors;
const defaultProductCardCls = theme.classes.defaultProductCard;
const horizontalProductCardCls = theme.classes.horizontalProductCard;
const c = theme.classes.cart;
const p = theme.classes.compactCard;

const currentPalette = [
  {
    label: "應用背景",
    value: "商品模組主背景畫布",
    hex: colors.appBg,
  },
  {
    label: "層級底色 1",
    value: "預設卡片與區塊容器",
    hex: colors.surface1,
  },
  {
    label: "層級底色 2",
    value: "工具列、欄位與密集控制區",
    hex: colors.surface2,
  },
  {
    label: "主色重點",
    value: "主要按鈕、選取態、啟用標籤",
    hex: colors.primary,
  },
  {
    label: "成功色",
    value: "正向庫存與已儲存狀態",
    hex: colors.success,
  },
  {
    label: "警示色",
    value: "熱門品項與提醒訊息",
    hex: colors.warning,
  },
  {
    label: "危險色",
    value: "低庫存與危險操作",
    hex: colors.danger,
  },
];

const missingTokens = [
  "Primary 互動應收斂為單一 token 家族：primary、hover、soft、border。",
  "Table 需要明確語意狀態：header、zebra、hover、expanded。",
  "Dialog、drawer、upload surface 應共用同一套 overlay token。",
  "Disabled、selected、focus-visible 需要共用規則維持一致。",
  "次要 badge、篩選條件與輔助資訊需要 neutral emphasis 規則。",
  "列操作按鈕需映射為 component-level theme key，不應散落局部 class。",
];

const semanticSystem = [
  { label: "應用背景", hex: colors.appBg, note: "頁面主背景" },
  { label: "層級底色 1", hex: colors.surface1, note: "主要區塊外殼" },
  { label: "層級底色 2", hex: colors.surface2, note: "密集控制元件與欄位" },
  { label: "主色", hex: colors.primary, note: "主 CTA 與選取狀態" },
  { label: "主色柔化", hex: colors.primarySoft, note: "柔和標籤與焦點輔助" },
  { label: "成功色", hex: colors.success, note: "正向回饋" },
  { label: "警示色", hex: colors.warning, note: "熱門、警示、強調" },
  { label: "危險色", hex: colors.danger, note: "危險與風險狀態" },
  { label: "主要文字", hex: colors.textMain, note: "主要內容" },
  { label: "次要文字", hex: colors.textSub, note: "次要內容" },
];

const componentSamples = [
  { title: "摘要卡", description: "KPI 模組與頁首卡片", tone: "primary" },
  { title: "工具列控制", description: "搜尋、篩選、分段控制", tone: "neutral" },
  { title: "表格列", description: "高密度資料與斑馬紋結構", tone: "success" },
  { title: "危險操作", description: "刪除、封存與低庫存提醒", tone: "danger" },
];

const textScaleSamples = [
  { label: "主要文字", className: cls.text.title, note: "主標與關鍵數值" },
  { label: "強調文字", className: cls.text.strong, note: "主要內文與標籤" },
  { label: "次要文字", className: cls.text.sub, note: "描述與次要資訊" },
  {
    label: "弱化文字",
    className: cls.text.muted,
    note: "提示、佔位與停用狀態",
  },
];

const demoProducts = [
  {
    name: "招牌綜合咖啡豆",
    subtitle: "平衡焙度，帶可可與果香尾韻",
    category: "咖啡豆",
    price: "NT$ 420",
    stock: 38,
    sold: 16,
    rating: "4.9",
    status: "熱門",
  },
  {
    name: "手沖器具組",
    subtitle: "陶瓷濾杯與分享壺組合",
    category: "器具",
    price: "NT$ 180",
    stock: 12,
    sold: 22,
    rating: "4.8",
    status: "穩定",
  },
  {
    name: "冷萃隨行瓶",
    subtitle: "玻璃瓶身搭配不鏽鋼濾網與防漏瓶蓋",
    category: "配件",
    price: "NT$ 150",
    stock: 7,
    sold: 31,
    rating: "4.7",
    status: "低庫存",
  },
];

const toastSamples = [
  {
    title: "商品已儲存",
    description: "招牌綜合咖啡豆已發布到商品目錄。",
    tone: "success",
  },
  {
    title: "庫存提醒",
    description: "冷萃隨行瓶庫存低於建議安全值。",
    tone: "warning",
  },
  {
    title: "需要刪除確認",
    description: "此操作需同步顯示 toast、inline error 與 danger 狀態。",
    tone: "danger",
  },
];

const summaryCards = [
  { label: "商品總數", value: "248", icon: Package },
  { label: "本月銷售品項", value: "126", icon: TrendingUp },
  { label: "平均評分", value: "4.8", icon: Star },
  { label: "售出件數", value: "1,482", icon: Package },
  { label: "營收", value: "NT$ 128,400", icon: ArrowUpRight },
];

const cartDemoGroups = [
  {
    category: "咖啡豆",
    accent: "from-indigo-500/30 to-violet-500/30",
    accentBorder: "border-indigo-400/35",
    icon: Sparkles,
    items: [
      {
        name: "招牌綜合咖啡豆",
        spec: "250g / 中焙",
        price: 420,
        qty: 2,
        image: "/placeholder.png",
        badge: "熱門",
      },
      {
        name: "精品單品豆",
        spec: "200g / 淺焙",
        price: 380,
        qty: 1,
        image: "/placeholder.png",
        badge: "新品",
      },
    ],
  },
  {
    category: "器具與配件",
    accent: "from-cyan-500/25 to-emerald-500/25",
    accentBorder: "border-cyan-400/35",
    icon: Package,
    items: [
      {
        name: "手沖濾紙組",
        spec: "100入",
        price: 180,
        qty: 3,
        image: "/placeholder.png",
        badge: "補貨",
      },
      {
        name: "冷萃隨行瓶",
        spec: "600ml",
        price: 150,
        qty: 1,
        image: "/placeholder.png",
        badge: "低庫存",
      },
    ],
  },
];

const paymentMethodsDemo = [
  { id: "cash", label: "現金", icon: CircleDollarSign },
  { id: "card", label: "刷卡", icon: CreditCard },
  { id: "linepay", label: "LINE Pay", icon: ShoppingCart },
];

const projectCartPalette = {
  panel: "#1E2A42",
  panelBorder: "#364B70",
  card: "#23324D",
  cardBorder: "#3A5179",
  chipBg: "#E0E7FF",
  chipBorder: "#A5B4FC",
  chipText: "#312E81",
  title: "#F3F6FF",
  sub: "#D3DCF0",
  weak: "#A5B4CF",
  successBg: "rgba(52,195,143,0.18)",
  successText: "#B8F1DA",
  warningBg: "rgba(245,181,70,0.18)",
  warningText: "#F7E1B0",
  softControlBg: "#2C3E61",
  softControlBorder: "#4A638F",
  softControlText: "#DDE6FA",
} as const;

function swatchStyle(hex: string) {
  if (hex.startsWith("rgba")) {
    return {
      backgroundColor: colors.surface2,
      boxShadow: `inset 0 0 0 999px ${hex}`,
    };
  }

  return { backgroundColor: hex };
}

function toneBadgeClass(tone: string) {
  switch (tone) {
    case "success":
      return cls.badge.success;
    case "warning":
      return cls.badge.warning;
    case "danger":
      return cls.badge.danger;
    case "neutral":
      return cls.badge.neutral;
    default:
      return cls.badge.primary;
  }
}

function toneButtonClass(tone: string) {
  switch (tone) {
    case "success":
      return cls.button.success + ` px-4 py-3`;
    case "warning":
      return cls.button.warning + ` px-4 py-3`;
    case "danger":
      return cls.button.danger + ` px-4 py-3`;
    default:
      return cls.button.secondary + ` px-4 py-3`;
  }
}

function productStatusClass(status: string) {
  switch (status) {
    case "熱門":
      return cls.badge.warning;
    case "低庫存":
      return cls.badge.danger;
    default:
      return cls.badge.success;
  }
}

function stockClass(stock: number) {
  return stock <= 10 ? cls.badge.danger : cls.text.strong;
}

export default function ProductPaletteDemoPage() {
  return (
    <main className={cls.layout.page}>
      <div className={cls.layout.container}>
        <section className={cls.section.shell}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className={cls.badge.primary}>
                <Sparkles className="h-4 w-4" />
                商品頁配色稽核
              </div>
              <h1
                className={`mt-4 text-4xl font-semibold tracking-tight ${cls.text.title}`}
              >
                商品模組配色系統展示
              </h1>
              <p
                className={`mt-3 max-w-2xl text-sm leading-7 md:text-base ${cls.text.sub}`}
              >
                此頁面完全由 theme 設定驅動，目的是稽核
                目前商品列表配色、補齊語意規則，並展示 表格、
                卡片、表單、彈窗與狀態元件如何共用同一套深色系統。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["目前問題", "顏色 class 混寫在頁面中。"],
                ["重構目標", "將視覺決策收斂到共用 theme key 與 token。"],
                ["核准方向", theme.meta.direction],
              ].map(([title, note]) => (
                <div key={title} className={cls.section.innerCard}>
                  <div
                    className={`text-xs uppercase tracking-[0.16em] ${cls.text.sub}`}
                  >
                    {title}
                  </div>
                  <div className={`mt-2 text-sm leading-6 ${cls.text.strong}`}>
                    {note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className={cls.section.card}>
            <div
              className={`flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
            >
              <Layers3 className={`h-5 w-5 ${cls.text.accent}`} />
              現況色票盤點
            </div>
            <div className="mt-5 grid gap-3">
              {currentPalette.map((item) => (
                <div
                  key={item.label}
                  className={`${cls.section.mutedBlock} grid grid-cols-[120px_1fr_auto] items-center gap-4`}
                >
                  <div
                    className="h-12 rounded-xl border"
                    style={{
                      ...swatchStyle(item.hex),
                      borderColor: colors.borderDefault,
                    }}
                  />
                  <div>
                    <div className={`font-medium ${cls.text.title}`}>
                      {item.label}
                    </div>
                    <div className={`text-sm ${cls.text.sub}`}>
                      {item.value}
                    </div>
                  </div>
                  <div className={`text-sm ${cls.text.strong}`}>{item.hex}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={cls.section.card}>
            <div
              className={`flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
            >
              <AlertTriangle className={`h-5 w-5 ${cls.text.accent}`} />
              缺少的系統規則
            </div>
            <div className="mt-5 space-y-3">
              {missingTokens.map((item) => (
                <div
                  key={item}
                  className={`${cls.section.mutedBlock} text-sm leading-7 ${cls.text.strong}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${cls.section.card} mt-6`}>
          <div
            className={`flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
          >
            <CircleDollarSign className={`h-5 w-5 ${cls.text.accent}`} />
            核准語意配色
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {semanticSystem.map((item) => (
              <div key={item.label} className={cls.section.mutedBlock}>
                <div
                  className="h-14 rounded-xl border"
                  style={{
                    ...swatchStyle(item.hex),
                    borderColor: colors.borderDefault,
                  }}
                />
                <div className={`mt-3 text-sm font-medium ${cls.text.title}`}>
                  {item.label}
                </div>
                <div className={`mt-1 text-xs ${cls.text.sub}`}>
                  {item.note}
                </div>
                <div className={`mt-2 text-xs ${cls.text.strong}`}>
                  {item.hex}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cls.section.card} mt-6`}>
          <div
            className={`flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
          >
            <Layers3 className={`h-5 w-5 ${cls.text.accent}`} />
            元件映射預覽
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {componentSamples.map((sample) => (
              <div key={sample.title} className={cls.section.mutedBlock}>
                <div className={`${cls.section.innerCard} h-24`}>
                  <div
                    className={`mx-1 mt-1 w-fit ${toneBadgeClass(sample.tone)}`}
                  >
                    {sample.title}
                  </div>
                </div>
                <div className={`mt-3 text-sm font-medium ${cls.text.title}`}>
                  {sample.title}
                </div>
                <div className={`mt-1 text-sm ${cls.text.sub}`}>
                  {sample.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cls.section.shell} mt-6`}>
          <div
            className={`mb-6 flex flex-col gap-4 ${cls.section.innerCard} p-6`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className={cls.badge.active}>
                  <Package className="mr-1 h-3.5 w-3.5" />
                  商品目錄
                </div>
                <h2 className={`mt-3 text-3xl font-bold ${cls.text.title}`}>
                  商品列表展示
                </h2>
                <p className={`mt-2 text-sm ${cls.text.sub}`}>
                  直接展示摘要卡、工具列、表格列與狀態標籤 在同一套 theme
                  下的呈現效果。
                </p>
              </div>

              <button className={cls.button.primaryWide}>
                <PackagePlus className="mr-2 h-4 w-4" />
                新增商品
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {summaryCards.map(({ label, value, icon: Icon }) => (
                <div key={label} className={cls.section.mutedBlock}>
                  <div
                    className={`mb-3 flex items-center gap-2 ${cls.text.sub}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </div>
                  <div className={`text-2xl font-bold ${cls.text.title}`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cls.section.innerCard} p-4`}>
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px] xl:w-full xl:max-w-2xl">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${cls.text.sub}`}
                  />
                  <input
                    readOnly
                    value="搜尋商品、SKU 或分類"
                    className={cls.input.field}
                  />
                </div>

                <button
                  className={`inline-flex h-11 items-center justify-between ${cls.button.secondary}`}
                >
                  篩選分類
                  <ChevronDown className={`ml-2 h-4 w-4 ${cls.text.sub}`} />
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className={`inline-flex h-11 items-center ${cls.button.secondary}`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  顯示設定
                </button>
                <button
                  className={`inline-flex h-11 items-center ${cls.button.secondary}`}
                >
                  批次操作
                </button>
              </div>
            </div>

            <div
              className={`mb-4 flex flex-wrap items-center gap-2 text-sm ${cls.text.sub}`}
            >
              <span>共 248 筆商品</span>
              <span className={cls.badge.active}>已套用 2 個篩選條件</span>
            </div>

            <div className={cls.table.wrapper}>
              <div
                className={
                  cls.table.header +
                  ` grid grid-cols-[2.1fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr] `
                }
              >
                <span>商品</span>
                <span>分類</span>
                <span>售價</span>
                <span>庫存</span>
                <span>售出</span>
                <span>評分</span>
                <span>狀態</span>
              </div>
              <div className={cls.table.divider}>
                {demoProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className={`${cls.table.row} 
                    grid grid-cols-[2.1fr_1fr_0.9fr_0.8fr_0.8fr_0.8fr_0.9fr] items-center
                     ${index % 2 === 0 ? cls.table.rowOdd : cls.table.rowEven}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cls.table.media} />
                      <div className="min-w-0">
                        <div
                          className={`truncate font-medium ${cls.text.title}`}
                        >
                          {product.name}
                        </div>
                        <div className={`truncate text-sm ${cls.text.sub}`}>
                          {product.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm ${cls.text.strong}`}>
                      {product.category}
                    </span>
                    <span className={`font-medium ${cls.text.title}`}>
                      {product.price}
                    </span>
                    <span
                      className={`w-fit font-medium ${stockClass(product.stock)}`}
                    >
                      {product.stock}
                    </span>
                    <span className={cls.text.strong}>{product.sold}</span>
                    <span
                      className={`inline-flex items-center gap-1 ${cls.badge.warning}`}
                    >
                      <Star className="h-3.5 w-3.5" />
                      {product.rating}
                    </span>
                    <span className={productStatusClass(product.status)}>
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className={cls.section.shell}>
            <div
              className={`mb-5 flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
            >
              <PackagePlus className={`h-5 w-5 ${cls.text.accent}`} />
              卡片 / 表單 / 操作示範
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className={`${cls.section.innerCard} p-5`}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${cls.text.sub}`}>表單區塊</div>
                    <div
                      className={`mt-1 text-xl font-semibold ${cls.text.title}`}
                    >
                      商品資訊編輯
                    </div>
                  </div>
                  <div className={cls.icon.primaryChip}>
                    <Pencil className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品名稱
                    </label>
                    <div className={cls.input.staticField}>招牌綜合咖啡豆</div>
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      分類
                    </label>
                    <div className={cls.input.staticField}>咖啡豆</div>
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品描述
                    </label>
                    <div className={cls.input.textarea}>
                      焙度均衡、可可香厚實、尾韻帶果香，適合義式與手沖兩種沖煮方式。
                    </div>
                  </div>

                  <QuantityAdjustDemo />

                  <div className={cls.section.mutedBlock}>
                    <div className={`mb-2 text-sm ${cls.text.sub}`}>
                      Checkbox 範例
                    </div>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center gap-2 text-sm ${cls.text.strong}`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-white/30 bg-[#1A2231] accent-[#6F7BF7]"
                        />
                        設為新品推薦
                      </label>
                      <label
                        className={`flex items-center gap-2 text-sm ${cls.text.strong}`}
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-white/30 bg-[#1A2231] accent-[#6F7BF7]"
                        />
                        參與會員價活動
                      </label>
                      <label
                        className={`flex items-center gap-2 text-sm ${cls.text.muted}`}
                      >
                        <input
                          type="checkbox"
                          disabled
                          className="h-4 w-4 rounded border-white/20 bg-[#1A2231] accent-[#6F7BF7]"
                        />
                        已停售（停用狀態）
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className={cls.button.secondary}>儲存草稿</button>
                    <button className={cls.button.primary}>發布商品</button>
                  </div>
                </div>
              </div>

              <div className={`${cls.section.innerCard} p-5`}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className={`text-sm ${cls.text.sub}`}>操作狀態</div>
                    <div
                      className={`mt-1 text-xl font-semibold ${cls.text.title}`}
                    >
                      語意按鈕
                    </div>
                  </div>
                  <div className={cls.badge.success}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    className={`${cls.button.primary} flex items-center justify-between`}
                  >
                    主要操作
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button className={toneButtonClass("neutral")}>
                    <span>次要操作</span>
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className={cls.button.success + ` px-4 py-3`}>
                    <span>成功狀態</span>
                    <TrendingUp className="h-4 w-4" />
                  </button>
                  <button className={cls.button.warning + ` px-4 py-3`}>
                    <span>警示狀態</span>
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                  <button className={cls.button.danger + ` px-4 py-3`}>
                    <span>危險狀態</span>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={cls.section.shell}>
            <div
              className={`mb-5 flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
            >
              <Package className={`h-5 w-5 ${cls.text.accent}`} />
              彈窗 / 對話框示範
            </div>

            <div className={cls.dialog.shell}>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cls.dialog.mediaIcon}>
                    <PackagePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={`text-lg font-semibold ${cls.text.title}`}>
                      新增商品
                    </div>
                    <div className={`text-sm ${cls.text.sub}`}>
                      彈窗表面、欄位與底部操作都應共用 theme key。
                    </div>
                  </div>
                </div>
                <button className={cls.button.secondary}>關閉</button>
              </div>

              <div className={cls.dialog.section}>
                <div>
                  <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                    SKU
                  </label>
                  <div className={cls.input.staticField}>250G-BEAN-01</div>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品分類（Select 範例）
                    </label>
                    <button
                      className={`inline-flex h-11 w-full items-center justify-between ${cls.button.secondary}`}
                    >
                      咖啡豆
                      <ChevronDown className={`h-4 w-4 ${cls.text.sub}`} />
                    </button>
                    <div className="mt-2 rounded-2xl border border-white/15 bg-[#1A2231] p-2">
                      {["咖啡豆", "濾掛咖啡", "咖啡器具"].map((item) => (
                        <div
                          key={item}
                          className={`rounded-xl px-3 py-2 text-sm ${
                            item === "咖啡豆"
                              ? "border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 text-[#D3D7FF]"
                              : `${cls.text.strong} hover:bg-white/5`
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      上架狀態（Select 範例）
                    </label>
                    <button
                      className={`inline-flex h-11 w-full items-center justify-between ${cls.button.secondary}`}
                    >
                      立即上架
                      <ChevronDown className={`h-4 w-4 ${cls.text.sub}`} />
                    </button>
                    <div className="mt-2 rounded-2xl border border-white/15 bg-[#1A2231] p-2">
                      {["立即上架", "草稿", "停售"].map((item) => (
                        <div
                          key={item}
                          className={`rounded-xl px-3 py-2 text-sm ${
                            item === "立即上架"
                              ? "border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 text-[#D3D7FF]"
                              : `${cls.text.strong} hover:bg-white/5`
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      售價
                    </label>
                    <div className={cls.input.staticField}>NT$ 420</div>
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      成本
                    </label>
                    <div className={cls.input.staticField}>NT$ 260</div>
                  </div>
                </div>

                <div className={cls.dialog.media}>
                  <div className={cls.dialog.mediaIcon}>
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <div className={`mt-3 text-sm font-medium ${cls.text.title}`}>
                    上傳商品圖片
                  </div>
                  <div className={`mt-1 text-xs ${cls.text.sub}`}>
                    上傳區塊應沿用相同 overlay 與主色語言。
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button className={cls.button.secondary}>取消</button>
                <button className={cls.button.primary}>確認新增</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className={cls.section.shell}>
            <div
              className={`mb-5 flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
            >
              <ListFilter className={`h-5 w-5 ${cls.text.accent}`} />
              控制元件與文字層級
            </div>

            <div className="space-y-5">
              <div className={`${cls.section.innerCard} p-4`}>
                <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                  商品卡切換（簡化）
                </div>
                <div
                  className={`${cls.section.mutedBlock} inline-flex w-full rounded-2xl p-1`}
                >
                  <div className="grid w-full grid-cols-3 gap-1">
                    <button
                      className={`flex items-center justify-center gap-1.5 rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm transition-colors hover:border-white/15 hover:bg-white/5 ${cls.text.strong}`}
                    >
                      <ReceiptText className="h-4 w-4" />
                      橫向卡片
                    </button>
                    <button className="flex items-center justify-center gap-1.5 rounded-xl border border-[#6F7BF7]/35 bg-[#6F7BF7]/18 px-3 py-2 text-sm text-[#DDE3FF] shadow-[0_6px_14px_rgba(111,123,247,0.22)] transition-colors hover:bg-[#6F7BF7]/24">
                      <Layers3 className="h-4 w-4" />
                      直式卡片
                    </button>
                    <button
                      className={`flex items-center justify-center gap-1.5 rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm transition-colors hover:border-white/15 hover:bg-white/5 ${cls.text.strong}`}
                    >
                      <TabletSmartphone className="h-4 w-4" />
                      快捷小卡
                    </button>
                  </div>
                </div>
              </div>

              <div className={`${cls.section.innerCard} p-4`}>
                <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                  下拉選單 / 選項
                </div>
                <div className={`${cls.dialog.shell} space-y-2 p-2`}>
                  {["依分類排序", "依庫存排序", "依評分排序"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                          index === 1 ? cls.badge.primary : cls.text.strong
                        }`}
                      >
                        <span>{item}</span>
                        {index === 1 ? (
                          <CheckCircle2
                            className={`h-4 w-4 ${cls.text.accent}`}
                          />
                        ) : (
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{ borderColor: colors.borderDefault }}
                          />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className={`${cls.section.innerCard} p-4`}>
                <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                  文字層級
                </div>
                <div className="space-y-3">
                  {textScaleSamples.map((item) => (
                    <div key={item.label} className={cls.section.mutedBlock}>
                      <div className={`text-sm font-medium ${item.className}`}>
                        {item.label}
                      </div>
                      <div className={`mt-1 text-sm ${cls.text.sub}`}>
                        {item.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${cls.section.innerCard} p-4`}>
                <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                  分頁 / 頁尾
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className={`text-sm ${cls.text.sub}`}>
                    顯示 1 - 10 / 共 248 筆商品
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={cls.button.secondary}>上一頁</button>
                    <div className={cls.badge.primary}>1 / 25</div>
                    <button className={cls.button.secondary}>下一頁</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cls.section.shell}>
            <div
              className={`mb-5 flex items-center gap-2 text-lg font-semibold ${cls.text.title}`}
            >
              <TabletSmartphone className={`h-5 w-5 ${cls.text.accent}`} />
              狀態與系統回饋
            </div>

            <div className="space-y-5">
              <div className={`${cls.section.innerCard} p-4`}>
                <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                  Toast 系統
                </div>
                <div className="space-y-3">
                  {toastSamples.map((toast) => (
                    <div
                      key={toast.title}
                      className={toneButtonClass(toast.tone)}
                    >
                      <div>
                        <div className="font-medium">{toast.title}</div>
                        <div className="mt-1 text-sm opacity-90">
                          {toast.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${cls.section.innerCard} p-4`}>
                <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                  表格列操作群組
                </div>
                <div className="flex items-center gap-2">
                  <button className={cls.button.iconSecondary}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className={cls.button.danger}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className={cls.button.iconSecondary}>
                    <Ellipsis className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className={`${cls.section.innerCard} p-4`}>
                  <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                    空狀態
                  </div>
                  <div className={cls.state.empty}>
                    <Package className={`mx-auto h-8 w-8 ${cls.text.accent}`} />
                    <div
                      className={`mt-3 text-sm font-medium ${cls.text.title}`}
                    >
                      目前沒有符合條件的商品
                    </div>
                    <div className={`mt-1 text-sm ${cls.text.sub}`}>
                      請清除篩選或新增商品。
                    </div>
                  </div>
                </div>

                <div className={`${cls.section.innerCard} p-4`}>
                  <div className={`mb-3 text-sm font-medium ${cls.text.title}`}>
                    載入 / 重新整理
                  </div>
                  <div className={cls.state.loading}>
                    <RefreshCw
                      className={`mx-auto h-8 w-8 animate-spin ${cls.text.accent}`}
                    />
                    <div
                      className={`mt-3 text-sm font-medium ${cls.text.title}`}
                    >
                      正在更新商品資料
                    </div>
                    <div className={`mt-1 text-sm ${cls.text.sub}`}>
                      庫存、銷售與分類資料同步中。
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className={`${cls.section.innerCard} p-4`}>
                  <div
                    className={`mb-3 flex items-center gap-2 text-sm font-medium ${cls.text.title}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    正向資訊
                  </div>
                  <div className={cls.state.infoSuccess}>
                    本週銷售提升 12%，儀表板應顯示成功 訊息並沿用同一套成功語意
                    token。
                  </div>
                </div>

                <div className={`${cls.section.innerCard} p-4`}>
                  <div
                    className={`mb-3 flex items-center gap-2 text-sm font-medium ${cls.text.title}`}
                  >
                    <XCircle className="h-4 w-4" />
                    錯誤資訊
                  </div>
                  <div className={cls.state.infoDanger}>
                    商品刪除需讓 toast、inline error 與危險按鈕
                    維持同一個危險語意家族。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-end p-6 bg-slate-950">
          {/* 底部外殼：深色 Slate，純扁平，無陰影 */}
          <div className="relative flex p-1 bg-slate-900 border border-slate-800 rounded-sm">
            {/* 選中指示塊：珊瑚橘 (與你左上角 F 圖標一致)，純色，無發光 */}
            {/* 寫死在第一個位置 */}
            <div className="absolute top-1 left-1 w-10 h-10 bg-[#7678ED] rounded-sm transition-all"></div>

            {/* 1. 直向模式 (選中) */}
            <button className="relative z-10 flex items-center justify-center w-10 h-10 text-white">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>

            {/* 2. 橫向模式 (未選中) */}
            <button className="relative z-10 flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-300 transition-colors">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="5" width="18" height="6" />
                <rect x="3" y="13" width="18" height="6" />
              </svg>
            </button>

            {/* 3. 快捷九宮格 (未選中) */}
            <button className="relative z-10 flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-300 transition-colors">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="4" y="4" width="3" height="3" />
                <rect x="10" y="4" width="3" height="3" />
                <rect x="16" y="4" width="3" height="3" />
                <rect x="4" y="10" width="3" height="3" />
                <rect x="10" y="10" width="3" height="3" />
                <rect x="16" y="10" width="3" height="3" />
                <rect x="4" y="16" width="3" height="3" />
                <rect x="10" y="16" width="3" height="3" />
                <rect x="16" y="16" width="3" height="3" />
              </svg>
            </button>
          </div>
        </div>
        {(() => {
          const cartItems = cartDemoGroups.flatMap((group) => group.items);
          const subtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.qty,
            0,
          );
          const fee = 20;
          const total = subtotal + fee;

          return (
            <section className={c.wrapperSection}>
              {/* 購物車主面板容器 */}
              <div className={c.panel}>
                {/* 今日訂單狀態列 */}
                <div className={c.statusRow}>
                  <div className={c.statusTitleWrap}>
                    <ReceiptText className={c.statusIcon} />
                    今日訂單
                  </div>
                  <div className={c.successChip}>
                    <CheckCircle2 className={c.successIcon} />
                    可出餐
                  </div>
                </div>

                {/* 商品群組列表 */}
                <div className={c.groupWrap}>
                  {cartDemoGroups.map((group) => (
                    <div key={group.category}>
                      {/* 分類標題 */}
                      <div className={c.groupHeader}>
                        <group.icon className={c.groupIcon} />
                        {group.category}
                      </div>

                      {/* 分類內的商品卡片 */}
                      <div className={c.groupList}>
                        {group.items.map((item, idx) => (
                          <div
                            key={`${group.category}-${item.name}`}
                            className={c.itemCard}
                          >
                            <div className={c.itemMainRow}>
                              {/* 商品小圖區 */}
                              <div className={c.itemImgWrap}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className={c.itemImg}
                                />
                              </div>

                              {/* 商品資訊與標籤 */}
                              <div className={c.itemInfo}>
                                <div className={c.itemName}>{item.name}</div>
                                <div className={c.itemMetaRow}>
                                  <span className={c.itemSpec}>
                                    {item.spec}
                                  </span>
                                  {idx === 0 ? (
                                    <span className={c.warningChip}>
                                      {item.badge}
                                    </span>
                                  ) : (
                                    <span className={c.normalChip}>一般</span>
                                  )}
                                </div>
                              </div>

                              {/* 刪除按鈕 */}
                              <button className={c.trashBtn}>
                                <Trash2 className={c.trashIcon} />
                              </button>
                            </div>

                            {/* 價格計算與數量操作按鈕組 */}
                            <div className={c.itemBottomRow}>
                              <div className={c.priceCalcText}>
                                NT$ {item.price} x {item.qty} ={" "}
                                <span className={c.priceCalcBold}>
                                  NT$ {item.price * item.qty}
                                </span>
                              </div>

                              <div className={c.qtyActionWrap}>
                                {/* 減少數量 */}
                                <button className={c.qtyMinusBtn}>
                                  <Minus className={c.qtyMinusIcon} />
                                </button>

                                {/* 數量顯示 */}
                                <div className={c.qtyValueDisplay}>
                                  {item.qty}
                                </div>

                                {/* 增加數量 */}
                                <button className={c.qtyPlusBtn}>
                                  <Plus className={c.qtyPlusIcon} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 結帳明細收據區 */}
                <div className={c.summaryCard}>
                  <div className={c.summaryRow}>
                    <span>小計</span>
                    <span>NT$ {subtotal}</span>
                  </div>
                  <div className={c.summaryRowMuted}>
                    <span>服務費</span>
                    <span>NT$ {fee}</span>
                  </div>
                  <div className={c.summaryDivider}>
                    <div className={c.totalRow}>
                      <span>應付總額</span>
                      <span className={c.totalValue}>NT$ {total}</span>
                    </div>
                  </div>
                </div>

                {/* 付款方式網格按鈕 */}
                <div className={c.paymentGrid}>
                  {paymentMethodsDemo.map((method, index) => (
                    <button
                      key={method.id}
                      className={
                        index === 0 ? c.paymentBtnActive : c.paymentBtnNormal
                      }
                    >
                      <method.icon className={c.paymentIcon} />
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* 立即結帳大按鈕 */}
                <button className={c.checkoutBtn}>
                  <CreditCard className={c.checkoutIcon} />
                  立即結帳
                </button>
              </div>
            </section>
          );
        })()}

        <section className={`${cls.section.shell} mt-6`}>
          <div className="py-6">
            <div className="flex items-center gap-2 mb-8 opacity-90">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span
                className={`text-[10px] font-black tracking-[0.3em] ${cls.metricsCard.text.muted} uppercase`}
              >
                Live Metrics
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="relative pl-6 border-l border-white/5 group hover:border-green-500/50 transition-colors duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-green-400 opacity-60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    今日成交量
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-white tracking-tighter">
                    1,284
                  </span>
                  <span className="text-[10px] text-green-400 font-bold">
                    +12%
                  </span>
                </div>
              </div>

              <div className="relative pl-6 border-l border-white/5 group hover:border-blue-500/50 transition-colors duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-blue-400 opacity-60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    待處理訂單
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-white tracking-tighter">
                    42
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold">
                    LIVE
                  </span>
                </div>
              </div>

              <div className="relative pl-6 border-l border-white/5 group hover:border-yellow-500/50 transition-colors duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-yellow-400 opacity-60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    庫存警示
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-white tracking-tighter">
                    08
                  </span>
                  <span className="text-[10px] text-yellow-400 font-bold">
                    LOW
                  </span>
                </div>
              </div>

              <div className="relative pl-6 border-l border-white/5 group hover:border-purple-500/50 transition-colors duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-purple-400 opacity-60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    在線訪客
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light text-white tracking-tighter">
                    2.4k
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="py-4 w-full">
            {/* 標題區 */}
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
              </div>
              <h3 className="text-sm font-bold text-slate-200 tracking-widest uppercase">
                Live Status
              </h3>
            </div>

            {/* 網格佈局 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 指標 1: Success */}
              <div className="group relative flex flex-col justify-between p-4 rounded-r-lg border-l-2 border-y border-r border-white/5 bg-green-500/5 border-l-green-500/50 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-300">
                    今日成交量
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-green-400 opacity-40 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="text-2xl font-semibold text-white tracking-tight mt-2">
                  1,284
                </div>
              </div>

              {/* 指標 2: Info */}
              <div className="group relative flex flex-col justify-between p-4 rounded-r-lg border-l-2 border-y border-r border-white/5 bg-blue-500/5 border-l-blue-500/50 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-300">
                    待處理訂單
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-blue-400 opacity-40 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="text-2xl font-semibold text-white tracking-tight mt-2">
                  42
                </div>
              </div>

              {/* 指標 3: Warning */}
              <div className="group relative flex flex-col justify-between p-4 rounded-r-lg border-l-2 border-y border-r border-white/5 bg-yellow-500/5 border-l-yellow-500/50 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-300">
                    庫存警示
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-yellow-400 opacity-40 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="text-2xl font-semibold text-white tracking-tight mt-2">
                  08
                </div>
              </div>

              {/* 指標 4: System */}
              <div className="group relative flex flex-col justify-between p-4 rounded-r-lg border-l-2 border-y border-r border-white/5 bg-purple-500/5 border-l-purple-500/50 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-slate-300">
                    系統負載
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-purple-400 opacity-40 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20v-6M6 20V10M18 20V4"></path>
                  </svg>
                </div>
                <div className="text-2xl font-semibold text-white tracking-tight mt-2">
                  14%
                </div>
              </div>
            </div>
          </div>
          <div className="py-6 w-full">
            {/* 標題區：極簡線條感 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-green-500/50"></div>
              <h3 className="text-[11px] font-black text-green-400 tracking-[0.4em] uppercase">
                Real-time Telemetry
              </h3>
            </div>

            {/* 網格佈局：無邊框，僅靠線條點綴 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 指標 1: 成交量 (Success) */}
              <div className="group flex flex-col gap-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-green-400 transition-colors">
                    Sales Volume
                  </span>
                  <svg
                    className="w-3.5 h-3.5 opacity-50 group-hover:rotate-12 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="text-3xl font-light text-white tracking-tighter">
                  $42,850
                  <span className="text-xs text-green-500 ml-1 font-bold">
                    ↑
                  </span>
                </div>
                {/* 底部導航線 */}
                <div className="h-0.5 w-full bg-white/5 overflow-hidden rounded-full">
                  <div className="h-full w-2/3 bg-green-500 shadow-[0_0_8px_#22c55e] group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>

              {/* 指標 2: 訂單 (Info) */}
              <div className="group flex flex-col gap-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                    Active Orders
                  </span>
                  <svg
                    className="w-3.5 h-3.5 opacity-50 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                    <path d="M2 7v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"></path>
                    <path d="M2 7h20"></path>
                  </svg>
                </div>
                <div className="text-3xl font-light text-white tracking-tighter">
                  864
                  <span className="text-[10px] text-slate-500 ml-2 uppercase font-medium">
                    units
                  </span>
                </div>
                <div className="h-0.5 w-full bg-white/5 overflow-hidden rounded-full">
                  <div className="h-full w-1/2 bg-blue-500 shadow-[0_0_8px_#3b82f6] group-hover:w-3/4 transition-all duration-700"></div>
                </div>
              </div>

              {/* 指標 3: 負載 (Warning) */}
              <div className="group flex flex-col gap-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-yellow-400 transition-colors">
                    Server Load
                  </span>
                  <svg
                    className="w-3.5 h-3.5 opacity-50 group-hover:animate-pulse"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <div className="text-3xl font-light text-white tracking-tighter">
                  28.4
                  <span className="text-xs text-yellow-500 ml-1 font-bold">
                    %
                  </span>
                </div>
                <div className="h-0.5 w-full bg-white/5 overflow-hidden rounded-full">
                  <div className="h-full w-[28%] bg-yellow-500 shadow-[0_0_8px_#eab308] group-hover:w-[45%] transition-all duration-700"></div>
                </div>
              </div>

              {/* 指標 4: 安全 (Neutral/Purple) */}
              <div className="group flex flex-col gap-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                    Security Score
                  </span>
                  <svg
                    className="w-3.5 h-3.5 opacity-50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="text-3xl font-light text-white tracking-tighter">
                  98.2
                  <span className="text-xs text-purple-500 ml-1 font-bold">
                    pts
                  </span>
                </div>
                <div className="h-0.5 w-full bg-white/5 overflow-hidden rounded-full">
                  <div className="h-full w-[98%] bg-purple-500 shadow-[0_0_8px_#a855f7] transition-all duration-700"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6 w-full font-sans">
            {/* 標題區：HUD 裝飾線 */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <div className="h-0.5 w-4 bg-blue-500"></div>
                <div className="h-0.5 w-2 bg-blue-500/50"></div>
              </div>
              <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase">
                System Analytics{" "}
                <span className="text-blue-500 ml-2">v3.0</span>
              </h3>
              <div className="flex-1 h-[1px] bg-slate-800"></div>
            </div>

            {/* 網格佈局 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 指標 1: Success (Green) */}
              <div className="relative group">
                {/* 四角裝飾：HUD 括號 */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700 group-hover:border-green-500 transition-colors"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 group-hover:border-green-500 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700 group-hover:border-green-500 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 group-hover:border-green-500 transition-colors"></div>

                <div className="p-5 bg-slate-950/40 border border-slate-800 group-hover:bg-green-500/5 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-green-500">
                      Sales Volume
                    </span>
                    <div className="w-1.5 h-1.5 bg-green-500"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                      12,850
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-green-500 text-slate-950 px-1.5 py-0.5 font-black uppercase">
                        Growth
                      </span>
                      <span className="text-[10px] text-green-500 font-bold">
                        +12.4%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 指標 2: Info (Blue) */}
              <div className="relative group">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700 group-hover:border-blue-500 transition-colors"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 group-hover:border-blue-500 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700 group-hover:border-blue-500 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 group-hover:border-blue-500 transition-colors"></div>

                <div className="p-5 bg-slate-950/40 border border-slate-800 group-hover:bg-blue-500/5 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-500">
                      Pending
                    </span>
                    <div className="w-1.5 h-1.5 bg-blue-500"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                      42
                    </span>
                    <div className="flex items-center gap-2 mt-2 text-slate-500">
                      <span className="text-[10px] border border-slate-700 px-1.5 py-0.5 font-bold uppercase">
                        Queue
                      </span>
                      <span className="text-[10px] font-bold">STABLE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 指標 3: Warning (Yellow) */}
              <div className="relative group">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700 group-hover:border-yellow-500 transition-colors"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 group-hover:border-yellow-500 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700 group-hover:border-yellow-500 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 group-hover:border-yellow-500 transition-colors"></div>

                <div className="p-5 bg-slate-950/40 border border-slate-800 group-hover:bg-yellow-500/5 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-yellow-500">
                      Server Load
                    </span>
                    <div className="w-1.5 h-1.5 bg-yellow-500 animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                      28.4%
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 font-bold uppercase">
                        Critical
                      </span>
                      <span className="text-[10px] text-yellow-500 font-bold">
                        PEAK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 指標 4: Security (Purple) */}
              <div className="relative group">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700 group-hover:border-purple-500 transition-colors"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 group-hover:border-purple-500 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700 group-hover:border-purple-500 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 group-hover:border-purple-500 transition-colors"></div>

                <div className="p-5 bg-slate-950/40 border border-slate-800 group-hover:bg-purple-500/5 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-purple-500">
                      Security
                    </span>
                    <div className="w-1.5 h-1.5 bg-purple-500"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white tracking-tighter tabular-nums">
                      A+
                    </span>
                    <div className="flex items-center gap-2 mt-2 text-slate-500">
                      <span className="text-[10px] border border-slate-700 px-1.5 py-0.5 font-bold uppercase">
                        Shield
                      </span>
                      <span className="text-[10px] font-bold">SECURE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={`${cls.section.shell} mt-6`}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-semibold ${cls.text.title}`}>
                Order 元件總覽 Demo
              </h3>
              <p className={`mt-1 text-sm ${cls.text.sub}`}>
                對應
                `order/index`、`order/product`、`horizontal-item`、`vertical-item`、`order-summary`
              </p>
            </div>
            <div className={cls.badge.primary}>Component Showcase</div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={cls.section.innerCard + " p-4"}>
              <div className="mb-3 flex items-center justify-between">
                <div className={`text-sm font-semibold ${cls.text.title}`}>
                  1) `order/product/vertical-item`
                </div>
                <div className={cls.badge.warning}>Card View</div>
              </div>
              <div className="max-w-[160px]">
                <div className={p.card}>
                  {/* 圖片區塊 */}
                  <div className={p.imgWrap}>
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className={p.imgPlaceholderIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <span className={p.badge}>熱門</span>
                  </div>

                  {/* 品名與金額 */}
                  <div className={p.infoSection}>
                    <p className={p.nameText}>炸豬排飯</p>
                    <p className={p.priceText}>NT$ 180</p>
                  </div>

                  {/* 規格選單 */}
                  <div className={p.specSection}>
                    <div className={p.selectWrapper}>
                      <select className={p.selectInput}>
                        <option className={p.selectOption}>250g</option>
                        <option className={p.selectOption}>500g</option>
                        <option className={p.selectOption}>1kg</option>
                      </select>
                      {/* 下拉箭頭 SVG */}
                      <svg
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none"
                        viewBox="0 0 10 6"
                        fill="none"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke={p.selectArrowIcon}
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* 加入購物車按鈕 */}
                  <div className={p.btnSection}>
                    <button className={p.addBtn}>
                      <Plus className="w-3.5 h-3.5" />
                      加入
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-10 pb-4">
                <div>
                  <div className="text-sm font-semibold">直向-預設藍灰</div>
                  <div className={defaultProductCardCls.shell}>
                    {/* Image */}
                    <div className={defaultProductCardCls.imageArea}>
                      <div className={defaultProductCardCls.imagePlaceholder}>
                        <svg
                          className={defaultProductCardCls.imagePlaceholderIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>

                      <div className={defaultProductCardCls.imageTopLeftBadges}>
                        <span className={defaultProductCardCls.imageHotBadge}>
                          熱門
                        </span>
                        <span
                          className={defaultProductCardCls.imageDiscountBadge}
                        >
                          -12%
                        </span>
                      </div>

                      <div
                        className={defaultProductCardCls.imageTopRightBadgeWrap}
                      >
                        <span
                          className={defaultProductCardCls.imageLowStockBadge}
                        >
                          低庫存
                        </span>
                      </div>

                      <div className={defaultProductCardCls.imageRatingWrap}>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className={defaultProductCardCls.imageRatingText}>
                          4.8
                        </span>
                      </div>

                      <div className={defaultProductCardCls.imageActionsWrap}>
                        {[Eye, Edit3, BarChart3].map((Icon, i) => (
                          <button
                            key={i}
                            className={defaultProductCardCls.imageActionButton}
                          >
                            <Icon
                              className={defaultProductCardCls.imageActionIcon}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div className={defaultProductCardCls.body}>
                      <div className={defaultProductCardCls.titleRow}>
                        <p className={defaultProductCardCls.title}>
                          招牌綜合咖啡豆 250g
                        </p>
                        <span className={defaultProductCardCls.category}>
                          咖啡豆
                        </span>
                      </div>
                      <p className={defaultProductCardCls.subtitle}>
                        中焙 · 可可尾韻 · 適合手沖與義式
                      </p>

                      <div className={defaultProductCardCls.tagsWrap}>
                        {["#招牌", "#手沖", "#義式"].map((t) => (
                          <span key={t} className={defaultProductCardCls.tag}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className={defaultProductCardCls.specLabel}>規格</p>
                      <div className={defaultProductCardCls.selectWrap}>
                        <select className={defaultProductCardCls.select}>
                          <option
                            className={defaultProductCardCls.selectOption}
                          >
                            250g（預設）
                          </option>
                          <option
                            className={defaultProductCardCls.selectOption}
                          >
                            500g
                          </option>
                          <option
                            className={defaultProductCardCls.selectOption}
                          >
                            1kg
                          </option>
                        </select>
                        <svg
                          className={
                            defaultProductCardCls.selectCaretIcon +
                            " " +
                            defaultProductCardCls.selectCaretWrap
                          }
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className={defaultProductCardCls.stockWrap}>
                        <div className={defaultProductCardCls.stockChip}>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#80ECA0]" />
                          <span className={defaultProductCardCls.stockText}>
                            庫存
                          </span>
                          <span className={defaultProductCardCls.stockValue}>
                            8 件
                          </span>
                        </div>
                      </div>

                      <div className={defaultProductCardCls.priceSection}>
                        <div className={defaultProductCardCls.priceRow}>
                          <span className={defaultProductCardCls.priceMain}>
                            NT$ 420
                          </span>
                          <span className={defaultProductCardCls.priceOrigin}>
                            NT$ 480
                          </span>
                        </div>
                        <div className={defaultProductCardCls.metaRow}>
                          <span className={defaultProductCardCls.metaText}>
                            成本{" "}
                            <span className={defaultProductCardCls.metaValue}>
                              NT$ 260
                            </span>
                          </span>
                          <span className={defaultProductCardCls.metaText}>
                            規格{" "}
                            <span className={defaultProductCardCls.metaValue}>
                              250g
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className={defaultProductCardCls.footer}>
                      <div className={defaultProductCardCls.qtyWrap}>
                        <button className={defaultProductCardCls.qtyBtn}>
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className={defaultProductCardCls.qtyText}>2</span>
                        <button className={defaultProductCardCls.qtyBtn}>
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className={defaultProductCardCls.subtotalWrap}>
                        <p className={defaultProductCardCls.subtotalLabel}>
                          小計
                        </p>
                        <p className={defaultProductCardCls.subtotalValue}>
                          NT$ 840
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">直向-深藍柔和</div>
                  <div className="rounded-2xl overflow-hidden border border-[#334E8A] bg-[#1F3056] w-full max-w-xs">
                    {/* Image */}
                    <div className="relative h-44 bg-[#253868]">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-11 h-11 text-[#6A86B8]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>

                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6B1F1F] text-[#FFB0B0] border border-[#9B3030]">
                          熱門
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1A4428] text-[#80ECA0] border border-[#2A7040]">
                          -12%
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#5A3C08] text-[#FFD080] border border-[#8A6010]">
                          低庫存
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/15">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-mono text-[#E8EEFF]">
                          4.8
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 flex gap-1">
                        {[Eye, Edit3, BarChart3].map((Icon, i) => (
                          <button
                            key={i}
                            className="w-6 h-6 rounded-lg flex items-center justify-center bg-black/55 border border-white/15"
                          >
                            <Icon className="w-3 h-3 text-[#C8D8F8]" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-3.5 pt-3.5">
                      {/* 商品名稱加大加粗，類別移到名稱下方 */}
                      <p className="text-lg font-semibold leading-snug text-[#E8EEFF] mb-0.5">
                        招牌綜合咖啡豆 250g
                      </p>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] text-[#6A86B8]">
                          咖啡豆
                        </span>
                        <span className="text-[#334E8A]">·</span>
                        <p className="text-xs text-[#A0B4DC] leading-relaxed">
                          中焙 · 可可尾韻 · 適合手沖與義式
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {["#招牌", "#手沖", "#義式"].map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-lg text-[#A0B4DC] bg-[#253868] border border-[#334E8A]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-[#6A86B8] mb-1">規格</p>
                      <div className="relative mb-3">
                        <select className="w-full px-3 py-1.5 text-[13px] text-[#E8EEFF] bg-[#253868] border border-[#3D5E9E] rounded-lg appearance-none pr-8 focus:outline-none">
                          <option className="bg-[#253868]">250g（預設）</option>
                          <option className="bg-[#253868]">500g</option>
                          <option className="bg-[#253868]">1kg</option>
                        </select>
                        <svg
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="#6A86B8"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#253868] border border-[#334E8A]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#80ECA0]" />
                          <span className="text-xs text-[#A0B4DC]">庫存</span>
                          <span className="text-[13px] font-medium font-mono text-[#E8EEFF]">
                            8 件
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#334E8A] pt-3 pb-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[22px] font-medium font-mono text-[#E8EEFF]">
                            NT$ 420
                          </span>
                          <span className="text-xs line-through font-mono text-[#6A86B8]">
                            NT$ 480
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-[11px] text-[#6A86B8]">
                            成本 <span className="text-[#A0B4DC]">NT$ 260</span>
                          </span>
                          <span className="text-[11px] text-[#6A86B8]">
                            規格 <span className="text-[#A0B4DC]">250g</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-3.5 py-3.5 border-t border-[#334E8A]">
                      <div className="flex items-center gap-2.5">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#253868] border border-[#3D5E9E] text-[#E8EEFF]">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-base font-medium font-mono w-6 text-center text-[#E8EEFF]">
                          2
                        </span>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#253868] border border-[#3D5E9E] text-[#E8EEFF]">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-[#6A86B8] mb-0.5">
                          小計
                        </p>
                        <p className="text-lg font-medium font-mono text-[#E8EEFF]">
                          NT$ 840
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">直向-白</div>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white w-full max-w-xs">
                    {/* Image */}
                    <div className="relative h-44 bg-gray-100">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-11 h-11 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>

                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          熱門
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          -12%
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          低庫存
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-gray-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-mono text-gray-700">
                          4.8
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 flex gap-1">
                        {[Eye, Edit3, BarChart3].map((Icon, i) => (
                          <button
                            key={i}
                            className="w-6 h-6 rounded-lg flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <Icon className="w-3 h-3 text-gray-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-3.5 pt-3.5">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <p className="text-sm font-medium leading-snug text-gray-900">
                          招牌綜合咖啡豆 250g
                        </p>
                        <span className="text-[11px] shrink-0 pt-px text-gray-400">
                          咖啡豆
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2.5 leading-relaxed">
                        中焙 · 可可尾韻 · 適合手沖與義式
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {["#招牌", "#手沖", "#義式"].map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-lg text-gray-500 bg-gray-50 border border-gray-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-gray-400 mb-1">規格</p>
                      <div className="relative mb-3">
                        <select className="w-full px-3 py-1.5 text-[13px] text-gray-800 bg-gray-50 border border-gray-200 rounded-lg appearance-none pr-8 focus:outline-none focus:border-gray-400">
                          <option>250g（預設）</option>
                          <option>500g</option>
                          <option>1kg</option>
                        </select>
                        <svg
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="#9CA3AF"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          <span className="text-xs text-gray-500">庫存</span>
                          <span className="text-[13px] font-medium font-mono text-gray-800">
                            8 件
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 pb-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[22px] font-medium font-mono text-gray-900">
                            NT$ 420
                          </span>
                          <span className="text-xs line-through font-mono text-gray-400">
                            NT$ 480
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-[11px] text-gray-400">
                            成本 <span className="text-gray-600">NT$ 260</span>
                          </span>
                          <span className="text-[11px] text-gray-400">
                            規格 <span className="text-gray-600">250g</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-3.5 py-3.5 border-t border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-base font-medium font-mono w-6 text-center text-gray-900">
                          2
                        </span>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-gray-400 mb-0.5">小計</p>
                        <p className="text-lg font-medium font-mono text-gray-900">
                          NT$ 840
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-6 border-t border-[#3A5179]" />
              </div>
              <div>
                <div className="text-sm font-semibold">橫向-藍</div>
                <div className={horizontalProductCardCls.shell}>
                  <div className={horizontalProductCardCls.rowWrap}>
                    {/* Left: Image */}
                    <div className={horizontalProductCardCls.imageArea}>
                      <div
                        className={horizontalProductCardCls.imagePlaceholder}
                      >
                        <svg
                          className={
                            horizontalProductCardCls.imagePlaceholderIcon
                          }
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>

                      {/* Badges */}
                      <div className={horizontalProductCardCls.imageBadgesWrap}>
                        <span
                          className={horizontalProductCardCls.imageHotBadge}
                        >
                          熱門
                        </span>
                        <span
                          className={
                            horizontalProductCardCls.imageDiscountBadge
                          }
                        >
                          -12%
                        </span>
                        <span
                          className={
                            horizontalProductCardCls.imageLowStockBadge
                          }
                        >
                          低庫存
                        </span>
                      </div>

                      {/* Rating */}
                      <div className={horizontalProductCardCls.imageRatingWrap}>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span
                          className={horizontalProductCardCls.imageRatingText}
                        >
                          4.8
                        </span>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className={horizontalProductCardCls.contentArea}>
                      {/* Top: info + actions */}
                      <div className={horizontalProductCardCls.topSection}>
                        <div className={horizontalProductCardCls.infoWrap}>
                          <p className={horizontalProductCardCls.title}>
                            招牌綜合咖啡豆 250g
                          </p>
                          <div className={horizontalProductCardCls.metaInfoRow}>
                            <span className={horizontalProductCardCls.category}>
                              咖啡豆
                            </span>
                            <span className={horizontalProductCardCls.divider}>
                              ·
                            </span>
                            <span className={horizontalProductCardCls.subtitle}>
                              中焙 · 可可尾韻
                            </span>
                          </div>
                          <div className={horizontalProductCardCls.tagsWrap}>
                            {["#招牌", "#手沖", "#義式"].map((t) => (
                              <span
                                key={t}
                                className={horizontalProductCardCls.tag}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className={horizontalProductCardCls.actionsWrap}>
                          {[Eye, Edit3, BarChart3].map((Icon, i) => (
                            <button
                              key={i}
                              className={horizontalProductCardCls.actionButton}
                            >
                              <Icon
                                className={horizontalProductCardCls.actionIcon}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Middle: spec + stock + price */}
                      <div className={horizontalProductCardCls.middleSection}>
                        {/* Spec select */}
                        <div className={horizontalProductCardCls.selectWrap}>
                          <select className={horizontalProductCardCls.select}>
                            <option
                              className={horizontalProductCardCls.selectOption}
                            >
                              250g（預設）
                            </option>
                            <option
                              className={horizontalProductCardCls.selectOption}
                            >
                              500g
                            </option>
                            <option
                              className={horizontalProductCardCls.selectOption}
                            >
                              1kg
                            </option>
                          </select>
                          <svg
                            className={horizontalProductCardCls.selectCaretIcon}
                            viewBox="0 0 10 6"
                            fill="none"
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              stroke="#6A86B8"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        {/* Stock */}
                        <div className={horizontalProductCardCls.stockChip}>
                          <div className={horizontalProductCardCls.stockDot} />
                          <span className={horizontalProductCardCls.stockText}>
                            庫存
                          </span>
                          <span className={horizontalProductCardCls.stockValue}>
                            8
                          </span>
                        </div>

                        {/* Price */}
                        <div className={horizontalProductCardCls.priceWrap}>
                          <div className={horizontalProductCardCls.priceRow}>
                            <span
                              className={horizontalProductCardCls.priceMain}
                            >
                              NT$ 420
                            </span>
                            <span
                              className={horizontalProductCardCls.priceOrigin}
                            >
                              480
                            </span>
                          </div>
                          <span className={horizontalProductCardCls.costText}>
                            成本{" "}
                            <span
                              className={horizontalProductCardCls.costValue}
                            >
                              NT$ 260
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom: qty + subtotal */}
                      <div className={horizontalProductCardCls.bottomSection}>
                        <div className={horizontalProductCardCls.qtyWrap}>
                          <button className={horizontalProductCardCls.qtyBtn}>
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={horizontalProductCardCls.qtyText}>
                            2
                          </span>
                          <button className={horizontalProductCardCls.qtyBtn}>
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className={horizontalProductCardCls.subtotalWrap}>
                          <p className={horizontalProductCardCls.subtotalLabel}>
                            小計
                          </p>
                          <p className={horizontalProductCardCls.subtotalValue}>
                            NT$ 840
                          </p>
                        </div>
                      </div>
                    </div>
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
