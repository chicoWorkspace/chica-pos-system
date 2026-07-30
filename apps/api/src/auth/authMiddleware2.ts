import { FastifyReply, FastifyRequest } from "fastify";

export interface AuthRequest extends FastifyRequest {
  user: any; // jwtVerify 之後自動掛上 payload，可自行改成 JwtPayload
}

export async function authMiddleware(req: AuthRequest, reply: FastifyReply) {
  try {
    // Fastify 會自動把 payload 掛到 req.user
    await req.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: "未授權或 Token 過期" });
  }
}
