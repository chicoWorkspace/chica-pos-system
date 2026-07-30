import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
interface CashModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export function CustomModal(props: CashModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (props.isOpen) openModal();
  }, [props.isOpen]);

  useEffect(() => {
    if (isOpen) {
      openModal();
    }
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => {
      setAnimateIn(true);
    }, 10);
  };

  const closeModal = () => {
    setAnimateIn(false);
    props.onClose?.();
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    isOpen &&
    ReactDOM.createPortal(
      <>
        {/* 背景遮罩 */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-200 ${
            animateIn ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute top-0 left-0 w-full overflow-auto pointer-events-none inset-0 z-50 transition-all duration-200 ${
            animateIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="min-h-screen flex items-center p-4 justify-center pointer-events-auto"
            onClick={closeModal}
          >
            {/* 彈出視窗內容 */}s
            <div
              className={`w-full max-w-xl transform transition-all duration-200 ${
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
                    <div
                      className={`w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg`}
                    >
                      <Info size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">系統資訊</h2>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                        <p className="text-slate-300 text-sm">
                          {process.env.NEXT_PUBLIC_SITE_NAME} POS 系統
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 內容區域 */}
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
}
