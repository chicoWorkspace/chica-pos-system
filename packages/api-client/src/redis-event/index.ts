import { OrderCreaterResult } from "../order/index.type";

//redis廣播回傳型態

export type RedisOrderCompletedEvent = {
  type: "order:completed";
  userId: string;
  payload: OrderCreaterResult;
};

export type RedisOrderLinepayURLEvent = {
  type: "order:linepay_url";
  userId: string;
  payload: OrderLinepayURLResult;
};

export type OrderLinepayURLResult = {
  web: string;
  app: string;
};

export type RedisOrderFailedEvent = {
  type: "order:failed";
  userId: string;
  payload: {
    code: string;
    message: string;
    retryable?: boolean;
  };
};

export type RedisSocketEvent =
  | RedisOrderCompletedEvent
  | RedisOrderLinepayURLEvent
  | RedisOrderFailedEvent;
