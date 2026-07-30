import { GroupPermissions } from "@repo/db";
import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { Admin } from "@repo/db";
import {
  GroupPermissionsResult,
  GroupPermissionsGetParams,
  TogglePermissionParams,
} from "@repo/api-client/";

const router = Router();

/**
 * @route GET /group-permissions
 * @desc 取得組別頁面權限列表
 * @access 登入者限定
 * @queryParam {string} [groupId] 指定組別 ID，用於篩選權限資料
 * @queryParam {string} [pageId] 指定頁面 ID，用於篩選權限資料
 * @returns {object} 200 - 回傳權限清單
 * @returns {string} 200.status - 狀態 success 或 error
 * @returns {Array} 200.data - 權限資料陣列
 * @returns {string|null} 200.error - 錯誤訊息（若有）
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter: GroupPermissionsGetParams = req.query;
    const groupPermissionFeature = new GroupPermissions();
    const result: GroupPermissionsResult =
      await groupPermissionFeature.list(filter);
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
 * @route POST /group
 * @desc 建立新的組別
 * @access 管理員限定
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { groupId, pageId } = req.body;

    if (!groupId || !pageId) {
      throw new Error("缺少必要參數");
    }

    const groupPermissionFeature = new GroupPermissions();
    const newGorup = await groupPermissionFeature.add({
      groupId,
      pageId,
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

/**
 * @route PATCH /group-permissions/toggle
 * @desc 根據 groupId 與 pageId 切換指定權限（若該權限存在則移除，否則新增）
 * @access 管理員限定
 */
router.patch("/toggle", authMiddleware, async (req, res) => {
  const data: TogglePermissionParams = req.body;

  if (!data.groupId || !data.pageId || !data.permissionKey) {
    throw new Error("缺少必要參數");
  }

  

  try { 
    const groupPermissionFeature = new GroupPermissions();
    const result = await groupPermissionFeature.setPermission(
      data.pageId,
      data.groupId, 
      data.permissionKey
    );

    return res.status(200).json({
      status: "success",
      data: result.data,
      error: null,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
});

export { router as GroupPermissionRouter };
