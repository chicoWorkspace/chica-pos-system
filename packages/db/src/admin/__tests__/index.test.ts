import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import { Admin } from '../index';
import { ModelAdmin } from '../index.model';
import AdminModel from '../index.type';

let mongoServer: MongoMemoryServer;
let mongoConnection: typeof mongoose;

/**
 * 連接到記憶體中的 MongoDB 用於測試
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  mongoConnection = await mongoose.connect(mongoUri);
});

/**
 * 斷開連接並停止服務器
 */
afterAll(async () => {
  if (mongoConnection) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

/**
 * 清空集合
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('Admin', () => {
  let adminService: Admin;

  beforeEach(() => {
    adminService = new Admin();
  });

  describe('create', () => {
    it('應該成功創建新的管理員', async () => {
      const result = await adminService.create(
        {
          username: 'admin123',
          password: 'password123',
          isActive: true,
        }
      );

      expect(result).toBeDefined();
      expect(result.data.username).toBe('admin123');
      expect(result.data.isActive).toBe(true);
      expect(result.data.password).not.toBe('password123'); // 密碼應該被加密
    });

    it('應該正確加密密碼', async () => {
      const password = 'mySecurePassword123';
      const result = await adminService.create(
        {
          username: 'testadmin',
          password: password,
          isActive: true,
        }
      );

      const isMatch = await bcrypt.compare(password, result.data.password);
      expect(isMatch).toBe(true);
    });

    it('應該拒絕無效的管理員用戶名（少於 3 個字符）', async () => {
      await expect(
        adminService.create(
          {
            username: 'ab',
            password: 'password123',
            isActive: true,
          }
        )
      ).rejects.toThrow('3~20');
    });

    it('應該拒絕無效的管理員用戶名（包含特殊字符）', async () => {
      await expect(
        adminService.create(
          {
            username: 'admin@123',
            password: 'password123',
            isActive: true,
          }
        )
      ).rejects.toThrow('半形英數字');
    });

    it('應該拒絕無效的密碼（少於 6 個字符）', async () => {
      await expect(
        adminService.create(
          {
            username: 'validadmin',
            password: 'pass1',
            isActive: true,
          }
        )
      ).rejects.toThrow('6~30');
    });

    it('應該拒絕無效的密碼（包含特殊字符）', async () => {
      await expect(
        adminService.create(
          {
            username: 'validadmin',
            password: 'password@123',
            isActive: true,
          }
        )
      ).rejects.toThrow('半形英數字');
    });

    it('應該拒絕重複的用戶名', async () => {
      // 先創建第一個管理員
      await adminService.create(
        {
          username: 'duplicatetest',
          password: 'password123',
          isActive: true,
        }
      );

      // 嘗試使用相同的用戶名創建第二個管理員
      await expect(
        adminService.create(
          {
            username: 'duplicatetest',
            password: 'differentpass123',
            isActive: true,
          }
        )
      ).rejects.toThrow('帳號已存在');
    });

    it('應該創建多個管理員且用戶名不同', async () => {
      const admin1 = await adminService.create(
        {
          username: 'admin1',
          password: 'password123',
          isActive: true,
        }
      );

      const admin2 = await adminService.create(
        {
          username: 'admin2',
          password: 'password456',
          isActive: true,
        }
      );

      expect(admin1.data.username).toBe('admin1');
      expect(admin2.data.username).toBe('admin2');
      expect(admin1.data._id).not.toEqual(admin2.data._id);
    });

    it.skip('應該使用 session 創建管理員（事務支持）', async () => {
      // 注意：mongodb-memory-server 不支持事務（需要副本集）
      // 此測試在真實環境中應正常運行
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const result = await adminService.create(
          {
            username: 'sessionadmin',
            password: 'password123',
            isActive: true,
          },
          session
        );

        expect(result.data.username).toBe('sessionadmin');
        await session.commitTransaction();
      } finally {
        await session.endSession();
      }
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // 為每個登入測試創建一個測試用管理員
      await adminService.create(
        {
          username: 'testuser',
          password: 'correctpassword123',
          isActive: true,
        }
      );
    });

    it('應該成功登入有效的用戶名和密碼', async () => {
      const result = await adminService.login(
        {
          username: 'testuser',
          password: 'correctpassword123',
        }
      );

      expect(result).toBeDefined();
      expect(result.username).toBe('testuser');
      expect(result.isActive).toBe(true);
    });

    it('應該拒絕不存在的用戶', async () => {
      await expect(
        adminService.login(
          {
            username: 'nonexistentuser',
            password: 'anypassword123',
          }
        )
      ).rejects.toThrow('帳號不存在');
    });

    it('應該拒絕錯誤的密碼', async () => {
      await expect(
        adminService.login(
          {
            username: 'testuser',
            password: 'wrongpassword123',
          }
        )
      ).rejects.toThrow('密碼錯誤');
    });

    it('應該區分大小寫的密碼', async () => {
      await expect(
        adminService.login(
          {
            username: 'testuser',
            password: 'CORRECTPASSWORD123',
          }
        )
      ).rejects.toThrow('密碼錯誤');
    });

    it('應該正確驗證 bcrypt 加密的密碼', async () => {
      const password = 'myComplexPassword123';
      await adminService.create(
        {
          username: 'bcrypttest',
          password: password,
          isActive: true,
        }
      );

      const result = await adminService.login(
        {
          username: 'bcrypttest',
          password: password,
        }
      );

      expect(result.username).toBe('bcrypttest');
    });
  });

  describe('getAdminByUserId', () => {
    let adminId: string;

    beforeEach(async () => {
      const admin = await adminService.create(
        {
          username: 'getusertest',
          password: 'password123',
          isActive: true,
        }
      );
      adminId = admin.data._id.toString();
    });

    it('應該通過 ID 獲取管理員', async () => {
      const result = await adminService.getAdminByUserId(adminId);

      expect(result).toBeDefined();
      expect(result?.username).toBe('getusertest');
      expect(result?._id.toString()).toBe(adminId);
    });

    it('應該返回 null 當 ID 不存在', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await adminService.getAdminByUserId(fakeId);

      expect(result).toBeNull();
    });

    it('應該返回完整的管理員信息', async () => {
      const result = await adminService.getAdminByUserId(adminId);

      expect(result).toBeDefined();
      expect(result?.username).toBeDefined();
      expect(result?.password).toBeDefined();
      expect(result?.isActive).toBeDefined();
      expect(result?.createdAt).toBeDefined();
      expect(result?.updatedAt).toBeDefined();
    });
  });

  describe('update', () => {
    let adminId: string;

    beforeEach(async () => {
      const admin = await adminService.create(
        {
          username: 'updatetest',
          password: 'password123',
          isActive: true,
        }
      );
      adminId = admin.data._id.toString();
    });

    it('應該成功更新管理員信息', async () => {
      const result = await adminService.update(
        { _id: adminId },
        { isActive: false }
      );

      expect(result.data.isActive).toBe(false);
    });

    it('應該返回 null 當更新不存在的管理員時', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      await expect(
        adminService.update(
          { _id: fakeId },
          { isActive: false }
        )
      ).rejects.toThrow('更新失敗');
    });

    it('應該可以更新 refreshToken', async () => {
      const newToken = 'new_refresh_token_123456';
      const result = await adminService.update(
        { _id: adminId },
        { refreshToken: newToken }
      );

      expect(result.data.refreshToken).toBe(newToken);
    });

    it('應該保留未更新的字段', async () => {
      const newToken = 'another_token';
      const result = await adminService.update(
        { _id: adminId },
        { refreshToken: newToken }
      );

      expect(result.data.username).toBe('updatetest');
      expect(result.data.isActive).toBe(true);
    });

    it('應該更新 lastLogin 時間戳', async () => {
      const now = new Date();
      const result = await adminService.update(
        { _id: adminId },
        { lastLogin: now }
      );

      expect(result.data.lastLogin).toEqual(now);
    });

    it('應該允許多個字段同時更新', async () => {
      const newToken = 'multiple_update_token';
      const now = new Date();

      const result = await adminService.update(
        { _id: adminId },
        {
          refreshToken: newToken,
          lastLogin: now,
          isActive: false,
        }
      );

      expect(result.data.refreshToken).toBe(newToken);
      expect(result.data.lastLogin).toEqual(now);
      expect(result.data.isActive).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('應該完成完整的 create -> login -> update 流程', async () => {
      // 創建
      const created = await adminService.create(
        {
          username: 'integrationtest',
          password: 'password123',
          isActive: true,
        }
      );

      const adminId = created.data._id.toString();

      // 登入
      const loggedIn = await adminService.login(
        {
          username: 'integrationtest',
          password: 'password123',
        }
      );

      expect(loggedIn._id.toString()).toBe(adminId);

      // 更新
      const token = 'test_token_12345';
      const updated = await adminService.update(
        { _id: adminId },
        { refreshToken: token, lastLogin: new Date() }
      );

      expect(updated.data.refreshToken).toBe(token);
      expect(updated.data.lastLogin).toBeDefined();

      // 驗證
      const verified = await adminService.getAdminByUserId(adminId);
      expect(verified?.refreshToken).toBe(token);
      expect(verified?.username).toBe('integrationtest');
    });

    it('應該處理並發的創建操作', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        adminService.create(
          {
            username: `concurrent_user_${i}`,
            password: 'password123',
            isActive: true,
          }
        )
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.data.username).toBe(`concurrent_user_${index}`);
      });
    });
  });
});
