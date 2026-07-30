import { ProdcutTableProps } from "@/components/product/index";
import {
  ProductProps,
  ProudctInListResult,
} from "@repo/api-client";

export function formatProduct(
  product: ProudctInListResult[]
): ProudctInListResult[] {
  return product.map((item) => {
    const formattedItem = { ...item };
    if (formattedItem.specInventories.length > 0) {
      formattedItem.specInventories = formattedItem.specInventories.map(
        (spec) => ({
          ...spec,
          categoryName: item.product.categoryName,
          categoryUuid: item.product.categoryUuid.toString(),
          photo:
            formattedItem.photos.filter(
              (item) => item.specUuid == spec._id
            )[0] || null,
        })
      );
    }
    return formattedItem;
  });
}

export function formatProdcutTable(
  product: ProudctInListResult[]
): ProdcutTableProps[] {
  console.log("formatProdcutTable product", product);

  return product.map((item) => {
    const formattedItem: ProdcutTableProps = {
      ...item.product,
      specInventories: item.specInventories.map((spec) => ({
        ...spec,
        categoryName: item.product.categoryName,
        categoryUuid: item.product.categoryUuid.toString(),
        photo: item.photos.find((photo) => photo.specUuid === spec._id) || null,
      })),
      photos: item.photos,
    };
    return formattedItem;
  });
}
