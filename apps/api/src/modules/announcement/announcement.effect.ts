// services/orderEffectService.ts

import { OrderCreaterResult } from "@repo/api-client";
import { AnnouncementService } from "./announcement.service";

export async function createOrderAnnouncement(order: OrderCreaterResult) {
  const announcementService = new AnnouncementService();

  const newAnnouncement = await announcementService.add({
    title: "新訂單建立",
    content: `訂單 ${order.orderNumber} 已建立。`,
    type: "info",
    isActive: true,
    link: {
      action: "purchase_history",
      params: {
        orderNumber: order.orderNumber,
      },
    },
  });

  return newAnnouncement;
}
