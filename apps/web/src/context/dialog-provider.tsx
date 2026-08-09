import React, { createContext, ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AlertTriangle, Check, Info, X } from "lucide-react";

type WidthClass = `w-${string}` | `min-w-${string}` | `max-w-${string}`;

export interface DialogOpenProps {
  id?: string; // optional id, provider will fill if missing
  title?: string;
  subTitle?: string;
  type?: "info" | "success" | "warning" | ReactNode;
  description?: string;

  //支援 ReactNode 或 render function
  content?: ReactNode | (() => ReactNode);

  size?: WidthClass | string;
  onClose?: () => void;
  onConfirm?: () => void;
}

interface DialogInstance extends DialogOpenProps {
  id: string;
  animateIn?: boolean;
  isClosing?: boolean;
}

export interface DialogContextProps {
  openDialog: (options: DialogOpenProps) => string; // 回傳 id
  closeDialog: (id: string) => void;
  closeLatest: () => void;
  closeAll: () => void;
}

export const DialogContext = createContext<DialogContextProps | undefined>(
  undefined
);

export function DialogContextProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogInstance[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openDialog = (options: DialogOpenProps) => {
    const id = options.id ?? Math.random().toString(36).slice(2);
    const inst: DialogInstance = {
      ...options,
      id,
      animateIn: false,
      isClosing: false,
    } as DialogInstance;
    setDialogs((prev) => [...prev, inst]);

    setTimeout(() => {
      setDialogs((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, animateIn: true } : d
        )
      );
    }, 10);

    return id;
  };

  const closeDialog = (id: string) => {
    setDialogs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isClosing: true, animateIn: false } : d
      )
    );

    const target = dialogs.find((d) => d.id === id);
    target?.onClose?.();

    setTimeout(() => {
      setDialogs((prev) => prev.filter((d) => d.id !== id));
    }, 220);
  };

  const closeLatest = () => {
    setDialogs((prev) => {
      if (!prev.length) return prev;
      const lastId = prev[prev.length - 1].id;
      return prev.map((d, i) =>
        d.id === lastId ? { ...d, isClosing: true, animateIn: false } : d
      );
    });

    setTimeout(() => {
      setDialogs((prev) => prev.slice(0, -1));
    }, 220);
  };

  const closeAll = () => {
    setDialogs((prev) =>
      prev.map((d) => ({ ...d, isClosing: true, animateIn: false }))
    );
    setTimeout(() => setDialogs([]), 220);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dialogs.length) closeLatest();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dialogs]);

  const renderIconAndContent = (d: DialogInstance) => {
    let title = d.title ?? "系統訊息";
    let iconComp: ReactNode = <></>;

    // resolve content：支援 function 或 ReactNode
    const resolvedContent =
      typeof d.content === "function"
        ? (d.content as () => ReactNode)()
        : d.content;

    let contentComp: ReactNode = (
      <div className="text-slate-200">{resolvedContent}</div>
    );

    switch (d.type) {
      case "success":
        title = d.title ?? "操作成功";
        iconComp = (
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300">
            <Check size={24} className="text-white" />
          </div>
        );
        contentComp = (
          <div className="flex items-start p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
            <div className="p-1 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mr-4">
              <Check size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 font-medium mt-0.5 mb-2">系統通知</p>
              <div className="text-emerald-200/80 text-sm leading-relaxed">
                {resolvedContent}
              </div>
            </div>
          </div>
        );
        break;
      case "warning":
        title = d.title ?? "注意事項";
        iconComp = (
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300">
            <AlertTriangle size={24} className="text-white" />
          </div>
        );
        contentComp = (
          <div className="flex items-start p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl backdrop-blur-sm">
            <AlertTriangle
              size={20}
              className="text-amber-400 mt-0.5 mr-3 flex-shrink-0"
            />
            <div>
              <p className="text-amber-300 font-medium mb-2">系統通知</p>
              <div className="text-white text-sm leading-relaxed">
                {resolvedContent}
              </div>
            </div>
          </div>
        );
        break;
      case "info":
        title = d.title ?? "系統資訊";
        iconComp = (
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300">
            <Info size={24} className="text-white" />
          </div>
        );
        contentComp = (
          <div className="flex items-start p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl ">
            <Info
              size={24}
              className="text-emerald-400 mt-0.5 mr-3 flex-shrink-0"
            />
            <div>
              <p className="text-emerald-400 font-medium mt-0.5 mb-2">系統通知</p>
              <div className="text-slate-200 text-sm leading-relaxed">
                {resolvedContent}
              </div>
            </div>
          </div>
        );
        break;
      default:
        title = d.title ?? "系統訊息";
        iconComp = d.type ?? <></>;
        contentComp = (
          <div className="text-slate-200">
            {resolvedContent ?? d.description ?? "系統訊息"}
          </div>
        );
    }

    return { title, iconComp, contentComp };
  };

  return (
    <DialogContext.Provider
      value={{ openDialog, closeDialog, closeLatest, closeAll }}
    >
      {children}

      {mounted &&
        ReactDOM.createPortal(
          <>
            {dialogs.map((dialog, index) => {
              const { title, iconComp, contentComp } =
                renderIconAndContent(dialog);
              const size = dialog.size ?? "max-w-xl";

              const overlayOpacityClass =
                dialog.animateIn && !dialog.isClosing
                  ? "opacity-100"
                  : "opacity-0";
              const containerOpacityClass =
                dialog.animateIn && !dialog.isClosing
                  ? "opacity-100"
                  : "opacity-0";
              const dialogTransformClass =
                dialog.animateIn && !dialog.isClosing
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4";

              return (
                <div key={dialog.id} className="fixed inset-0 z-50">
                  <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${overlayOpacityClass}`}
                    style={{ zIndex: 1000 + index * 2 }}
                    onClick={() => closeDialog(dialog.id)}
                  />
                  <div
                    className={`absolute top-0 left-0 w-full overflow-y-scroll will-change-scroll scrollbar-clean inset-0 transition-all duration-200 ${containerOpacityClass}`}
                    style={{ zIndex: 1000 + index * 2 + 1 }}
                  >
                    <div
                      className="min-h-screen flex items-center p-4 justify-center pointer-events-auto transition-all duration-500"
                      onClick={() => closeDialog(dialog.id)}
                    >
                      <div
                        className={`w-full ${size} transform transition-all duration-300 ${dialogTransformClass}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-3xl"></div>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400/50 rounded-full animate-ping"></div>
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full"></div>
                        <div
                          className="absolute -bottom-2 -right-2 w-3 h-3 bg-indigo-400/50 rounded-full animate-ping"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-indigo-400 rounded-full" />
                        <div className="relative p-8">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                              {iconComp}
                              <div className="ml-4">
                                <h2 className="text-xl font-bold text-white">{title}</h2>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
                                  <p className="text-slate-300 text-sm">{dialog.subTitle ?? `${process.env.NEXT_PUBLIC_SITE_NAME} POS 系統`}</p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => closeDialog(dialog.id)}
                              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          {contentComp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>,
          document.body
        )}
    </DialogContext.Provider>
  );
}

export default DialogContextProvider;
