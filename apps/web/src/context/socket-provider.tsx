"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@repo/api-client";
import { connectSocket, getSocket } from "@/lib/socket-instance";

/* -------------------- types -------------------- */

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "failed";

interface SocketContextValue {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  status: ConnectionStatus;
  isConnected: boolean;

  /** 強型別事件（有 TS 檢查） */
  onTyped: <E extends keyof ServerToClientEvents>(
    event: E,
    handler: ServerToClientEvents[E],
  ) => () => void;

  emitTyped: <E extends keyof ClientToServerEvents>(
    event: E,
    ...args: Parameters<ClientToServerEvents[E]>
  ) => void;

  /** 動態事件（string，不檢查型別） */
  on: (event: string, handler: (...args: any[]) => void) => () => void;
  emit: (event: string, ...args: any[]) => void;
}

/* -------------------- context -------------------- */

export const SocketContext = createContext<SocketContextValue | undefined>(
  undefined,
);

/* -------------------- provider -------------------- */

export function SocketProvider({ children }: React.PropsWithChildren) {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const { data: session, status: sessionStatus } = useSession();

  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  /* ---------- 初始化 socket ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!endpoint) return;
    // if (sessionStatus !== "authenticated") return;

    const socket = connectSocket(endpoint, session?.accessToken);
    if (!socket) return;

    socketRef.current = socket;
    setStatus(socket.connected ? "connected" : "connecting");

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => setStatus("failed"));
    socket.io.on("reconnect_attempt", () => setStatus("reconnecting"));

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [endpoint, sessionStatus, session?.accessToken]);

  /* ---------- 強型別 on ---------- */
  const onTyped = <E extends keyof ServerToClientEvents>(
    event: E,
    handler: ServerToClientEvents[E],
  ) => {
    const s = socketRef.current;
    if (!s) return () => {};

    // ⚠️ 避開 socket.io 的 TS typing bug
    (s as any).on(event, handler);

    // ✅ 一定回傳 off
    return () => {
      (s as any).off(event, handler);
    };
  };

  /* ---------- 強型別 emit ---------- */
  const emitTyped = <E extends keyof ClientToServerEvents>(
    event: E,
    ...args: Parameters<ClientToServerEvents[E]>
  ) => {
    const s = socketRef.current;
    if (!s || !s.connected) return;

    (s as any).emit(event, ...args);
  };

  /* ---------- 動態 on ---------- */
  const on = (event: string, handler: (...args: any[]) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};

    s.on(event as any, handler);

    return () => {
      s.off(event as any, handler);
    };
  };

  /* ---------- 動態 emit ---------- */
  const emit = (event: string, ...args: any[]) => {
    const s = socketRef.current;
    if (!s || !s.connected) return;

    s.emit(event as any, ...args);
  };

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      status,
      isConnected: status === "connected",
      onTyped,
      emitTyped,
      on,
      emit,
    }),
    [status],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

// "use client";

// import { useSession } from "next-auth/react";
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { io, Socket } from "socket.io-client";

// type ConnectionStatus =
//   | "connecting"
//   | "connected"
//   | "disconnected"
//   | "reconnecting"
//   | "failed";

// interface SocketKitOptions {
//   url?: string; // 若未提供則會使用 NEXT_PUBLIC_SOCKET_URL
//   opts?: Parameters<typeof io>[1];
//   autoConnect?: boolean; // 預設 true
// }

// interface SocketContextValue {
//   socket: Socket | null;
//   status: ConnectionStatus;
//   isConnected: boolean;
//   reconnectAttempts: number;

//   emit: (event: string, ...args: any[]) => void;

//   // component 專屬事件註冊（會在 unmount 自動清理）
//   on: (event: string, handler: (...args: any[]) => void) => void;
//   off: (event: string, handler?: (...args: any[]) => void) => void;

//   joinRoom: (room: string) => void;
//   leaveRoom: (room: string) => void;
// }

// export const SocketContext = createContext<SocketContextValue | undefined>(
//   undefined
// );

// export function SocketProvider({
//   children,
//   url,
//   opts,
//   autoConnect = true,
// }: React.PropsWithChildren<SocketKitOptions>) {
//   const socketRef = useRef<Socket | null>(null);
//   const [status, setStatus] = useState<ConnectionStatus>("disconnected");
//   const [reconnectAttempts, setReconnectAttempts] = useState(0);
//   const { data: session, ...data } = useSession();

//   const endpoint = process.env.NEXT_PUBLIC_API_URL;

//   // 初始化 socket
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!endpoint) {
//       return;
//     }

//     if (data.status !== "authenticated") return; // 等 session 真的出來
//     const token = session?.accessToken;
//     if (!token) return;

//     const socket = io(endpoint, {
//       transports: ["websocket"],
//       auth: {
//         token,
//       },
//     });

//     socketRef.current = socket;

//     setStatus(socket.connected ? "connected" : "connecting");

//     const onConnect = () => {
//       setStatus("connected");
//     };
//     const onConnectError = (err: any) => {
//       setStatus("failed");
//     };
//     const onDisconnect = () => setStatus("disconnected");
//     const onReconnectAttempt = (attempt: number) => {
//       setStatus("reconnecting");
//       setReconnectAttempts(attempt);
//     };
//     const onReconnectError = (err: any) => {
//       setStatus("failed");
//     };

//     socket.on("connect", onConnect);
//     socket.on("connect_error", onConnectError);
//     socket.on("disconnect", onDisconnect);
//     socket.io.on("reconnect_attempt", onReconnectAttempt);
//     socket.io.on("reconnect_error", onReconnectError);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("connect_error", onConnectError);
//       socket.off("disconnect", onDisconnect);
//       socket.io.off("reconnect_attempt", onReconnectAttempt);
//       socket.io.off("reconnect_error", onReconnectError);
//       socket.close();
//       socketRef.current = null;
//     };
//   }, [endpoint, data.status, session?.accessToken]);

//   // 發送事件
//   const emit = (event: string, ...args: any[]) => {
//   const s = socketRef.current;
//   if (!s || !s.connected) return;
//   s.emit(event, ...args);
// };

//   // 註冊事件（單純註冊，不會自動清理，使用者自行管理）
//   const on = (event: string, handler: (...args: any[]) => void) => {
//     const s = socketRef.current;
//     if (!s) return;
//     s.on(event, handler);
//   };

//   const off = (event: string, handler?: (...args: any[]) => void) => {
//     const s = socketRef.current;
//     if (!s) return;
//     handler ? s.off(event, handler) : s.removeAllListeners(event);
//   };

//   const joinRoom = (room: string) => emit("join", room);
//   const leaveRoom = (room: string) => emit("leave", room);

//   const value = useMemo(
//     () => ({
//       socket: socketRef.current,
//       status,
//       isConnected: status === "connected",
//       reconnectAttempts,
//       emit,
//       on,
//       off,
//       joinRoom,
//       leaveRoom,
//     }),
//     [status, reconnectAttempts]
//   );

//   return (
//     <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
//   );
// }
