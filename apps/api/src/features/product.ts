import { Product } from "@repo/db";
import { SpecInventory } from "@repo/db";
import { Photo } from "@repo/db";
import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";

import {
  ApiProudctInListResult,
  ProductGetParams,
  ProductResult,
  UpdateProductRequest,
} from "@repo/api-client";
import { ProductUpdateParams } from "@repo/db";
import mongoose from "mongoose";

const router = Router();
router.get("/", authMiddleware, async (req, res) => {
  try {
    const ProductFeature = new Product();
    const params: ProductGetParams = req.query;

    const result: ApiProudctInListResult[] = 
      await ProductFeature.getData(params);

    res.json({
      status: "success",
      data: result, 
      error: null,
    });
  } catch (err: any) {
    res.json({
      status: "error",
      data: null,
      error: err.message,
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { product, specInventories, photos } = req.body;
    if (!product || !specInventories?.length) {
      return res.status(400).json({
        message: "缺少必要參數 product 或 specInventories",
        product_uuid: "",
      });
    }

    const productFeature = new Product();
    const newProduct = await productFeature.createProduct(
      product, 
      specInventories,
      photos
    ); 

    const productInListData: ApiProudctInListResult[] =
      await productFeature.getData({
        _id: newProduct.data._id,
      });

    res.json({
      status: "success",
      data: productInListData,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", data: null, error: err.message });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const productFeature = new Product();
    const body: UpdateProductRequest = req.body;

    const { product, specInventories, photos } = body;
    if (!product || !specInventories?.length || !photos?.length) {
      return res.status(400).json({
        message: "缺少必要參數 product 或 specInventories 或 photos",
        product_uuid: "",
      });
    }

    const newProduct = await productFeature.UpdateProduct(
      { ...product, _id: req.params.id },
      specInventories,
      photos
    );

    const productInListData: ApiProudctInListResult[] =
      await productFeature.getData({
        _id: newProduct.data._id,
      });

    res.json({
      status: "success",
      data: productInListData[0],
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const product_id = req.params.id;
  try {
    if (!product_id) {
      return res.status(400).json({
        message: "缺少必要參數 id",
        product_uuid: "",
      });
    }
    const productFeature = new Product();
    const oldProduct = await productFeature.deleteProduct(product_id);

    res.json({ status: "success", data: oldProduct.data });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.delete("/:productId/spec/:specId", authMiddleware, async (req, res) => {
  const specId = req.params.specId;
  const productId = req.params.productId;
 
  try {
    if (!productId || !specId) { 
      return res.status(400).json({
        message: "缺少必要參數 id",
        spec_uuid: "",
      });
    }

    const specInventoryFeature = new SpecInventory();
    const result = await specInventoryFeature.deleteSpecInventory(
      productId,
      specId
    );

    res.json({ status: "success", data: result.data });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
export { router as ProductRouter };
