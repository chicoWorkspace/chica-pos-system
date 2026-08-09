"use client";

import { useDialog } from "@/hooks/use-dialog";
import { useWebSocket } from "@/hooks/use-web-socket";
import { ThemeKey, themeList } from "@/lib/theme";
import { handleAnnouncementClick } from "@/lib/utils";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppTheme } from "@/src/context/theme-provider";
import { RootState } from "@/src/store";
import { selectCan } from "@/src/store/permission/permissionSelector";
import { closeSideMenu } from "@/src/store/sideMenuSlice";
import * as Popover from "@radix-ui/react-popover";
import { useSetterAndValue } from "@repo/ui/src/hooks/use-sav";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Hamburger,
  List,
  Loader2,
  LogOut,
  Moon,
  NotebookText,
  Settings,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Setting from "../setting";
import { getIcon } from "../ui/announcement-icon";

interface LeftMenuProps {}

export default function LeftMenu(props: LeftMenuProps) {
  const appDispatch = useAppDispatch();
  const canOrderView = useSelector(selectCan("order", "view"));
  const canProdcutView = useSelector(selectCan("product", "view"));
  const canAnalyticsView = useSelector(selectCan("analytics", "view"));
  const [isLoading, setIsLoading] = useState(false);

  const isOnline = useSetterAndValue<boolean>(true);
  const { openDialog } = useDialog();
  const pathname = usePathname();
  const router = useRouter();

  const canPurchaseHistoryView = useSelector(
    selectCan("purchase-history", "view"),
  );
  const announcementList = useSelector(
    (state: RootState) => state.announcement.announcementList,
  );
  const loaded = useSelector((state: RootState) => state.announcement.loaded);
  const isOpen = useSelector((state: RootState) => state.sideMenu.isOpen);

  const [newAnnouncementCount, setNewAnnouncementCount] = useState(0);
  const ctx = useWebSocket();
  if (!ctx) return null;
  const { socket, status } = ctx;

  const openSetting = () => {
    openDialog({
      title: "設定",
      content: <Setting />,
      size: "max-w-4xl",
      type: <Settings className="text-white" />,
    });
  };

  const mainMenuItems = [
    canOrderView && {
      link: "/order",
      icon: Hamburger,
      label: "點餐",
    },
    canProdcutView && {
      link: "/product",
      icon: NotebookText,
      label: "菜單",
    },
    canAnalyticsView && {
      link: "/analytics",
      icon: BarChart3,
      label: "報表",
    },
    canPurchaseHistoryView && {
      link: "/purchase-history",
      icon: List,
      label: "紀錄",
    },
  ].filter((item) => item !== false);

  const handleLogout = async () => {
    setIsLoading(true);
    // 這裡可以使用 await，確保狀態維持到跳轉前
    await signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    if (!socket) return;

    // 監聽新公告
    socket?.on("announcement:publish", (payload) => {
      setNewAnnouncementCount((prev) => prev + 1); // 新公告數量加1
    });

    return () => {
      socket?.off("announcement:publish");
    };
  }, [socket]);

  const { themeKey, setTheme, theme } = useAppTheme();
  const cls = theme.classes;
  const colors = theme.tokens.colors;
  const s = cls.sidebar;
  const m = cls.mobileNav;

  return (
    <>
      {/* PC 版本 - 左側邊欄 */}
      <div className={`${s.wrapper} min-w-36`} style={s.borderStyle}>
        {/* 背景光效 */}
        <div className={s.glow} />

        <div className="relative flex flex-col h-full ">
          {/* Logo 區 */}
          <div className={`px-3 py-6 ${s.divider}`}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <Image
                  src={"/chica_logo.svg"}
                  alt="chica"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="bg-white p-1 rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
                <div
                  className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
                    isOnline.value
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-slate-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h1 className={`text-md font-bold ${cls.text.title}`}>Admin</h1>
                <p
                  className={`text-xs ${cls.text.sub}`}
                  style={{ color: colors.textSub }}
                >
                  {isOnline.value ? "就緒中" : "離線"}
                </p>
              </div>
            </div>
          </div>

          {/* 主導覽菜單 */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            <div className={`px-3 py-2 text-xs font-semibold ${cls.text.sub}`}>
              主功能
            </div>
            {mainMenuItems.map((item, index) => {
              const isActive = pathname === item.link;
              return (
                <Link key={index} href={item.link!}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive ? s.navBtnActive : s.navBtnInactive
                    }`}
                  >
                    <item.icon
                      size={18}
                      style={{
                        color: isActive ? colors.primary : colors.textSub,
                      }}
                    />
                    <span
                      className={`flex-1 text-sm font-medium ${isActive ? cls.text.title : cls.text.strong}`}
                    >
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            })}

            {/* 工具區分割線 */}
            <div className={s.sectionDivider} />
            <div className={`px-3 py-2 text-xs font-semibold ${cls.text.sub}`}>
              工具
            </div>

            {/* 工具菜單 - 通知 */}
            <AnimatePresence mode="popLayout">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${s.navBtnInactive}`}
                    onClick={() => setNewAnnouncementCount(0)}
                  >
                    <Bell size={18} style={{ color: colors.textSub }} />
                    <span
                      className={`flex-1 text-sm font-medium ${cls.text.strong}`}
                    >
                      通知
                    </span>
                    <motion.div
                      key={newAnnouncementCount}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.1 }}
                      className="text-base font-bold"
                    >
                      <span
                        className="flex items-center justify-center rounded-full text-[10px] font-bold leading-none"
                        style={{
                          backgroundColor: colors.danger,
                          color: "#fff",
                          aspectRatio: "1 / 1",
                          minWidth: "18px",
                          padding: "4px",
                          display: "inline-flex",
                        }}
                      >
                        {newAnnouncementCount > 10
                          ? "10+"
                          : newAnnouncementCount}
                      </span>
                    </motion.div>
                  </button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    className={s.popoverContent}
                    align="start"
                    side="right"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold border-b border-black/[0.08] dark:border-white/10 pb-2">
                        通知訊息
                      </h3>

                      {!loaded && (
                        <div className="w-full flex justify-center items-center py-6">
                          <div className={s.loadingSpinner} />
                        </div>
                      )}

                      {/* 通知列表 */}
                      <div className="max-h-60 pt-1 flex-1 overflow-y-auto space-y-3 scrollbar-clean">
                        {loaded && (
                          <>
                            {announcementList.length === 0 && (
                              <p className="text-sm py-4 text-center opacity-60">
                                目前沒有新通知
                              </p>
                            )}
                            {announcementList.map((msg) => (
                              <div
                                key={msg._id.toString()}
                                className={s.popoverItem}
                                onClick={() => {
                                  if (!msg.link || msg.link.action === "none")
                                    return;
                                  handleAnnouncementClick(
                                    msg.link,
                                    (path, isExternal) => {
                                      if (isExternal) {
                                        window.open(
                                          path,
                                          msg.link?.target || "_blank",
                                        );
                                      } else {
                                        router.push(path);
                                      }
                                    },
                                  );
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {getIcon(msg.type)}
                                  <span className="font-semibold text-sm">
                                    {msg.title}
                                  </span>
                                  <div className="ml-auto text-[11px] opacity-50 font-mono text-nowrap">
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs mt-1.5 opacity-80 line-clamp-2 leading-relaxed">
                                  {msg.content}
                                </p>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                    <Popover.Arrow className={s.popoverArrow} />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </AnimatePresence>

            <div className="px-3 pt-4 w-full flex justify-center">
              <div className={s.themeToggler.container}>
                {themeList.map((t) => {
                  const isSelected = themeKey === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTheme(t.key as ThemeKey)}
                      className={`text-center p-1 text-xs rounded-lg transition-all duration-100 ${
                        isSelected
                          ? s.themeToggler.btnActive
                          : s.themeToggler.btnInactive
                      }`}
                    >
                      {t.key === "white" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* 底部使用者區 */}
          <div className={`px-3 py-4 ${s.divider} border-t space-y-3`}>
            <button
              onClick={() => openSetting()}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${s.navBtnInactive}`}
            >
              <Settings size={18} style={{ color: colors.textSub }} />
              <span className={`flex-1 text-sm font-medium ${cls.text.strong}`}>
                設定
              </span>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all
            bg-red-500/10 border border-red-500/25 text-red-500 
            ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-500/20 hover:border-red-500/40 active:scale-[0.98] active:bg-red-500/30"}
          `}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              <span className="flex-1 text-sm">登出</span>
            </button>

            {/* 快速使用者切換 */}
            <div className="pt-2 border-t border-black/[0.05] dark:border-slate-700/30">
              <div
                className={`px-3 py-2 text-xs font-semibold ${cls.text.sub}`}
              >
                使用者
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["LK", "CW", "JJ"].map((initials) => (
                  <button key={initials} className={s.userBtn}>
                    {initials}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile 版本 - 底部導航 */}
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.div
            key="mobile-bottom-nav"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className={m.wrapper}
          >
            <nav className={`${m.nav} !backdrop-blur-[2px]`}>
              <div className={`absolute -top-10 right-3`}>
                <div className={s.themeToggler.container}>
                  {themeList.map((t) => {
                    const isSelected = themeKey === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setTheme(t.key as ThemeKey)}
                        className={`text-center p-1 text-xs rounded-lg transition-all duration-100 ${
                          isSelected
                            ? s.themeToggler.btnActive
                            : s.themeToggler.btnInactive
                        }`}
                      >
                        {t.key === "white" ? (
                          <Sun size={18} />
                        ) : (
                          <Moon size={18} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-around gap-2 max-w-md mx-auto ">
                {mainMenuItems.map((item, index) => {
                  const isActive = pathname === item.link;
                  return (
                    <Link
                      key={index}
                      href={item.link!}
                      onClick={() => appDispatch(closeSideMenu())}
                      className={`py-1 flex-1 flex flex-col items-center justify-center rounded-xl transition-all ${
                        isActive ? m.btnActive : m.btnInactive
                      }`}
                    >
                      <item.icon size={18} />
                      <span
                        className={`text-[12px] font-semibold mt-1 transition-colors `}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}

                {/* 設定按鈕 */}
                <button
                  onClick={() => openSetting()}
                  className={`flex-1 flex flex-col items-center justify-center rounded-xl transition-all ${
                    m.btnInactive
                  }`}
                >
                  <Settings size={18} style={{ color: m.iconColorInactive }} />
                  <span
                    className={`text-[12px] font-semibold mt-1 ${m.textColorInactive}`}
                  >
                    設定
                  </span>
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className={`flex-1 flex flex-col items-center justify-center rounded-xl transition-all ${
                    m.btnInactive
                  }`}
                  style={{
                    backgroundColor: `${colors.danger}15`,
                    color: colors.danger,
                  }}
                >
                  <LogOut size={18} />
                  <span className="text-[10px] font-semibold mt-1">登出</span>
                </button>
              </div>
            </nav>

            {/* iOS / Android 底部安全區域防夾色塊 */}
            <div className={`h-safe-area-inset-bottom ${m.safeAreaBg}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
