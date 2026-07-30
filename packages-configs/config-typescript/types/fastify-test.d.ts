import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
export declare function buildServer(): Promise<import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, TypeBoxTypeProvider>>;
export declare function startServer(): Promise<void>;
