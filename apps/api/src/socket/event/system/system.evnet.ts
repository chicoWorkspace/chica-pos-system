import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@repo/api-client";
import { rooms } from "../../rooms";

export default function systemEvents(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  io.to(rooms.all).emit("system:announcement", "歡迎使用本系統！");


  socket.on("system:triger", () => {
    
  });
  socket.on("system:send-message", (payload) => {
    
    io.to(payload.roomId).emit(
      "system:announcement",
      `房間 ${payload.roomId} 收到新訊息: ${payload.content}`
    );
  });
  
}
