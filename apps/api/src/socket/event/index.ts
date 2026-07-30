import { Server, Socket } from "socket.io";
import { rooms } from "../rooms";
import systemEvents from "./system/system.evnet";

export function registerEvents(io: Server, socket: Socket) {
  const data = socket.data;
    

  // 有登入資料進入個人通知房
  if (data && data.user) {
    const userId = data.user.id;
    
    socket.join(rooms.user(userId));
  }

  // 加入全員通知房
  socket.join(rooms.all);

  // 註冊通知事件
  systemEvents(io, socket);
  
}
