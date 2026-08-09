"use client";

import { AlertTriangle, Check, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { paletteTheme as theme } from "@/lib/theme/palette-theme";

interface QrcodeModalProps {
  snedOrder?: (after?: () => void) => void;
  onClose?: () => void;
  expectedAmount: number; // 應收金額
  text: string; // QR Code 圖片 URL
}

const cls = theme.classes;
const colors = theme.tokens.colors;

export default function QrcodeModal(props: QrcodeModalProps) {
  const [countdown, setCountdown] = useState(120);
  const [isQrCodeConfirmed, setIsQrCodeConfirmed] = useState(false);
  const { text } = props;
  const totalAmount = props.expectedAmount;

  // QR Code 倒數計時
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setCountdown(120);
    setIsQrCodeConfirmed(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* 金額區 */}
      <div className={cls.section.innerCard}>
        <div className="text-center">
          <p
            className={`text-xs uppercase tracking-widest mb-2 ${cls.text.sub}`}
          >
            應收金額
          </p>
          <div className={`text-4xl font-black ${cls.text.title}`}>
            NT${totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* QR Code 區 */}
      <div className={cls.section.innerCard}>
        <div className="flex justify-center mb-3">
          {text && countdown > 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-white p-3">
              <div
                className={`transition duration-300 ${
                  isQrCodeConfirmed ? "" : "blur-sm"
                }`}
              >
                <QRCodeSVG
                  value={text}
                  size={200}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              {!isQrCodeConfirmed && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3   
                p-4 text-center  rounded-2xl bg-red-900/30 border border-red-500/30"
                >
                  <AlertTriangle className="w-10 h-10 text-red-400 mb-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      真實商戶測試
                    </p>
                    <p className="text-xs leading-relaxed font-semibold text-white">
                      RD 請先確認需求，謹慎掃碼付款。
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`${cls.button.nebula} text-white flex items-center gap-2 px-4 py-2 `}
                    onClick={() => setIsQrCodeConfirmed(true)}
                  >
                    <Check className="h-4 w-4 " />
                    確認顯示 QR Code
                  </button>
                </div>
              )}
            </div>
          ) : countdown > 0 ? (
            <div className="w-56 h-56 flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <div className="animate-bounce mb-2">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <p className={`text-sm font-medium ${cls.text.strong}`}>
                QR Code 生成中
              </p>
            </div>
          ) : (
            <div className="w-56 h-56 flex flex-col items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="w-10 h-10 text-red-400 mb-2" />
              <p className="text-sm font-semibold text-red-400">已過期</p>
            </div>
          )}
        </div>

        {/* 倒計時或過期提示 */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className={`text-xs ${cls.text.sub}`}>
              QR Code 將在{" "}
              <span className="font-bold text-yellow-400">
                {formatTime(countdown)}
              </span>{" "}
              後過期
            </p>
          ) : (
            <p className="text-xs text-red-400">請重新發起付款流程</p>
          )}
        </div>
      </div>

      {/* LINE Pay Logo */}
      <div className="flex justify-center pt-2">
        <div className="w-32 bg-white rounded-lg p-2">
          <Image
            src="/LINE_Pay_logo.svg"
            alt="LINE Pay"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* 提示文字 */}
      <p className={`text-center text-xs ${cls.text.sub}`}>
        {countdown > 0
          ? "請用 LINE Pay 錢包掃描 QR Code"
          : "交易已過期，請返回重新發起"}
      </p>
    </div>
  );
}
