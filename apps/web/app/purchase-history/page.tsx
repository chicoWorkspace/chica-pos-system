import PagePurchaseHistory from "@/src/action/purchase-history";
import { OrderActionWrapper } from "@/src/wrappers/order-action-wrapper";

export default async function Page() {
  const orders = await OrderActionWrapper.get({}).catch(() => {
    return [];
  });

  return <PagePurchaseHistory orders={orders} />;
}
