import {
  GetPermissionsResult,
  LoginResult,
  PagePermissions,
} from "@repo/api-client";
import { Admin } from "@repo/db";
import { ModelAdmin } from "@repo/db";
import { Router } from "express";
import { JwtPayload } from "../types/jwt";
import { GetEnvConfig } from "../utils";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { model } from "mongoose";
import { ModelGroupPermissions } from "@repo/db";
import { ModelGroup } from "@repo/db";
import { ModelPage } from "@repo/db";
import { authMiddleware } from "../auth/authMiddleware";
import { Request, Response } from "express";
import { AuthRequest } from "../types";
const config = GetEnvConfig();
const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRES = config.JWT_EXPIRES;
const NODE_ENV = config.NODE_ENV;

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const adminFeature = new Admin();
    const { username, password } = req.body;
    const admin = await adminFeature.login({ username, password });

    const signData: JwtPayload = {
      id: admin._id.toString(),
      username: admin.username,
    };

    const accessToken = signAccessToken(signData);
    const refreshToken = signRefreshToken(signData);

    await adminFeature.update({ username }, { refreshToken });

    const group = await ModelGroup.get({ "members.userId": admin._id });
    if (!group) {
      throw new Error("查無組別");
    }

    const role =
      group.members.find((item) => item.userId === admin._id) ?? "member";

    const pages = await ModelPage.getData({});

    const groupPermissions = await ModelGroupPermissions.getData({
      groupId: group._id,
    });

    /**
     * 組合該組操作權限
     * {
     *   "pageKey": "product-page",
     *   "actions": ["view", "edit", "delete"]
     * }
     */

    const permissions: PagePermissions[] = groupPermissions
      ? groupPermissions?.map((p) => {
          const currentPage = pages?.find(
            (page) => page._id.toString() == p.pageId.toString()
          );
          return {
            pageKey: currentPage?.key ?? "",
            actions: p.permissions,
          };
        })
      : [];

    res.json({
      status: "success",
      data: { accessToken, refreshToken, role, permissions } as LoginResult,
      error: null,
    });
  } catch (err: any) {
    res.json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

//更新長效token
router.post("/refresh", async (req, res) => {
  

  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "未授權，缺少refresh token" });
  }

  try {
    //驗證長效token, 失效就會要求前端登出
    const decoded = verifyRefreshToken(refreshToken);
    const admin = await ModelAdmin.get({ username: decoded.username });
    if (!admin) {
      return res.status(401).json({ message: "帳號不存在" });
    }

    if (admin.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "未授權，長效token不正確" });
    }

    //重新簽短效token
    const newAccessToken = signAccessToken({
      id: admin._id.toString(),
      username: admin.username,
    });

    res.json({
      status: "success",
      data: { accessToken: newAccessToken },
      error: null,
    });
  } catch (err: any) {
    res.status(403).json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

router.get("/permissions", authMiddleware, async (req: AuthRequest, res) => {
  
  
  const user = req.user;
  try {
    if (!user) {
      throw new Error("查無使用者資訊");
    }

    const group = await ModelGroup.get({ "members.userId": user.id });
    if (!group) {
      throw new Error("查無組別");
    }

    const role =
      group.members.find((item) => item.userId.toString() === user.id) ??
      "member";

    const pages = await ModelPage.getData({});
    const groupPermissions = await ModelGroupPermissions.getData({
      groupId: group._id,
    });

    /**
     * 組合該組操作權限
     * {
     *   "pageKey": "product-page",
     *   "actions": ["view", "edit", "delete"]
     * }
     */
    const permissions = groupPermissions
      ? groupPermissions?.map((p) => {
          const currentPage = pages?.find(
            (page) => page._id.toString() == p.pageId.toString()
          );
          return {
            pageKey: currentPage?.key ?? "",
            actions: p.permissions,
          };
        })
      : [];

    res.json({
      status: "success",
      data: { permissions } as GetPermissionsResult,
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export { router as AuthRouter };
