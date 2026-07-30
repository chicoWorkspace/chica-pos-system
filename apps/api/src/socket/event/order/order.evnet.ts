import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@repo/api-client";
import { rooms } from "../../rooms";

export default function systemEvents(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  const userId = socket.data.userId;
  if (typeof userId === "string" && userId.trim()) {
    socket.on("order:getState", () => {
      io.to(rooms.user(userId)).emit("order:state", {
        type: "failed",
        payload: {
          code: "test",
          message: "test",
          retryable: false,
        },
        timestamp: 132116516,
      });
    });
  }
}
