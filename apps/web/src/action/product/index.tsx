"use client";

import LeftMenu from "@/components/menu";
import ProductComp from "@/components/product";
import { categoryActionWrapper } from "@/src/wrappers/category-action-wrapper";
import { productActionWrapper } from "@/src/wrappers/product-action-wrapper";
import { CategoryResult, ProudctInListResult } from "@repo/api-client";

interface PageDashboardProps {
  products?: ProudctInListResult[];
  categories?: CategoryResult;
}
export default function PageProduct(props: PageDashboardProps) {
  return (
    <div className="lg:flex">
      <LeftMenu />
      <div className="w-full overflow-hidden">
        <ProductComp
          categoryAction={categoryActionWrapper}
          productAction={productActionWrapper}
          categories={props.categories}
          products={props.products}
        />
      </div>
    </div>
  );
}
