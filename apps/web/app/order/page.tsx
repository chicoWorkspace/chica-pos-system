import { formatProduct } from "@/lib/format-product";
import PageOrder from "@/src/action/order";
import { categoryActionWrapper } from "@/src/wrappers/category-action-wrapper";
import { productActionWrapper } from "@/src/wrappers/product-action-wrapper";

export default async function Page() {
  const [productsRes, categoriesRes] = await Promise.all([
    productActionWrapper.get({}).catch(() => null),
    categoryActionWrapper.get().catch(() => []),
  ]);

  const products = formatProduct(productsRes ?? []);
  const categories = categoriesRes ?? [];
  return <PageOrder categories={categories} products={products} />;
}
