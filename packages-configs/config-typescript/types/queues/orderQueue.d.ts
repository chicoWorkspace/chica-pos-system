import { Queue } from "bullmq";
export declare const orderQueue: Queue<any, any, string, any, any, string>;
export declare function showJobs(): Promise<void>;
