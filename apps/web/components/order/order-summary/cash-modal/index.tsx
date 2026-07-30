import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { Check, Delete } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

export type OrderStateType = "main" | "processing" | "success";
export type CashOrderPayload = {
  expectedAmount: string;
  amount: string;
  changeAmount: string;
};

interface CashModalProps {
  sendOrder?: (payload: CashOrderPayload, after?: () => void) => void;
  onClose?: () => void;
  expectedAmount: number; // 應收金額
}
export function CashModal(props: CashModalProps) {
  const [currentScreen, setCurrentScreen] = useState<OrderStateType>("main");

  const [amount, setAmount] = useState("0");
  const [isActive, setIsActive] = useState<Record<string, boolean>>({});
  const expectedAmount = props.expectedAmount ?? 0;
  const receivedAmount = parseInt(amount || "0");
  const changeAmount = receivedAmount - expectedAmount;

  const handleNumberClick = (num: SetStateAction<string>) => {
    if (amount === "0") {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const handleClear = () => {
    setAmount("0");
  };

  const handleConfirm = () => {
    if (changeAmount <= 0) {
      return systemToastSonner({
        title: "未輸入收款金額",
        description: (
          <div className="font-mono">
            <span className="text-red-500">請謹慎確認收款金額</span>
          </div>
        ),
        type: "error",
      });
    }

    setCurrentScreen("processing");
    props.sendOrder?.(
      {
        expectedAmount: expectedAmount.toString(),
        amount,
        changeAmount: changeAmount.toString(),
      },
      () => {
        setCurrentScreen("success");
        systemToastSonner({
          title: "提交成功",
          description: (
            <div className="font-serif ">
              確認金額: NT$ {formatAmount(amount)}
              <br />
              找零
              <span className="text-red-500">
                NT$ {formatAmount(changeAmount.toString())}
              </span>
            </div>
          ),
          type: "info",
          duration: 5 * 1000,
        });
      }
    );
  };

  const formatAmount = (value: string) => {
    return parseInt(value).toLocaleString();
  };

  const handleMouseDown = (key: string) => {
    setIsActive({ ...isActive, [key]: true });
  };

  const handleMouseUp = (key: string) => {
    setIsActive({ ...isActive, [key]: false });
  };

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["C", "0", "⌫"],
  ];

  return (
    <div className="w-100">
      {currentScreen == "success" && (
        <div className="rounded-2xl p-8 w-full font-mono">
          <div className="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mr-4">
              <Check size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 font-medium">訂單已完成！</p>
              <div className=" text-white">
                應收金額:{" "}
                <span className="text-emerald-200/80">
                  {" "}
                  NT$ {formatAmount(expectedAmount.toString())}
                </span>
                <br />
                實收金額:{" "}
                <span className="text-emerald-200/80">
                  {" "}
                  NT$ {formatAmount(amount)}
                </span>
                <br />
                找零:
                <span className="text-red-500">
                  NT$ {formatAmount(changeAmount.toString())}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentScreen == "main" && (
        <div className="max-w-md mx-auto p-2 ">
          {/* 金額顯示區 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-3">
              輸入金額
            </label>
            <div className="relative">
              <div className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-right backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  NT$ {formatAmount(amount)}
                </div>

                <span className="text-slate-300">
                  應收：NT$ {expectedAmount.toLocaleString()}
                </span>

                <div className="text-sm text-slate-300 mt-1">
                  找零：
                  {changeAmount >= 0 ? (
                    <span className="text-emerald-400 font-semibold">
                      NT$ {changeAmount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold">金額不足</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 數字鍵盤 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {keypadNumbers.map((row, rowIndex) =>
              row.map((key, colIndex) => {
                const isSpecialKey = key === "C" || key === "⌫";
                const isZero = key === "0";

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                  h-16 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm
                  ${
                    isSpecialKey
                      ? "bg-gradient-to-br from-red-500/30 to-red-600/30 border border-red-400/30 text-red-200 hover:from-red-500/40 hover:to-red-600/40 active:scale-95"
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95"
                  }
                  ${isActive[key] ? "scale-95 bg-white/30" : ""}
                  focus:outline-none focus:border-indigo-400/80 focus:bg-white/20
                  hover:shadow-lg hover:border-white/30
                `}
                    onMouseDown={() => handleMouseDown(key)}
                    onMouseUp={() => handleMouseUp(key)}
                    onMouseLeave={() => handleMouseUp(key)}
                    onClick={() => {
                      if (key === "C") {
                        handleClear();
                      } else if (key === "⌫") {
                        handleBackspace();
                      } else {
                        handleNumberClick(key);
                      }
                    }}
                  >
                    {key === "⌫" ? (
                      <Delete size={20} className="mx-auto" />
                    ) : (
                      key
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* 確認按鈕 */}
          <button
            className={`
          w-full h-14 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white font-semibold text-lg
          backdrop-blur-sm border border-indigo-400/30 transition-all duration-300
          hover:from-indigo-600 hover:to-violet-600 hover:shadow-lg hover:shadow-indigo-500/25
          active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-400/50
          ${isActive["confirm"] ? "scale-98" : ""}
        `}
            onMouseDown={() => handleMouseDown("confirm")}
            onMouseUp={() => handleMouseUp("confirm")}
            onMouseLeave={() => handleMouseUp("confirm")}
            onClick={handleConfirm}
          >
            <div className="flex items-center justify-center">
              <Check size={20} className="mr-2" />
              確認金額
            </div>
          </button>

          {/* 快速金額按鈕 */}
          <div className="mt-4 space-y-2">
            <div className="text-sm text-slate-300 mb-2">快速選擇</div>
            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000", "2000"].map((quickAmount) => (
                <button
                  key={quickAmount}
                  className="h-10 bg-white/5 border border-white/10 rounded-lg text-slate-200 text-sm
                       hover:bg-white/10 hover:border-white/20 transition-all duration-200
                       active:scale-95 focus:outline-none"
                  onClick={() => setAmount(quickAmount)}
                >
                  {quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
