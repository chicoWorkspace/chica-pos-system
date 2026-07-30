"use client";

import AnalyticsComp from "@/components/analytics";
import LeftMenu from "@/components/menu";
import { OrderActionWrapper } from "@/src/wrappers/order-action-wrapper";

export default function PageAnalytics() {
  return (
    <div className="lg:flex">
      <LeftMenu />
      <div className="w-full">
        <AnalyticsComp orderAction={OrderActionWrapper} />
      </div>
    </div>
  );
}
