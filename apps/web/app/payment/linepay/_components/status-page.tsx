"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, ShoppingBag, XCircle } from "lucide-react";

type LinePayStatusPageProps = {
  variant: "success" | "failure";
  title: string;
  description: string;
};

export function LinePayStatusPage({
  variant,
  title,
  description,
}: LinePayStatusPageProps) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? searchParams.get("id");
  const callbackToken = searchParams.get("token");
  const isSuccess = variant === "success";
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const targetStatus = useMemo(
    () => (isSuccess ? "paid" : "cancelled"),
    [isSuccess],
  );

  useEffect(() => {
    if (!orderId || !callbackToken) {
      setUpdateError("缺少付款回調授權");
      return;
    }

    const updateOrderStatus = async () => {
      setIsUpdating(true);
      setUpdateError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order/payment-status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId,
              status: targetStatus,
              token: callbackToken,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("更新訂單狀態失敗");
        }
      } catch (error) {
        setUpdateError(
          error instanceof Error ? error.message : "更新訂單狀態失敗",
        );
      } finally {
        setIsUpdating(false);
      }
    };

    void updateOrderStatus();
  }, [callbackToken, orderId, targetStatus]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <div
          className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <XCircle className="h-8 w-8" />
          )}
        </div>

        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-300">{description}</p>

        {orderId ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
            訂單編號：
            <span className="ml-1 font-medium text-white">{orderId}</span>
          </div>
        ) : null}

        <div
          className={`mt-4 text-sm  ${updateError ? "text-rose-400" : "text-slate-300"}`}
        >
          {isUpdating
            ? "正在更新訂單狀態…"
            : updateError
              ? `更新失敗：${updateError}`
              : "訂單狀態已同步。"}
        </div>
      </div>
    </main>
  );
}
