import { Admin } from "@repo/db";
import { ModelAdmin } from "@repo/db";
import { ModelGroup } from "@repo/db";
import { ModelPage } from "@repo/db";
import { ModelGroupPermissions } from "@repo/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export class AuthService {
  
  async login({ username, password }: { username: string; password: string }) {
    const adminFeature = new Admin();
    const admin = await adminFeature.login({ username, password });

    const tokenPayload = {
      id: admin._id.toString(),
      username: admin.username,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await adminFeature.update({ username }, { refreshToken });

    // group
    const group = await ModelGroup.get({ "members.userId": admin._id });
    if (!group) throw new Error("查無組別");

    const role =
      group.members.find((m) => m.userId === admin._id) ?? "member";

    // pages
    const pages = await ModelPage.getData({});
    const groupPermissions = await ModelGroupPermissions.getData({
      groupId: group._id,
    });

    const permissions = groupPermissions?.map((p) => {
      const currentPage = pages?.find(
        (page) => page._id.toString() === p.pageId.toString()
      );
      return {
        pageKey: currentPage?.key ?? "",
        actions: p.permissions,
      };
    }) ?? [];

    return { accessToken, refreshToken, role, permissions };
  }

  async refresh({ refreshToken }: { refreshToken: string }) {
    const decoded = verifyRefreshToken(refreshToken);
    const admin = await ModelAdmin.get({ username: decoded.username });

    if (!admin) throw new Error("帳號不存在");
    if (admin.refreshToken !== refreshToken) throw new Error("長效 token 不正確");

    const newAccessToken = signAccessToken({
      id: admin._id.toString(),
      username: admin.username,
    });

    return { accessToken: newAccessToken };
  }

  async getPermissions(user: any) {
    if (!user) throw new Error("查無使用者資訊");

    const group = await ModelGroup.get({ "members.userId": user.id });
    if (!group) throw new Error("查無組別");

    const role =
      group.members.find((m) => m.userId.toString() === user.id) ?? "member";

    const pages = await ModelPage.getData({});
    const groupPermissions = await ModelGroupPermissions.getData({
      groupId: group._id,
    });

    const permissions = groupPermissions?.map((p) => {
      const currentPage = pages?.find(
        (page) => page._id.toString() === p.pageId.toString()
      );
      return {
        pageKey: currentPage?.key ?? "",
        actions: p.permissions,
      };
    }) ?? [];

    return { permissions };
  }
}
