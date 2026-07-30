import { FastifyReply, FastifyRequest } from "fastify";
export interface AuthRequest extends FastifyRequest {
    user: any;
}
export declare function authMiddleware(req: AuthRequest, reply: FastifyReply): Promise<undefined>;
