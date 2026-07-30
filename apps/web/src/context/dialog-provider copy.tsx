import { DialogProps } from "@radix-ui/react-dialog";
import { AlertTriangle, Check, Info, SquareCheckBig, X } from "lucide-react";
import { createContext, ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

type WidthClass = `w-${string}` | `min-w-${string}` | `max-w-${string}`;

export interface DialogOpenProps {
  title?: string;
  subTitle?: string;
  type: "info" | "success" | "warning" | ReactNode;
  description?: string;
  content?: ReactNode;
  size?: WidthClass;
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface DialogContextProps {
  openDialog: (options: DialogOpenProps) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextProps | undefined>(
  undefined
);
export function DialogContextProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOpenProps>({
    type: "info",
  });

  const size = dialogOptions.size ?? "max-w-xl";

  // 用來避免 SSR 時 document 未定義
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openDialog = (options: DialogOpenProps) => {
    setDialogOptions(options);
    setIsOpen(true);
    setTimeout(() => {
      setAnimateIn(true);
    }, 10);
  };

  const closeDialog = () => {
    setAnimateIn(false);
    dialogOptions.onClose?.();
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  let title: string = "";
  let iconComp: ReactNode = <></>;
  let contentComp: ReactNode = <></>;
  switch (dialogOptions.type) {
    case "success":
      title = "操作成功";
      iconComp = (
        <div
          className={`w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
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
              {dialogOptions.content}
            </div>
          </div>
        </div>
      );
      break;
    case "warning":
      title = "注意事項";
      iconComp = (
        <div
          className={`w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
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
            <div className="text-amber-200/80 text-sm leading-relaxed">
              {dialogOptions.content}
            </div>
          </div>
        </div>
      );
      break;
    case "info":
      title = "系統資訊";
      iconComp = (
        <div
          className={`w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
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
              {dialogOptions.content}
            </div>
          </div>
        </div>
      );

      break;
    default:
      title = dialogOptions.title || "系統訊息";
      iconComp = dialogOptions.type;
      contentComp = dialogOptions.content || "系統訊息";

      
      break;
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {mounted &&
        ReactDOM.createPortal(
          isOpen && (
            <>
              {/* 背景遮罩 */}
              <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-200 ${
                  animateIn ? "opacity-100" : "opacity-0"
                }`}
              />

              <div
                className={`absolute top-0 left-0 w-full overflow-scroll pointer-events-none inset-0 z-50 transition-all duration-200 ${
                  animateIn ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="min-h-screen  flex items-center p-4 justify-center pointer-events-auto transition-all duration-500"
                  onClick={closeDialog}
                >
                  {/* 彈出視窗內容 */}
                  <div
                    className={`w-full ${size} transform transition-all duration-200 
                    ${
                      animateIn
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-4"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 背景光效 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-3xl"></div>

                    {/* 浮動圓點裝飾 */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400/50 rounded-full animate-ping"></div>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full"></div>
                    <div
                      className="absolute -bottom-2 -right-2 w-3 h-3 bg-indigo-400/50 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-indigo-400 rounded-full"></div>

                    <div className="relative p-8">
                      {/* 標題區域 */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          {iconComp}
                          <div className="ml-4">
                            <h2 className="text-xl font-bold text-white">
                              {title}
                            </h2>
                            <div className="flex items-center mt-1">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                              <p className="text-slate-300 text-sm">
                                {dialogOptions.subTitle ?? `${process.env.NEXT_PUBLIC_SITE_NAME} POS 系統`}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={closeDialog}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* 內容區域 */}
                      {contentComp}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ),
          document.body
        )}
    </DialogContext.Provider>
  );
}
