import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import { Order } from '../index';
import { ModelOrder } from '../index.model';
import { ModelAdmin } from '../../admin/index.model';
import { ModelProduct } from '../../product/index.model';
import { ModelSpecInventory } from '../../spec-inventory/index.model';
import { ModelPhoto } from '../../photo/index.model';
import AdminModel from '../../admin/index.type';
import { getProductModel } from '../../product/index.model';
import { getSpecInventoryModel } from '../../spec-inventory/index.model';
import { getPhotoModel } from '../../photo/index.model';

let mongoServer: MongoMemoryServer;
let mongoConnection: typeof mongoose;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  mongoConnection = await mongoose.connect(mongoUri);
});

afterAll(async () => {
  if (mongoConnection) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

/**
 * 測試數據工廠
 */
class TestDataFactory {
  /**
   * 創建測試管理員
   */
  static async createAdmin(
    username: string = 'testadmin',
    password: string = 'password123'
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new AdminModel({
      username,
      password: hashedPassword,
      isActive: true,
      refreshToken: '',
    });
    return admin.save();
  }

  /**
   * 創建測試商品
   */
  static async createProduct(
    name: string = 'Test Product',
    categoryName: string = 'Test Category'
  ) {
    const category = new mongoose.Types.ObjectId();
    const ProductModel = getProductModel();
    const product = new ProductModel({
      categoryUuid: category,
      categoryName,
      name,
      isShown: true,
      description: 'Test product description',
    });
    return product.save();
  }

  /**
   * 創建測試規格庫存
   */
  static async createSpecInventory(
    productUuid: mongoose.Types.ObjectId,
    options: {
      spec?: string;
      name?: string;
      originalPrice?: number;
      salePrice?: number;
      stock?: number;
      cost?: number;
      vipPrice?: number;
    } = {}
  ) {
    const SpecInventoryModel = getSpecInventoryModel();
    const specInventory = new SpecInventoryModel({
      productUuid,
      spec: options.spec || 'Size-M',
      name: options.name || 'Medium Size',
      originalPrice: options.originalPrice || 1000,
      salePrice: options.salePrice || 800,
      stock: options.stock !== undefined ? options.stock : 100,
      cost: options.cost || 500,
      vipPrice: options.vipPrice || 750,
    });
    return specInventory.save();
  }

  /**
   * 創建測試照片
   */
  static async createPhoto(
    specUuid: mongoose.Types.ObjectId,
    productUuid: mongoose.Types.ObjectId
  ) {
    const PhotoModel = getPhotoModel();
    const photo = new PhotoModel({
      specUuid,
      productUuid,
      filename: 'photo.jpg',
      rank: 1,
      alt: 'Test product photo',
    });
    return photo.save();
  }
}

describe('Order - createOrder', () => {
  let orderService: Order;
  let testAdmin: any;
  let testProduct: any;
  let testSpec: any;

  beforeEach(async () => {
    orderService = new Order();

    // 創建測試數據
    testAdmin = await TestDataFactory.createAdmin('orderadmin', 'password123');
    testProduct = await TestDataFactory.createProduct('Cotton Candy', 'Sweets');
    testSpec = await TestDataFactory.createSpecInventory(testProduct._id, {
      spec: 'Size-Large',
      name: 'Large Cotton Candy',
      originalPrice: 500,
      salePrice: 400,
      stock: 50,
    });
    await TestDataFactory.createPhoto(testSpec._id, testProduct._id);
  });

  describe.skip('成功創建訂單 (需要真實 MongoDB 副本集)', () => {
    /**
     * ⚠️ 注意：Order.createOrder() 使用 MongoDB 事務
     * mongodb-memory-server 不支持事務（需要副本集）
     * 
     * 這些測試應在以下環境中運行：
     * 1. Docker Compose MongoDB 副本集
     * 2. MongoDB Atlas 真實環境
     * 3. 帶有 --replSet 的本地 MongoDB
     * 
     * 在真實環境中執行測試：
     * MONGODB_URI=mongodb://localhost:27017/test pnpm test:integration
     */
    
    it('應該成功創建現金支付的訂單', async () => {
      const result = await orderService.createOrder({
        orderNumber: 'ORD-001',
        userId: testAdmin._id.toString(),
        paymentMethod: 'cash',
        items: [
          {
            specId: testSpec._id,
            quantity: 5,
          },
        ],
        tipRate: 0,
      });

      expect(result).toBeDefined();
      expect(result.data.orderNumber).toBe('ORD-001');
      expect(result.data.status).toBe('paid');
    });
  });

  describe('驗證錯誤處理', () => {
    it.skip('應該拒絕缺少 specId 的商品', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該拒絕不存在的規格', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該拒絕庫存不足的訂單', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該拒絕無效的管理員 ID', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該在庫存不足時回滾事務', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });
  });

  describe('複雜場景', () => {
    it.skip('應該正確處理多個商品且庫存多次扣減', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該在部分商品庫存不足時整體回滾', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該支持大量訂單創建', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });
  });

  describe('邊界情況', () => {
    it.skip('應該正確處理數量為 1 的訂單', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該正確處理恰好等於庫存的數量', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });

    it.skip('應該正確處理大數字金額計算', async () => {
      // 跳過：需要真實 MongoDB 副本集
    });
  });

  describe('Order.add() - 直接添加訂單（無事務）', () => {
    it('應該成功直接添加訂單', async () => {
      const orderParams = {
        orderNumber: 'DIRECT-ORD-001',
        items: [
          {
            specId: testSpec._id,
            productId: testProduct._id,
            snapshot: {
              name: 'Test Product',
              categoryUuid: new mongoose.Types.ObjectId(),
              categoryName: 'Test Category',
              price: 400,
            },
            quantity: 2,
            subtotal: 800,
          },
        ],
        totalAmount: 800,
        discountAmount: 0,
        finalAmount: 800,
        status: 'paid' as const,
        payment: {
          method: 'cash' as const,
          paidAt: new Date(),
        },
        staff: {
          userId: testAdmin._id,
          username: testAdmin.username,
        },
      };

      const result = await orderService.add(orderParams);

      expect(result).toBeDefined();
      expect(result.data.orderNumber).toBe('DIRECT-ORD-001');
      expect(result.data.totalAmount).toBe(800);
      expect(result.data.status).toBe('paid');
    });

    it('應該獲取已添加的訂單', async () => {
      const orderParams = {
        orderNumber: 'GET-ORD-001',
        items: [
          {
            specId: testSpec._id,
            productId: testProduct._id,
            snapshot: {
              name: 'Product A',
              categoryUuid: new mongoose.Types.ObjectId(),
              categoryName: 'Category A',
              price: 500,
            },
            quantity: 1,
            subtotal: 500,
          },
        ],
        totalAmount: 500,
        discountAmount: 0,
        finalAmount: 500,
        status: 'pending' as const,
        payment: {
          method: 'credit' as const,
        },
        staff: {
          userId: testAdmin._id,
          username: testAdmin.username,
        },
      };

      await orderService.add(orderParams);
      const retrieved = await orderService.get({ orderNumber: 'GET-ORD-001' });

      expect(retrieved).toBeDefined();
      expect(retrieved.orderNumber).toBe('GET-ORD-001');
      expect(retrieved.finalAmount).toBe(500);
    });

    it('應該返回多筆訂單', async () => {
      const adminId = testAdmin._id;

      // 創建多筆訂單
      for (let i = 0; i < 3; i++) {
        await orderService.add({
          orderNumber: `MULTI-ORD-${i}`,
          items: [
            {
              specId: testSpec._id,
              productId: testProduct._id,
              snapshot: {
                name: 'Product',
                categoryUuid: new mongoose.Types.ObjectId(),
                categoryName: 'Category',
                price: 400,
              },
              quantity: 1,
              subtotal: 400,
            },
          ],
          totalAmount: 400,
          discountAmount: 0,
          finalAmount: 400,
          status: 'paid' as const,
          payment: {
            method: 'cash' as const,
            paidAt: new Date(),
          },
          staff: {
            userId: adminId,
            username: testAdmin.username,
          },
        });
      }

      const orders = await orderService.getData({ 'staff.userId': adminId });
      expect(orders.length).toBeGreaterThanOrEqual(3);
    });
  });
});
