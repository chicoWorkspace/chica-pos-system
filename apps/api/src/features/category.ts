import {
  CategoryAddParams as apiCategoryAddParams,
  CategoryUpdateParams as apiCategoryUpdateParams,
  CategoryResult,
  CategoryGetParams as apiCategoryGetParams,
} from "@repo/api-client/";
import { Category } from "@repo/db";
import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
  CategoryGetParams,
  CategoryAddParams,
  CategoryUpdateParams,
} from "@repo/db";
import { object } from "zod";

const router = Router();
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categoryFeature = new Category();
    const params: apiCategoryGetParams = req.query;
    const filter: CategoryGetParams = {};

    if (params.id) filter._id = params.id;
    if (params.name) filter.name = params.name;

    const data = await categoryFeature.list(filter);
    const result: CategoryResult = data.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

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
    const categoryFeature = new Category();
    const body: apiCategoryAddParams = req.body;
    const params: CategoryAddParams = {
      name: "",
      icon: "",
      order: 0,
      isActive: true,
    };

    if (!body.name || !body.icon) {
      return res
        .status(400)
        .json({ status: "error", data: null, error: "name 和 icon 必填" });
    }

    params.name = body.name.trim();
    params.icon = body.icon.trim();

    // 如果前端沒給 order，取得目前最大 order +1
    if (body.order === undefined) {
      const maxOrderDoc = await categoryFeature.list({}, { order: -1 });
      params.order = maxOrderDoc.length == 0 ? 1 : maxOrderDoc[0].order + 1;
    }
    const newCategory = await categoryFeature.add(params);

    res.json({
      status: "success",
      data: newCategory,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", data: null, error: err.message });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const categoryFeature = new Category();
    const body: apiCategoryUpdateParams = req.body;

    const params: CategoryUpdateParams = {};

    if (body.name !== undefined) {
      params.name = body.name;
    }
    if (body.icon !== undefined) {
      params.icon = body.icon;
    }
    if (body.isActive !== undefined) {
      params.isActive = body.isActive;
    }

    const category = await categoryFeature.update(
      { _id: req.params.id },
      params
    );
    if (!category)
      return res.status(404).json({ status: "error", error: "分類不存在" });

    res.json({ status: "success", data: category.data });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const categoryFeature = new Category();
    const category = await categoryFeature.deleteCategory(req.params.id);

    res.json({ status: "success", data: category.data });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export { router as CategoryRouter };
