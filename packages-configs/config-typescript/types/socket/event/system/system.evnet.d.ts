import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@repo/api-client";
export default function systemEvents(io: Server<ClientToServerEvents, ServerToClientEvents>, socket: Socket<ClientToServerEvents, ServerToClientEvents>): void;
