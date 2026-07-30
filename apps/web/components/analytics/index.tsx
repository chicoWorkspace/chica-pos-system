"use client";
import { IOrderAction } from "@/src/action/order/action";
import { useAppTheme } from "@/src/context/theme-provider";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Clock,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getAnalyticsData,
  getPeriodRange,
  PeriodDate,
  RawOrder,
} from "./analytics-utils";
import { BarChart, LineChart, PieChart } from "./charts";

interface AnalyticsCompProps {
  orderAction: IOrderAction;
}

export default function AnalyticsComp({ orderAction }: AnalyticsCompProps) {
  const [currentPeriod, setCurrentPeriod] = useState<PeriodDate>("今天");
  const [rawOrders, setRawOrders] = useState<RawOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { themeKey, setTheme, theme } = useAppTheme();

  const cls = theme.classes;
  const colors = theme.tokens.colors;
  const s = cls.sidebar;

  // 根據選擇的 Period 獲取後端資料
  const fetchAnalytics = (period: PeriodDate) => {
    setLoading(true);
    const range = getPeriodRange(period);
    orderAction
      .get({
        createdAtFrom: range.start.toISOString(),
        createdAtTo: range.end.toISOString(),
      })
      .then((res) => {
        setRawOrders((res as unknown as RawOrder[]) ?? []);
        setCurrentPeriod(period);
      })
      .catch((err) => console.error("無法讀取訂單遠端資料:", err))
      .finally(() => setLoading(false));
  };

  // 初始化讀取
  useEffect(() => {
    fetchAnalytics("今天");
  }, []);

  // 透過 useMemo 封裝運算，避免每一次 Render 重複解析資料
  const processedData = useMemo(() => {
    return getAnalyticsData(rawOrders, currentPeriod, colors);
  }, [rawOrders, currentPeriod]);

  const { kpiData, salesTrend, topProducts, recentOrders, hourlyData } =
    processedData;

  // 計算圓餅圖狀態分布
  const statusStats = useMemo(
    () => [
      {
        label: "已完成",
        value: recentOrders.filter((o) => o.status === "已完成").length,
        color: colors.success,
      },
      {
        label: "待處理",
        value: recentOrders.filter((o) => o.status === "待處理").length,
        color: colors.primary,
      },
      {
        label: "已取消",
        value: recentOrders.filter((o) => o.status === "已取消").length,
        color: colors.danger,
      },
    ],
    [recentOrders],
  );

  const maxHourlyOrders = useMemo(() => {
    return Math.max(...hourlyData.map((h) => h.orders), 1);
  }, [hourlyData]);

  function getStatusColor(status: string) {
    if (status === "已完成") return colors.success;
    if (status === "待處理") return colors.primary;
    if (status === "已取消") return colors.danger;
    return colors.textSub;
  }

  return (
    <div className="flex text-white">
      <div className="flex-1 pb-20 px-4 pt-4 lg:overflow-y-scroll lg:h-dvh lg:will-change-scroll lg:scrollbar-clean md:p-6">
        <div className={`${cls.section.card} p-6`}>
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <BarChart3
                className="w-6 h-6"
                style={{ color: colors.primary }}
              />
              <div>
                <h1 className={`text-3xl font-bold ${cls.text.title}`}>
                  銷售分析
                </h1>
                <p className={`mt-1 text-sm ${cls.text.sub}`}>
                  實時業績展示與趨勢分析
                </p>
              </div>
            </div>

            {/* 時間選擇器 */}
            <div className={`mt-4 flex gap-2 flex-wrap  ${cls.section.card}`}>
              {(["今天", "本週", "本月"] as PeriodDate[]).map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === currentPeriod ? s.navBtnActive : s.navBtnInactive
                  }`}
                  style={{
                    color:
                      period === currentPeriod
                        ? colors.primary
                        : colors.textSub,
                  }}
                  onClick={() => fetchAnalytics(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">
              系統資料載入中...
            </div>
          ) : (
            <div>
              {/* KPI 卡片區區塊 */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-6">
                {kpiData.map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className={cls.section.card}>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="p-2.5 rounded-lg"
                          style={{ backgroundColor: `${kpi.color}15` }}
                        >
                          <Icon size={20} style={{ color: kpi.color }} />
                        </div>
                        <div
                          className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: kpi.isPositive
                              ? `${colors.success}15`
                              : `${colors.danger}15`,
                            color: kpi.isPositive
                              ? colors.success
                              : colors.danger,
                          }}
                        >
                          {kpi.isPositive ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                          {kpi.change}
                        </div>
                      </div>
                      <div className={`text-sm ${cls.text.sub}`}>
                        {kpi.label}
                      </div>
                      <div
                        className={`mt-2 text-2xl font-bold ${cls.text.title}`}
                      >
                        {kpi.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 第一行圖表 */}
              <div className="grid gap-6 mt-8 lg:grid-cols-2">
                <div className={cls.section.card}>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={18} style={{ color: colors.primary }} />
                    <h3 className={`font-semibold ${cls.text.title}`}>
                      本週銷售趨勢
                    </h3>
                  </div>
                  <LineChart data={salesTrend} colors={colors} cls={cls} />
                </div>

                <div className={cls.section.card}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-5 h-5" style={{ color: colors.warning }}>
                      📊
                    </span>
                    <h3 className={`font-semibold ${cls.text.title}`}>
                      訂單狀態分佈
                    </h3>
                  </div>
                  <PieChart data={statusStats} cls={cls} />
                </div>
              </div>

              {/* 第二行圖表：時段分佈 */}
              <div className="grid gap-6 mt-8 lg:grid-cols-3">
                <div className={`${cls.section.card} lg:col-span-2`}>
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={18} style={{ color: colors.success }} />
                    <h3 className={`font-semibold ${cls.text.title}`}>
                      訂單時段分佈 (柱狀圖)
                    </h3>
                  </div>
                  <BarChart
                    data={hourlyData}
                    maxValue={maxHourlyOrders}
                    colors={colors}
                    cls={cls}
                  />
                </div>

                <div className={cls.section.card}>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} style={{ color: colors.success }} />
                    <h3 className={`font-semibold ${cls.text.title}`}>
                      時段統計
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {hourlyData.slice(0, 8).map((hour, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className={cls.text.sub}>{hour.hour}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-700 rounded overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${(hour.orders / maxHourlyOrders) * 100}%`,
                                backgroundColor: colors.success,
                              }}
                            />
                          </div>
                          <span
                            className={`w-6 text-right font-bold ${cls.text.title}`}
                          >
                            {hour.orders}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 熱銷排行 & 最近訂單 */}
              <div className="grid gap-6 mt-8 lg:grid-cols-2">
                {/* 熱銷商品 */}
                <div className={cls.section.card}>
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={18} style={{ color: colors.warning }} />
                    <h3 className={`font-semibold ${cls.text.title}`}>
                      熱銷商品排行
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {topProducts.map((product, idx) => (
                      <div key={idx} className={cls.section.mutedBlock}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="font-bold text-sm"
                                style={{
                                  color:
                                    idx === 0
                                      ? "#FFD700"
                                      : idx === 1
                                        ? "#C0C0C0"
                                        : idx === 2
                                          ? "#CD7F32"
                                          : colors.textSub,
                                }}
                              >
                                #{idx + 1}
                              </span>
                              <div
                                className="font-medium truncate text-sm"
                                style={{ color: colors.textMain }}
                              >
                                {product.name}
                              </div>
                            </div>
                            <div className={`text-xs ${cls.text.sub}`}>
                              {product.sold} 件銷售
                            </div>
                          </div>
                          <div
                            className="text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2"
                            style={{
                              backgroundColor: product.trend.includes("-")
                                ? `${colors.danger}25`
                                : `${colors.success}25`,
                              color: product.trend.includes("-")
                                ? colors.danger
                                : colors.success,
                            }}
                          >
                            {product.trend}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-bold ${cls.text.title}`}
                          >
                            {product.revenueTxt}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star
                              size={14}
                              style={{ color: colors.warning }}
                              fill={colors.warning}
                            />
                            <span className={`text-xs ${cls.text.strong}`}>
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最近訂單 */}
                <div className={cls.section.card}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart
                        size={18}
                        style={{ color: colors.primary }}
                      />
                      <h3 className={`font-semibold ${cls.text.title}`}>
                        最近訂單
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {recentOrders.map((order) => (
                      <div key={order.id} className={cls.section.mutedBlock}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div
                              className={`font-medium text-sm ${cls.text.title}`}
                            >
                              {order.id}
                            </div>
                            <div className={`text-xs ${cls.text.sub}`}>
                              {order.customer}
                            </div>
                          </div>
                          <div
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: `${getStatusColor(order.status)}25`,
                              color: getStatusColor(order.status),
                            }}
                          >
                            {order.status}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${cls.text.sub}`}>
                            {order.items} 項商品
                          </span>
                          <div className="text-right">
                            <div
                              className={`text-sm font-bold ${cls.text.title}`}
                            >
                              {order.amount}
                            </div>
                            <div className={`text-xs ${cls.text.sub}`}>
                              {order.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
