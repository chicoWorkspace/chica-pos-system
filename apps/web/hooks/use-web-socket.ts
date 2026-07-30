import { SocketContext } from "@/src/context/socket-provider";
import React from "react";
import { useContext } from "react";

/**
 * useSocket
 * - 提供元件專用的事件綁定（自動清理）
 */
export function useWebSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket 必須放在 <SocketProvider> 內使用");

  return ctx;
}
