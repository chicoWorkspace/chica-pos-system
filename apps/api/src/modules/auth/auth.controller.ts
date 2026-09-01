import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service";

const authService = new AuthService();

function createHttpError(statusCode: number, message: string) {
  return Object.assign(new Error(message), { statusCode });
}

export async function loginController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await authService.login(req.body as any);
    reply.send({ status: "success", data: result, error: null });
  } catch {
    throw createHttpError(401, "帳號或密碼錯誤");
  }
}

export async function refreshController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await authService.refresh(req.body as any);
    reply.send({ status: "success", data: result, error: null });
  } catch {
    throw createHttpError(403, "登入狀態已失效，請重新登入");
  }
}

export async function permissionsController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const result = await authService.getPermissions((req as any).user);
  reply.send({ status: "success", data: result });
}
