import {
  PageCreateParams,
  PagesGetParams,
  PagesResult,
} from "@repo/api-client";
import { Page } from "@repo/db";
import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";

const router = Router();

/**
 * @route GET /page
 * @desc 取得組別頁面列表
 * @access 登入者限定
 * @queryParam {string} [groupId] 指定組別 ID，用於篩限資料
 * @queryParam {string} [pageId] 指定頁面 ID，用於篩限資料
 * @returns {object} 200 - 回傳清單
 * @returns {string} 200.status - 狀態 success 或 error
 * @returns {Array} 200.data - 資料陣列
 * @returns {string|null} 200.error - 錯誤訊息（若有）
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter: PagesGetParams = req.query;
    const pageFeature = new Page();
    const result: PagesResult = await pageFeature.list(filter);
    
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

/**
 * @route POST /page
 * @desc 建立新的組別
 * @access 管理員限定
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data: PageCreateParams = req.body;

    if (!data.key || !data.name) {
      throw new Error("缺少必要參數");
    }

    const pageFeature = new Page();
    const newGorup = await pageFeature.add({
      ...data,
      permissions: [],
    });

    res.json({
      status: "success",
      data: newGorup,
      error: null,
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export { router as PageRouter };

