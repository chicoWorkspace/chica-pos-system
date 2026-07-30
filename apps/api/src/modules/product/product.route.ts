import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authMiddleware } from "../../auth/authMiddleware2";
import { ProductService } from "./product.service";
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateProductRequest,
  UpdateProductRequest as a,
} from "./product.schema";
import {
  ProductGetParams,
  UpdateProductRequest,
} from "@repo/api-client";

export const productRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const service = new ProductService();

  // GET /product
  fastify.get<{ Querystring: ProductGetParams }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Product"],
        summary: "取得商品列表",
        description:
          "依查詢參數取得商品列表，用於後台商品管理、POS 點餐頁面等場景。",
      },
    },
    async (req) => {
      const filter = req.query;
      const result = await service.list(filter);
      return { status: "success", data: result, error: null };
    }
  );

  // POST /product
  fastify.post<{ Body: CreateProductRequest }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Product"],
        summary: "建立新商品",
        description:
          "新增一個商品，包含基本資訊、規格庫存（spec inventories）、商品圖片等。",
        body: CreateProductSchema,
      },
    },
    async (req) => {
      const { product, specInventories, photos } = req.body;
      if (!product || !specInventories?.length) {
        throw new Error("缺少必要參數 product 或 specInventories");
      }
      const newProduct = await service.create({
        product,
        specInventories,
        photos,
      });
      const productInListData = await service.list({
        _id: newProduct.data._id,
      });
      return { status: "success", data: productInListData, error: null };
    }
  );

  // PATCH /product/:id
  fastify.patch<{ Body: UpdateProductRequest; Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Product"],
        summary: "更新商品內容",
        description:
          "更新商品，包括基本資料、規格（spec inventories）、商品圖片等內容。",
        body: UpdateProductSchema,
      },
    },
    async (req) => {
      const { product, specInventories, photos } = req.body;
      if (!product || !specInventories?.length || !photos?.length) {
        throw new Error("缺少必要參數 product 或 specInventories 或 photos");
      }
      const newProduct = await service.update({
        product: { ...product, _id: req.params.id },
        specInventories,
        photos,
      });

      const productInListData = await service.list({
        _id: newProduct.data._id,
      });
      return { status: "success", data: productInListData[0], error: null };
    }
  );

  // DELETE /product/:id
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Product"],
        summary: "刪除商品",
        description: "刪除指定商品（一般為軟刪除），用於後台商品管理。",
      },
    },
    async (req) => {
      if (!req.params.id) throw new Error("缺少必要參數 id");
      const oldProduct = await service.delete(req.params.id);
      return { status: "success", data: oldProduct.data, error: null };
    }
  );

  // DELETE /product/:productId/spec/:specId
  fastify.delete<{ Params: { productId: string; specId: string } }>(
    "/:productId/spec/:specId",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Product"],
        summary: "刪除商品規格",
        description:
          "移除指定商品的某一個規格（Spec Inventory），通常用於後台維護商品資料。",
      },
    },
    async (req) => {
      const { productId, specId } = req.params;
      if (!productId || !specId) throw new Error("缺少必要參數 id");
      const result = await service.deleteSpec(productId, specId);
      return { status: "success", data: result.data, error: null };
    }
  );
};
