"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setPermissions } from "@/src/store/permission";
import { useSetterAndValue } from "@repo/ui/src/hooks/use-sav";
import { useSetterAndValueStorage } from "@repo/ui/src/hooks/use-storage-and-session";
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Shield, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TabletSmartphone,
  Wifi,
  BarChart3
} from "lucide-react";

export default function LoginComp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // 狀態管理
  const username = useSetterAndValue("");
  const password = useSetterAndValue("");
  const showPassword = useSetterAndValue(false);
  const isLoading = useSetterAndValue(false);
  const error = useSetterAndValue("");
  const isLogin = useSetterAndValue(false);
  const rememberMeSotreage = useSetterAndValueStorage("", "username");
  const rememberMe = useSetterAndValue(rememberMeSotreage.value ? true : false);

  useEffect(() => {
    if (rememberMeSotreage.value) username.set(rememberMeSotreage.value);
  }, []);

  const handleLogin = async () => {
    error.set("");
    isLoading.set(true);
    signIn("credentials", {
      username: username.value,
      password: password.value,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        error.set("帳號或密碼錯誤，請重新檢查。");
        isLoading.set(false);
      } else {
        isLogin.set(true);
        if (rememberMe.value) rememberMeSotreage.set(username.value);
        else rememberMeSotreage.set("");
      }
    });
  };

  useEffect(() => {
    if (isLogin.value && (session?.user?.permissions?.length ?? 0) > 0) {
      dispatch(setPermissions(session?.user?.permissions ?? []));
      router.push("/order");
    }
  }, [isLogin.value, session]);

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-slate-200">
      {/* 左側：品牌資訊 (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 border-r border-slate-800/50 bg-[#0D121F]">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-white">{process.env.NEXT_PUBLIC_SITE_NAME} POS</span>
          </div>
          
          <h2 className="text-4xl font-semibold text-white leading-tight mb-6">
            專為現代零售打造的<br />全方位管理系統
          </h2>
          
          <div className="space-y-6 mt-12">
            {[
              { icon: TabletSmartphone, title: "多端適配", desc: "手機、平板、電腦完美運行" },
              { icon: Wifi, title: "即時同步", desc: "WebSocket 技術確保數據零延遲" },
              { icon: BarChart3, title: "營收分析", desc: "數據驅動您的商業決策" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 text-indigo-500"><item.icon size={20} /></div>
                <div>
                  <h4 className="font-medium text-slate-100">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 {process.env.NEXT_PUBLIC_SITE_NAME} POS System. All rights reserved.
        </div>
      </div>

      {/* 右側：登入表單 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">歡迎回來</h1>
            <p className="text-slate-400">請輸入您的帳號密碼以進入管理台</p>
          </div>

          {error.value && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-3">
              <Zap size={16} /> {error.value}
            </div>
          )}

          <div className="space-y-5">
            {/* 帳號 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">管理員帳號</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="admin@example.com"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={username.value}
                  onChange={(e) => username.set(e.target.value)}
                />
              </div>
            </div>

            {/* 密碼 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">安全性密碼</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type={showPassword.value ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={password.value}
                  onChange={(e) => password.set(e.target.value)}
                />
                <button 
                  onClick={() => showPassword.set(!showPassword.value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword.value ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe.value}
                  onChange={() => rememberMe.set(!rememberMe.value)}
                />
                <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe.value ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'}`}>
                  {rememberMe.value && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-200">記住我的帳號</span>
              </label>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">忘記密碼？</button>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading.value}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isLoading.value ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>登入系統 <ArrowRight size={18} /></>
              )}
            </button>
          </div>

          {/* 測試資訊區 - 簡約化 */}
          <div className="mt-10 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-3 text-sm font-semibold">
              <Zap size={16} fill="currentColor" /> 快速測試
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-black/20 p-2 rounded-lg border border-slate-800">
                <p className="text-slate-500 mb-1">帳號</p>
                <p className="text-slate-200 font-mono">admin01</p>
              </div>
              <div className="bg-black/20 p-2 rounded-lg border border-slate-800">
                <p className="text-slate-500 mb-1">密碼</p>
                <p className="text-slate-200 font-mono">abcd1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
