import { RedisSocketEvent } from "@repo/api-client";
import { RedisClientType } from "redis";
export type RedisEvent = {
    type: string;
    payload: any;
};
export declare function subscribeSocketEvents(sub: RedisClientType, onEvent: (event: RedisSocketEvent) => void): Promise<void>;
