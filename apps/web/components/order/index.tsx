"use client";
import { useWebSocket } from "@/hooks/use-web-socket";
import { handleAnnouncementClick } from "@/lib/utils";
import { ConnectionStatus } from "@/src/context/socket-provider";
import { useAppTheme } from "@/src/context/theme-provider";
import { RootState } from "@/src/store";
import { CategoryResult, ProudctInListResult } from "@repo/api-client";
import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getIcon } from "../ui/announcement-icon";
import OrderSummary from "./order-summary";
import Product from "./product";
interface OrderCompProps {
  products?: ProudctInListResult[];
  categories?: CategoryResult;
}
export type productView = "vertical" | "horizontal" | "compact";

export default function OrderComp(props: OrderCompProps) {
  const productList = props.products || [];
  const categories = props.categories || [];
  const firstCategoryId = categories[0]?._id || "";
  const { theme } = useAppTheme();

  const cls = theme.classes;
  const v = theme.classes.viewSwitcher;

  const [selectedCategory, setSelectedCategory] = useState(firstCategoryId);
  const router = useRouter();
  const ctx = useWebSocket();
  if (!ctx) return null;
  const { socket, status } = ctx;
  const announcementList = useSelector(
    (state: RootState) => state.announcement.announcementList,
  );
  const loaded = useSelector((state: RootState) => state.announcement.loaded);
  const isSideMenuOpen = useSelector(
    (state: RootState) => state.sideMenu.isOpen,
  );

  const getCountBadgeColor = (count: number) => {
    if (count >= 10) return "bg-red-500 text-white";
    if (count >= 5) return "bg-orange-500 text-white";
    return "bg-blue-500 text-white";
  };

  const getCountStyle = (count: number) => {
    if (count >= 10) return "animate-pulse";
    return "";
  };

  const [products, setProducts] = useState(productList);

  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("popularity"); // popularity, price, stock
  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        selectedCategory === "全部" ||
        product.product.categoryUuid.toString() === selectedCategory,
    );
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    return filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (
            a.specInventories[0].salePrice - b.specInventories[0].salePrice
          );
        case "stock":
          return a.specInventories[0].stock - b.specInventories[0].stock;
        default:
          return (
            a.specInventories[0].salePrice - b.specInventories[0].salePrice
          );
      }
    });
  }, [filteredProducts, sortBy]);

  const [view, setView] = useState<productView>("vertical");

  // 定義對應的位移距離 (每個按鈕 w-10 是 40px)
  const getTranslateX = () => {
    switch (view) {
      case "vertical":
        return "translate-x-0";
      case "horizontal":
        return "translate-x-10"; // 移到第二格
      case "compact":
        return "translate-x-20"; // 移到第三格
      default:
        return "translate-x-0";
    }
  };

  return (
    <div className="flex text-white">
      <div
        className={`relative flex-1 pt-2 md:pt-4 p-4 pb-28 lg:h-dvh lg:will-change-scroll lg:scrollbar-clean ${
          isSideMenuOpen ? "overflow-hidden" : "overflow-y-scroll"
        }`}
      >
        <div className={` sm:block `}>
          <div className="flex justify-center items-center mb-2">
         
            <div
              className={`${cls.header.text} relative cursor-default hidden xl:mr-20 2xl:mr-56 xl:block`}
            >
              <span className="text-3xl font-bold ">
                {process.env.NEXT_PUBLIC_SITE_NAME} POS
              </span>

              <span className="absolute ml-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">
                Beta
              </span>
            </div>

            {/* WebSocket 即時通知區 */}
            <div
              className={`flex-1 ${cls.header.bg} ${cls.header.text} rounded-2xl`}
            >
              <div className="flex items-center justify-between  py-2 px-4">
                <h3 className="w-2/12 text-sm font-semibold text-white flex items-center">
                  <Bell className="mr-2 text-indigo-400" size={16} />
                  即時通知
                </h3>

                <div className="w-7/12 space-y-2 max-h-10  overflow-y-auto ">
                  {!loaded && (
                    <div className=" flex justify-center items-center h-10">
                      <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    </div>
                  )}
                  {announcementList.map((msg, key) => (
                    <div
                      key={msg._id.toString()}
                      className={`flex items-center p-2 mr-2 ${cls.header.announcement.bg} rounded-lg  text-sm animate-fade-in cursor-pointer`}
                      onClick={() => {
                        if (!msg.link || msg.link.action === "none") return;
                        handleAnnouncementClick(
                          msg.link,
                          (path, isExternal) => {
                            if (isExternal) {
                              window.open(path, msg.link?.target || "_blank"); // 這裡也用到了 target
                            } else {
                              router.push(path);
                            }
                          },
                        );
                      }}
                    >
                      {getIcon(msg.type)}
                      <div className="flex-1 min-w-0 ml-2 font-bold">
                        <p
                          className={`${cls.header.announcement.text} truncate`}
                        >
                          {msg.content}
                        </p>
                      </div>
                      <span
                        className={`text-xs ${cls.header.announcement.textMuted} ml-2`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-3/12 flex items-center justify-end text-xs ">
                  {renderConnectionStatus(status)}
                </div>
              </div>
            </div>
          </div>
          <div className={`${cls.hr.body} my-4 `}></div>
        </div>
        {/* 分類 Tab */}
        <div className={`mb-2`}>
          <div
            className={`mb-2 ${cls.section.card} backdrop-blur-sm rounded-xl py-2`}
          >
            <div className="flex  overflow-x-auto md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4  pb-3 xl:pb-0 scrollbar-none">
              {" "}
              {categories.map((tab) => {
                const LucideIcon = (Icons as any)[tab.icon] || Icons.Cookie;
                return (
                  <button
                    key={tab._id.toString()}
                    onClick={() => setSelectedCategory(tab._id)}
                    className={`relative flex-shrink-0 w-auto min-w-[110px] md:w-full
                      ${
                        selectedCategory === tab._id
                          ? `rounded-2xl ${cls.header.tab.iteamActive} px-4 py-3 text-sm font-medium transition-colors ${cls.text.strong}`
                          : `rounded-xl ${cls.header.tab.item} border px-4 py-2 text-sm transition-colors font-medium ${cls.text.strong}`
                      }`}
                  >
                    <div className="flex  items-center gap-2  justify-center xl:justify-start ">
                      <LucideIcon size={24} className="hidden xl:block" />
                      <span className="text-sm font-semibold text-center">
                        {tab.name}
                      </span>
                      {tab.count && (
                        <div
                          className={`absolute -top-2 -right-2 ${getCountBadgeColor(tab.count)} 
                      px-2 py-1 text-xs rounded-full font-bold ${getCountStyle(tab.count)} shadow-lg
                      `}
                        >
                          {tab.count}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className={v.outerPosition}>
            <div className={v.container}>
              {/* 選中指示塊：根據 getTranslateX() 動態位移 */}
              <div className={`${v.indicator} ${getTranslateX()}`} />
              {/* 1. 直向模式 */}
              <button
                onClick={() => setView("vertical")}
                className={`${v.btnBase} ${view === "vertical" ? v.btnActive : v.btnInactive}`}
              >
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

              {/* 2. 橫向模式 */}
              <button
                onClick={() => setView("horizontal")}
                className={`${v.btnBase} ${view === "horizontal" ? v.btnActive : v.btnInactive}`}
              >
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

              {/* 3. 快捷九宮格 */}
              <button
                onClick={() => setView("compact")}
                className={`${v.btnBase} ${view === "compact" ? v.btnActive : v.btnInactive}`}
              >
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
        </div>
        <AnimatePresence mode="wait">
          {/* 關鍵：等舊的走完，才讓新的進來 */}
          <motion.div
            key={view}
            className={`relative mb-4 grid gap-6 top-
            ${
              view == "vertical" && "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4"
            }
            ${view == "horizontal" && "grid-cols-1 2xl:grid-cols-2"}
            ${view == "compact" && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"}
            `}
          >
            {sortedProducts.map((product, key) => {
              return (
                <Product
                  key={`product-${key}`}
                  product={product}
                  productView={view}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Panel - 訂單摘要元件 */}
      <div className=" ">
        <OrderSummary categories={categories} />
      </div>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
      `}</style>
    </div>
  );
}

function renderConnectionStatus(status: ConnectionStatus) {
  const configs = {
    connected: {
      color: "bg-emerald-400",
      text: "WebSocket 已連線",
      pulse: false, // 連接成功通常不跳動，或改為微弱跳動
    },
    connecting: {
      color: "bg-yellow-400",
      text: "建立連線中...",
      pulse: true,
    },
    reconnecting: {
      color: "bg-yellow-400",
      text: "重新連線中...",
      pulse: true,
    },
    disconnected: {
      color: "bg-gray-400",
      text: "已斷線",
      pulse: false,
    },
    failed: {
      color: "bg-red-400",
      text: "連線失敗",
      pulse: false,
    },
  };

  const { color, text, pulse } = configs[status];

  return (
    <div className="flex items-center justify-end text-xs font-medium">
      {/* 狀態燈圓點 */}
      <div
        className={`w-2.5 h-2.5 rounded-full mr-2 transition-colors duration-500 
          ${color} 
          ${pulse ? "animate-pulse" : ""} 
          ${status === "connected" ? "shadow-[0_0_8px_rgba(52,211,153,0.5)]" : ""}
        `}
      />
      {/* 狀態文字 */}
      <span className="whitespace-nowrap italic opacity-90">{text}</span>
    </div>
  );
}
