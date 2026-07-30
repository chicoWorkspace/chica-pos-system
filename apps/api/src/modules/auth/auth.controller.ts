import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export async function loginController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await authService.login(req.body as any);
    reply.send({ status: "success", data: result, error: null });
  } catch (err: any) {
    reply.send({ status: "error", data: null, error: err.message });
  }
}

export async function refreshController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await authService.refresh(req.body as any);
    reply.send({ status: "success", data: result, error: null });
  } catch (err: any) {
    reply.status(403).send({ status: "error", error: err.message });
  }
}

export async function permissionsController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await authService.getPermissions((req as any).user);
    reply.send({ status: "success", data: result });
  } catch (err: any) {
    reply.status(500).send({ status: "error", error: err.message });
  }
}
