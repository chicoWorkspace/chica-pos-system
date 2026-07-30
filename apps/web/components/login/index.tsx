"use client";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { persistor, RootState } from "@/src/store";
import { setPermissions } from "@/src/store/permission";
import { useSetterAndValue } from "@repo/ui/src/hooks/use-sav";
import { useSetterAndValueStorage } from "@repo/ui/src/hooks/use-storage-and-session";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  Code,
  CreditCard,
  Database,
  Eye,
  EyeOff,
  HardDrive,
  Lock,
  Moon,
  Network,
  Receipt,
  Sun,
  TabletSmartphone,
  User,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

import { useWebSocket } from "@/hooks/use-web-socket";
import { ThemeKey, themeList } from "@/lib/theme";
import { handleAnnouncementClick } from "@/lib/utils";
import { IAnnouncementAction } from "@/src/action/announcement/action";
import { IHealthAction } from "@/src/action/health/action";
import { useAppTheme } from "@/src/context/theme-provider";
import { AnnouncementResult } from "@repo/api-client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIcon } from "../ui/announcement-icon";

interface LoginCompProps {
  healthAction: IHealthAction;
  announcementAction: IAnnouncementAction;
}

type testState = "ACTIVE" | "CONNECTING" | "FAILED" | "OFFLINE";

