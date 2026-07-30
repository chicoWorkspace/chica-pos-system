import { OrderService } from "../order.service";

jest.mock("@repo/db", () => ({
  Order: jest.fn().mockImplementation(() => ({
    getData: jest.fn(),
    update: jest.fn(),
  })),
}));

describe("訂單服務", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("依訂單 id、狀態、使用者與日期區間組合查詢條件", async () => {
    const orders = [{ orderNumber: "OR2026060300001" }];
    const service = new OrderService();
    const { Order } = jest.requireMock("@repo/db");
    Order.mock.results[0].value.getData.mockResolvedValue(orders);

    const result = await service.list({
      orderId: "order-1",
      userId: "alice",
      status: "paid" as any,
      createdAtFrom: "2026-06-01",
      createdAtTo: "2026-06-03",
    });

    expect(result).toBe(orders);
    expect(Order.mock.results[0].value.getData).toHaveBeenCalledWith({
      _id: "order-1",
      "staff.customerName": { $regex: "alice", $options: "i" },
      status: "paid",
      createdAt: {
        $gte: new Date("2026-06-01"),
        $lte: new Date("2026-06-03"),
      },
    });
  });

  it("更新付款狀態時會設定狀態與付款時間", async () => {
    const service = new OrderService();
    const { Order } = jest.requireMock("@repo/db");
    const updatedOrder = { _id: "order-1", status: "paid" };
    Order.mock.results[0].value.update.mockResolvedValue(updatedOrder);

    const result = await service.updatePaymentStatus("order-1", "paid");

    expect(result).toBe(updatedOrder);
    expect(Order.mock.results[0].value.update).toHaveBeenCalledWith(
      { _id: "order-1" },
      {
        status: "paid",
        "payment.paidAt": expect.any(Date),
      },
    );
  });

  it("沒有有效 callback token 時不會更新訂單", async () => {
    const service = new OrderService();
    const { Order } = jest.requireMock("@repo/db");

    await expect(
      service.updatePaymentStatus("order-1", "paid", { token: "invalid-token" }),
    ).rejects.toThrow("無效的付款回調授權");

    expect(Order.mock.results[0].value.update).not.toHaveBeenCalled();
  });
});
