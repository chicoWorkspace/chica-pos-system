import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return; // 等 session 真的出來
    const token = session?.accessToken;
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
      auth: {
        token: session?.accessToken,
      },
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("🔥 WebSocket 已連線:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ WebSocket 錯誤:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket 已斷線");
    });

    return () => {
      socket.disconnect();
    };
  }, [status, session?.accessToken]);

  return socketRef;
}
