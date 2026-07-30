"use client";

import LeftMenu from "@/components/menu";
import PurchaseHistoryComp from "@/components/purchase-history";
import { OrderActionWrapper } from "@/src/wrappers/order-action-wrapper";

import { OrdersResult } from "@repo/api-client";

interface PageDashboardProps {
  orders?: OrdersResult;
}
export default function PagePurchaseHistory(props: PageDashboardProps) {
  return (
    <div className="lg:flex">
      <LeftMenu />
      <div className="w-full overflow-hidden">
        <PurchaseHistoryComp
          orderAction={OrderActionWrapper}
          orders={props.orders}
        />
      </div>
    </div>
  );
}
