export interface SystemServerToClientEvents {
  "system:announcement": (msg: string) => void;
}

export interface SystemClientToServerEvents {
  "system:triger": () => void;
  "system:send-message": (payload: { roomId: string; content: string }) => void;
}
