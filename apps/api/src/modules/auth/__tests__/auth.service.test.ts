import mongoose from "mongoose";
import { AuthService } from "../auth.service";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt";

const mockAdminLogin = jest.fn();
const mockAdminUpdate = jest.fn();

jest.mock("../../../utils/jwt", () => ({
  signAccessToken: jest.fn(() => "access-token"),
  signRefreshToken: jest.fn(() => "refresh-token"),
  verifyRefreshToken: jest.fn(),
}));

jest.mock("@repo/db", () => ({
  Admin: jest.fn().mockImplementation(() => ({
    login: mockAdminLogin,
    update: mockAdminUpdate,
  })),
  ModelAdmin: {
    get: jest.fn(),
  },
  ModelGroup: {
    get: jest.fn(),
  },
  ModelPage: {
    getData: jest.fn(),
  },
  ModelGroupPermissions: {
    getData: jest.fn(),
  },
}));

const mockedSignAccessToken = jest.mocked(signAccessToken);
const mockedSignRefreshToken = jest.mocked(signRefreshToken);
const mockedVerifyRefreshToken = jest.mocked(verifyRefreshToken);

describe("驗證服務", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("登入後會儲存 refresh token，並組合權限資料", async () => {
    const adminId = new mongoose.Types.ObjectId();
    const groupId = new mongoose.Types.ObjectId();
    const pageId = new mongoose.Types.ObjectId();
    const admin = { _id: adminId, username: "admin01" };
    const group = {
      _id: groupId,
      members: [{ userId: adminId, role: "owner" }],
    };
    const page = { _id: pageId, key: "products" };
    const groupPermission = { pageId, permissions: ["read", "create"] };

    const { Admin, ModelGroup, ModelPage, ModelGroupPermissions } = jest.requireMock("@repo/db");
    mockAdminLogin.mockResolvedValue(admin);
    mockAdminUpdate.mockResolvedValue({ data: admin });
    ModelGroup.get.mockResolvedValue(group);
    ModelPage.getData.mockResolvedValue([page]);
    ModelGroupPermissions.getData.mockResolvedValue([groupPermission]);

    const service = new AuthService();
    const result = await service.login({
      username: "admin01",
      password: "password123",
    });

    expect(Admin).toHaveBeenCalledTimes(1);
    expect(mockAdminLogin).toHaveBeenCalledWith({
      username: "admin01",
      password: "password123",
    });
    expect(mockedSignAccessToken).toHaveBeenCalledWith({
      id: adminId.toString(),
      username: "admin01",
    });
    expect(mockedSignRefreshToken).toHaveBeenCalledWith({
      id: adminId.toString(),
      username: "admin01",
    });
    expect(mockAdminUpdate).toHaveBeenCalledWith(
      { username: "admin01" },
      { refreshToken: "refresh-token" },
    );
    expect(ModelGroup.get).toHaveBeenCalledWith({ "members.userId": adminId });
    expect(ModelPage.getData).toHaveBeenCalledWith({});
    expect(ModelGroupPermissions.getData).toHaveBeenCalledWith({ groupId });
    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      role: { userId: adminId, role: "owner" },
      permissions: [{ pageKey: "products", actions: ["read", "create"] }],
    });
  });

  it("refresh token 與儲存值一致時會刷新 access token", async () => {
    const adminId = new mongoose.Types.ObjectId();
    mockedVerifyRefreshToken.mockReturnValue({ username: "admin01" } as any);

    const service = new AuthService();
    const { ModelAdmin } = jest.requireMock("@repo/db");
    ModelAdmin.get.mockResolvedValue({
      _id: adminId,
      username: "admin01",
      refreshToken: "valid-refresh-token",
    });

    const result = await service.refresh({ refreshToken: "valid-refresh-token" });

    expect(mockedVerifyRefreshToken).toHaveBeenCalledWith("valid-refresh-token");
    expect(ModelAdmin.get).toHaveBeenCalledWith({ username: "admin01" });
    expect(mockedSignAccessToken).toHaveBeenCalledWith({
      id: adminId.toString(),
      username: "admin01",
    });
    expect(result).toEqual({ accessToken: "access-token" });
  });

  it("refresh token 與儲存值不一致時會拒絕刷新", async () => {
    mockedVerifyRefreshToken.mockReturnValue({ username: "admin01" } as any);

    const service = new AuthService();
    const { ModelAdmin } = jest.requireMock("@repo/db");
    ModelAdmin.get.mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      username: "admin01",
      refreshToken: "stored-token",
    });

    await expect(service.refresh({ refreshToken: "incoming-token" })).rejects.toThrow();
  });

  it("取得已驗證使用者的權限", async () => {
    const userId = new mongoose.Types.ObjectId();
    const groupId = new mongoose.Types.ObjectId();
    const pageId = new mongoose.Types.ObjectId();

    const service = new AuthService();
    const { ModelGroup, ModelPage, ModelGroupPermissions } = jest.requireMock("@repo/db");
    ModelGroup.get.mockResolvedValue({
      _id: groupId,
      members: [{ userId, role: "member" }],
    });
    ModelPage.getData.mockResolvedValue([{ _id: pageId, key: "orders" }]);
    ModelGroupPermissions.getData.mockResolvedValue([
      { pageId, permissions: ["read"] },
    ]);

    const result = await service.getPermissions({ id: userId.toString() });

    expect(ModelGroup.get).toHaveBeenCalledWith({ "members.userId": userId.toString() });
    expect(result).toEqual({
      permissions: [{ pageKey: "orders", actions: ["read"] }],
    });
  });

  it("沒有使用者資料時會拒絕取得權限", async () => {
    const service = new AuthService();

    await expect(service.getPermissions(null)).rejects.toThrow();
  });

  it("使用者沒有群組時會拒絕取得權限", async () => {
    const service = new AuthService();
    const { ModelGroup } = jest.requireMock("@repo/db");
    ModelGroup.get.mockResolvedValue(null);

    await expect(service.getPermissions({ id: "user-1" })).rejects.toThrow();
  });
});
