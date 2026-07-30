import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;

// 只負責拿取現有的連線
export const getSocket = () => _socket;

export const connectSocket = (endpoint: string, token?: string) => {
  // 如果已經連線且參數沒變，就不用重連
  if (_socket?.connected) return _socket;

  // 如果舊的連線存在但沒連上，先關掉它
  if (_socket) {
    _socket.close();
  }

  console.log("正在建立 Socket 連線...", { endpoint, hasToken: !!token });

  _socket = io(endpoint, {
    transports: ["websocket"],
    auth: { token },
  });

  return _socket;
};
