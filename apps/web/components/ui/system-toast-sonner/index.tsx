"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { toast } from "sonner";

export function systemToastSonner({
  title,
  description,
  duration = 3500,
  onClose,
  type = "info",
}: {
  title: string;
  description?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  type?: "success" | "error" | "warning" | "info";
}) {
  const timestamp = new Date().toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  toast.custom(
    (t) => {
      const toastTypes = {
        success: {
          icon: CheckCircle,
          bgColor: "bg-emerald-600",
          borderColor: "border-emerald-500",
          iconColor: "text-emerald-400",
        },
        error: {
          icon: AlertCircle,
          bgColor: "bg-red-600",
          borderColor: "border-red-500",
          iconColor: "text-red-400",
        },
        warning: {
          icon: AlertTriangle,
          bgColor: "bg-amber-600",
          borderColor: "border-amber-500",
          iconColor: "text-amber-400",
        },
        info: {
          icon: Info,
          bgColor: "bg-blue-600",
          borderColor: "border-blue-500",
          iconColor: "text-blue-400",
        },
      };
      const config = toastTypes[type];
      const IconComponent = config.icon;

      return (
        <div
          className={`
        relative overflow-hidden rounded-xl border border-slate-600/30
        bg-slate-900/70 backdrop-blur-md shadow-2xl
        transform transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-3xl hover:bg-slate-900/80
        animate-slide-in-right
      `}
        >
          {/* 微透明彩色背景層 */}
          <div
            className={`absolute inset-0 ${config.bgColor} opacity-10`}
          ></div>
          {/* 左側彩色邊框 */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 ${config.bgColor}`}
          ></div>
          <div className="relative p-4 flex items-start space-x-3">
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <IconComponent size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-semibold text-sm mr-4">{title}</h4>
                <span className="text-slate-400 text-xs font-mono mt-1">
                  {timestamp}
                </span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                {description}
              </div>
            </div>
            <button
              onClick={() => {
                toast.dismiss(t);
                onClose && onClose();
              }}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-slate-700/50"
            >
              <X size={16} />
            </button>
          </div>

          {/* 進度條 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50">
            <div
              className={`h-full ${config.bgColor} opacity-80 animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            ></div>
          </div>
          <style jsx>{`
            @keyframes slide-in-right {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes progress {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }

            .animate-slide-in-right {
              animation: slide-in-right 0.3s ease-out;
            }

            .animate-progress {
              animation-name: progress;
              animation-timing-function: linear;
              animation-fill-mode: forwards;
            }

            .shadow-3xl {
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }
          `}</style>
        </div>
      );
    },
    { duration }
  );
}
