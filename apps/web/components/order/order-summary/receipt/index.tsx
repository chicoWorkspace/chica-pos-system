import { Button } from "@/components/ui/button";
import { OrderCreaterResult } from "@repo/api-client";
import { is } from "date-fns/locale";
import { Printer, Receipt, X } from "lucide-react";

interface ReceiptPreviewProps {
  isPrint?: boolean;
  receipt: OrderCreaterResult;
}

export default function ReceiptPreview(props: ReceiptPreviewProps) {
  const { receipt, isPrint = false } = props;
  const taxRate = 0.1;
  const subtotal = receipt.totalAmount;
  const tax = Math.round(subtotal * taxRate);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentText = (method: string) => {
    switch (method) {
      case "cash":
        return "現金";
      case "credit":
        return "信用卡";
      case "linepay":
        return "LINE Pay";
      default:
        return method;
    }
  };

  const printReceipt = (receipt: OrderCreaterResult) => {
    const win = window.open(
      "/print/receipt",
      "_blank",
      "height=900,width=500,scrollbars=yes",
    );

    win?.addEventListener("load", () => {
      win.postMessage(
        {
          type: "PRINT_RECEIPT",
          payload: receipt,
        },
        "*",
      );
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg max-w-md w-full  overflow-hidden flex flex-col">
        {/* Header */}
        {isPrint ? null : (
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              收據預覽
            </h3>
          </div>
        )}
        {/* Receipt Content */}
        <div className="flex-1  p-6">
          <div className="bg-white text-black p-6 font-mono text-sm">
            {/* Store Header */}
            <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
              <div className="text-xl font-bold mb-1">點餐系統</div>
              <div className="text-xs">Restaurant POS</div>
              <div className="text-xs mt-2">統編: 12345678</div>
            </div>

            {/* Order Info */}
            <div className="mb-4 text-xs space-y-1">
              <div className="flex justify-between">
                <span>訂單編號:</span>
                <span className="font-bold">#{receipt._id.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span>日期時間:</span>
                <span>
                  {receipt?.createdAt && formatDate(receipt.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>服務人員:</span>
                <span>{receipt.staff.username}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-black my-3"></div>

            {/* Items */}
            <div className="mb-4">
              <div className="flex justify-between font-bold mb-2 text-xs">
                <span>品項</span>
                <span>金額</span>
              </div>
              {receipt.items.map((item, idx) => (
                <div key={idx} className="mb-2">
                  <div className="flex justify-between">
                    <span className="flex-1">{item.snapshot.name}</span>
                    <span className="text-right ml-2">
                      ${item.snapshot.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 ml-2">
                    <span>{item.snapshot.categoryName}</span>
                    <span>
                      x {item.quantity} = ${item.subtotal}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-black my-3"></div>

            {/* Totals */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>小計:</span>
                <span>NT$ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>稅金 (10%):</span>
                <span>NT$ {tax}</span>
              </div>
              {receipt.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>折扣:</span>
                  <span>-NT$ {receipt.discountAmount}</span>
                </div>
              )}
              <div className="border-t border-black pt-2 mt-2"></div>
              <div className="flex justify-between font-bold text-base">
                <span>總計:</span>
                <span>NT$ {receipt.finalAmount}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-black my-3"></div>

            {/* Payment Info */}
            <div className="text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span>付款方式:</span>
                <span className="font-bold">
                  {getPaymentText(receipt.payment.method)}
                </span>
              </div>
              {receipt.payment.paidAt && (
                <div className="flex justify-between">
                  <span>付款時間:</span>
                  <span>{formatDate(receipt.payment.paidAt)}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs border-t-2 border-dashed border-black pt-4">
              <div className="mb-2">謝謝光臨 歡迎再次光臨</div>
              <div className="text-[10px]">Thank You!</div>
            </div>
          </div>
        </div>
        {isPrint ? null : (
          <div className="p-4 border-t border-slate-700">
            <Button
              onClick={() => printReceipt(receipt!)}
              className="flex-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" /> 列印收據
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