export default function LoginComp(props: LoginCompProps) {
  const healthAction = props.healthAction;

  const router = useRouter();
  const showPassword = useSetterAndValue<boolean>(false);
  const password = useSetterAndValue("");
  const isLoading = useSetterAndValue(false);
  const error = useSetterAndValue("");
  const focusedField = useSetterAndValue("");
  const isLogin = useSetterAndValue(false);
  const mousePos = useSetterAndValue({ x: 0, y: 0 });
  const { data: session } = useSession();
  const rememberMeSotreage = useSetterAndValueStorage("", "username");
  const rememberMe = useSetterAndValue(rememberMeSotreage.value ? true : false);
  const username = useSetterAndValue(rememberMeSotreage.value);
  const apiTest = useSetterAndValue<testState>("CONNECTING");
  const socketTest = useSetterAndValue<testState>("CONNECTING");
  const [announcements, setAnnouncements] = useState<AnnouncementResult>([]);
  const ctx = useWebSocket();
  if (!ctx) return null;
  const { socket, status } = ctx;
  const dispatch = useAppDispatch();
  const announcementList = useSelector(
    (state: RootState) => state.announcement.announcementList,
  );
  const loaded = useSelector((state: RootState) => state.announcement.loaded);
  const { theme, themeKey, setTheme } = useAppTheme();
  const cls = theme.classes;
  const s = theme.classes.sidebar;
  const t = theme.classes.login;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    error.set("");
    isLoading.set(true);

    signIn("credentials", {
      username: username.value,
      password: password.value,
      redirect: false,
    })
      .then(async (res) => {
        if (res.error) {
          error.set("帳號或密碼錯誤，請重新輸入或使用測試帳號。");
          isLoading.set(false);
        } else {
          isLogin.set(true);

          if (rememberMe.value) {
            rememberMeSotreage.set(username.value);
          } else {
            rememberMeSotreage.set("");
          }
        }
      })
      .catch((err) => {
        isLoading.set(false);
        error.set("登入失敗，請稍後再試。");
      });
  };
  useEffect(() => {
    // 清除 persisted state，確保每次進入登入頁面都是乾淨的狀態
    const clearStorage = async () => {
      await persistor.purge();
    };
    clearStorage();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (isLogin.value && (session?.user?.permissions?.length ?? 0) > 0) {
        dispatch(setPermissions(session?.user?.permissions ?? []));
        router.push("/order");
      }
    };
    fetchPermissions();
  }, [isLogin.value, session]);

  useEffect(() => {
    healthAction
      .get()
      .then((res) => {
        apiTest.set("ACTIVE");
      })
      .catch((e) => {
        console.error("API health check failed:", e);
        apiTest.set("FAILED");
      });
  }, []);

  useEffect(() => {
    if (status === "connected") {
      socketTest.set("ACTIVE");
    } else if (status === "connecting") {
      socketTest.set("CONNECTING");
    } else if (status === "failed") {
      socketTest.set("FAILED");
    } else {
      socketTest.set("OFFLINE");
    }
  }, [status]);

  const isDarkMode = themeKey == "palette";

  function renderStatusBadge(name: string, status: keyof typeof t.status) {
    const config = t.status[status];
    return (
      <div className="flex items-center justify-between">
        <span
          className={
            isDarkMode
              ? "text-slate-300 text-xs"
              : "text-[#6B6760] text-xs font-medium"
          }
        >
          {name}
        </span>
        <span
          className={`flex items-center gap-1.5 ${config.textColor} text-[10px] font-bold px-2 py-0.5 rounded ${config.bgColor} border ${config.borderColor}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${config.animate}`}
          ></span>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`${t.pageBg} shadow-2xl`}>
      {/* 浮動功能圖標 */}
      {floatingIcons.map(({ Icon, x, y, delay }, index) => (
        <div
          key={index}
          className={t.floatingIcon}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(${mousePos.value.x * 0.01}px, ${mousePos.value.y * 0.01}px)`,
            animation: `float 8s ease-in-out infinite ${delay}s`,
          }}
        >
          <Icon size={32} />
        </div>
      ))}

      {/* 主卡片容器 */}
      <div className={`${t.mainCard}  shadow-2xl}`}>
        {/* 背景裝飾 (僅在暗色主題顯現) */}
        {t.decorations === "block" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-3xl"></div>
          </>
        )}

        {/* 左側：系統狀態與公告區 (42%) */}
        <div className={t.leftPanel}>
          {/* Logo 區 */}
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 flex items-center justify-center relative">
                <Image
                  src={"/chica_logo.svg"}
                  alt="chica"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className={t.logoBg}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div>
                <h2 className={t.textTitle}>Chica POS</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`w-2 h-2 rounded-full bg-emerald-400 ${isDarkMode ? "animate-pulse" : ""}`}
                  />
                  <span
                    className={
                      isDarkMode
                        ? "text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]"
                        : "text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]"
                    }
                  >
                    Server Live
                  </span>
                </div>
              </div>
            </div>
            <p className={t.textPrimary}>智能管理系統 • 企業級解決方案</p>
            <p className={t.textSecondary}>
              系統當前運行於正常狀態，已完成數據備份。若有任何問題，請聯繫技術支持部門。
            </p>
            <p className={t.textMuted}>Ver 3.2.1 Build 2026.04</p>
          </div>

          {/* 狀態監控 */}
          <div className={t.statusBox}>
            <div className={t.statusSectionTitle}>
              <Wifi size={14} /> System Node Status
            </div>
            <div className="space-y-2.5">
              {renderStatusBadge("API主機", apiTest.value)}
              {renderStatusBadge("WebSocket", socketTest.value)}
            </div>
          </div>

          {/* 公告 */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className={t.announcementTitle}>
              <Bell
                size={14}
                className={isDarkMode ? "text-indigo-400" : "text-[#1A1917]"}
              />{" "}
              系統日誌與公告
            </h3>
            <div className="flex-1 overflow-y-auto pr-3 space-y-3 custom-scroll">
              {!loaded && (
                <div className="w-100 flex justify-center items-center">
                  <div
                    className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mr-3 ${isDarkMode ? "border-white/30 border-t-white" : "border-slate-300 border-t-slate-800"}`}
                  ></div>
                </div>
              )}
              {announcementList.map((msg, key) => (
                <div
                  key={msg._id.toString()}
                  className={t.announcementItem}
                  onClick={() => {
                    if (!msg.link || msg.link.action === "none") return;
                    handleAnnouncementClick(msg.link, (path, isExternal) => {
                      if (isExternal) {
                        window.open(path, msg.link?.target || "_blank");
                      } else {
                        router.push(path);
                      }
                    });
                  }}
                >
                  <div className="flex justify-between items-start ">
                    <div className="flex items-center gap-2">
                      {getIcon(msg.type)}
                      <span className={t.announcementText}>{msg.content}</span>
                    </div>
                    <p className={t.announcementTime}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部架構清單 */}
          <div className="mt-6">
            <div className={`${cls.hr.body} pt-6`}></div>
            <div className={t.infraTitle}>Core Infrastructure</div>
            <div className="flex flex-col flex-wrap h-[70px] gap-y-2.5 gap-x-6">
              <div className={t.infraItem}>
                <Network size={12} className={t.infraIcons.network} />{" "}
                分散式微服務
              </div>
              <div className={t.infraItem}>
                <Code size={12} className={t.infraIcons.code} /> RESTful /
                GraphQL
              </div>
              <div className={t.infraItem}>
                <Database size={12} className={t.infraIcons.database} /> Redis
                Multi-cluster
              </div>
              <div className={t.infraItem}>
                <HardDrive size={12} className={t.infraIcons.harddrive} />{" "}
                MongoDB Replica
              </div>
              <div className={t.infraItem}>
                <Zap size={12} className={t.infraIcons.zap} /> Worker Queue
              </div>
              <div className={t.infraItem}>
                <TabletSmartphone
                  size={12}
                  className={t.infraIcons.smartphone}
                />{" "}
                RWD 自適應
              </div>
            </div>
          </div>
        </div>

        {/* 右側：登入表單區 (60%) */}
        <div className={t.rightPanel}>
          <div className="max-w-sm mx-auto w-full z-10">
            <div className="mb-4">
            <div className="flex md:hidden items-center gap-4 mb-4">
              <div className="w-14 h-14 flex items-center justify-center relative">
                <Image
                  src={"/chica_logo.svg"}
                  alt="chica"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className={t.logoBg}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div>
                <h2 className={t.textTitle}>Chica POS</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`w-2 h-2 rounded-full bg-emerald-400 ${isDarkMode ? "animate-pulse" : ""}`}
                  />
                  <span
                    className={
                      isDarkMode
                        ? "text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]"
                        : "text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]"
                    }
                  >
                    Server Live
                  </span>
                </div>
              </div>
            </div>
          </div>
            <div className="mb-10">
              <h1 className={t.formTitle}>進入管理系統</h1>
              <p className={t.formSubtitle}>POS INTEGRATION SYSTEM</p>
              <p className={t.formDesc}>
                授權存取整合點餐、會員管理與營收分析系統。
                <br />
                請使用具備管理權限之憑證進行登入。
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* 帳號輸入 */}
                <div className="space-y-2">
                  <label className={t.inputLabel}>Identity ID</label>
                  <div className="relative group">
                    <User className={t.inputIcon} size={20} />
                    <input
                      type="text"
                      value={username.value}
                      onChange={(e) => username.set(e.target.value)}
                      onFocus={() => focusedField.set("username")}
                      onBlur={() => focusedField.set("")}
                      placeholder="管理員帳號"
                      className={t.inputBox}
                    />
                    {focusedField.value === "username" && (
                      <div className={t.inputFocusBlur}></div>
                    )}
                  </div>
                </div>

                {/* 密碼輸入 */}
                <div className="space-y-2">
                  <label className={t.inputLabel}>Password</label>
                  <div className="relative group">
                    <Lock className={t.inputIcon} size={20} />
                    <input
                      type={showPassword.value ? "text" : "password"}
                      placeholder="登入密碼"
                      value={password.value}
                      onChange={(e) => password.set(e.target.value)}
                      onFocus={() => focusedField.set("password")}
                      onBlur={() => focusedField.set("")}
                      className={t.inputBox}
                    />
                    <button
                      type="button"
                      onClick={() => showPassword.set(!showPassword.value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      {showPassword.value ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                    {focusedField.value === "password" && (
                      <div className={t.inputFocusBlur}></div>
                    )}
                  </div>
                </div>

                {/* 記住我 Toggle 開關 */}
                <div className="flex items-center justify-between px-1">
                  <div
                    onClick={() => rememberMe.set(!rememberMe.value)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`relative w-9 h-5 rounded-full transition-all duration-300 ${rememberMe.value ? t.toggleBgActive : t.toggleBgInactive}`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-all duration-300 ${rememberMe.value ? t.toggleThumbActive : t.toggleThumbInactive}`}
                      />
                    </div>
                    <span className={t.toggleText}>記住帳號</span>
                  </div>

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

                {/* 提交按鈕 */}
                <button
                  type="submit"
                  disabled={
                    isLoading.value ||
                    apiTest.value !== "ACTIVE" ||
                    socketTest.value !== "ACTIVE"
                  }
                  className={t.submitBtn}
                >
                  {isLoading.value ? (
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-white/30 border-t-white"></div>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                {/* 錯誤處理 */}
                {error.value && (
                  <div className={t.errorBox}>
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-rose-500 mr-3 flex-shrink-0" />
                      <p className={t.errorText}>{error.value}</p>
                    </div>
                  </div>
                )}

                {/* 底部輔助說明 */}
                <div className="text-center pt-4">
                  <div className="mb-4">
                    <p className={t.developerTitle}>
                      <span className="font-bold">開發者帳號：</span>
                    </p>
                    <p className={t.developerCreds}>
                      帳號：admin01 | 密碼：abcd1234
                    </p>
                  </div>
                  <p className={t.copyrightText}>
                    ChiCa POS v3.2.1 | © 2026 All Rights Reserved
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* 背景獨立光暈 (僅在暗色主題起作用) */}
          <div className={t.glowBall} />
        </div>
      </div>
    </div>
  );
}

// 浮動功能圖標
const floatingIcons = [
  { Icon: Receipt, x: 15, y: 13, delay: 0 },
  { Icon: CreditCard, x: 85, y: 25, delay: 1 },
  { Icon: Users, x: 20, y: 75, delay: 2 },
  { Icon: BarChart3, x: 88, y: 11, delay: 0.5 },
];
