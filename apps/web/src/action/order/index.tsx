"use client";

import LeftMenu from "@/components/menu";
import OrderComp from "@/components/order";
import { useWebSocket } from "@/hooks/use-web-socket";
import { CategoryResult, ProudctInListResult } from "@repo/api-client";
import { useEffect } from "react";

interface PageDashboardProps {
  products: ProudctInListResult[];
  categories?: CategoryResult;
}
export default function PageOrder(props: PageDashboardProps) {
  const ctx = useWebSocket();
  if (!ctx) return null;
  const { socket } = ctx;

  useEffect(() => {
    socket?.on("system:announcement", (msg) => {
    });
  }, [socket]);

  return (
    <div className="lg:flex">
      <LeftMenu />
      <div className="lg:flex-1">
        <OrderComp categories={props.categories} products={props.products} />
      </div>
    </div>
  );
}
