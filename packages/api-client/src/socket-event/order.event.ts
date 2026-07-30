import { OrderCreaterResult } from "../order/index.type";
import { OrderLinepayURLResult } from "../redis-event";

export interface OrderServerToClientEvents {
  "order:state": (state: OrderEvent) => void;
}

export interface OrderClientToServerEvents {
  "order:getState": () => void;
}

export type OrderSubmitState =
  | "idle" // 尚未送出
  | "submitting" // API 傳送中
  | "queued" // 已進 queue（鎖按鈕）
  | "success"
  | "failed";

export type OrderEvent =
  | {
      type: "success";
      payload: OrderCreaterResult;
      timestamp: number;
    }
  | {
      type: "linepay_url";
      payload: OrderLinepayURLResult;
      timestamp: number;
    }
  | {
      type: "failed";
      payload: {
        code: string;
        message: string;
        retryable?: boolean;
      };
      timestamp: number;
    };
