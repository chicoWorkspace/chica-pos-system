import { Group } from "@repo/db";
import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { GroupsResult } from "@repo/api-client";
import { Admin } from "@repo/db";

const router = Router();
router.get("/groups", authMiddleware, async (req, res) => {
  try {
    const groupFeature = new Group();
    const result: GroupsResult = await groupFeature.groups();
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
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "缺少必要欄位 name" });
    }

    const groupFeature = new Group();

    const newGorup = await groupFeature.create({
      name,
      description,
      members: [],
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
 * @route patch /group
 * @desc 更新組別
 * @access 管理員限定
 */
router.patch("/:groupId", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;

    if (!groupId) {
      return res.status(400).json({ status: "error", error: "無效的 ID 格式" });
    }

    if (!name) {
      return res.status(400).json({ message: "缺少必要欄位 name" });
    }

    const groupFeature = new Group();
    const newGorup = await groupFeature.update(
      { _id: groupId },
      {
        name,
        description,
      }
    );

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
 * @route POST /group/:groupId/members
 * @desc 將管理員加入某個組別（若不存在則自動建立）
 * @access 管理員限定
 * @param {string} groupId - 組別 ID
 * @param {string} username - 管理員帳號
 * @param {string} password - 管理員密碼
 */
router.post("/:groupId/members", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { username, password } = req.body;

    if (!groupId) {
      return res.status(400).json({ status: "error", error: "無效的 ID 格式" });
    }

    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "error", error: "缺少 username 或 password" });
    }

    const groupFeature = new Group();
    const updatedGroup = await groupFeature.addNewAdminToGroup(
      groupId,
      username,
      password
    );

    res.status(200).json({
      status: "success",  
      data: updatedGroup,
      error: null,
    });
  } catch (error: any) {
    .error("新增組員錯誤", error);
    res.status(500).json({ status: "error", data: null, error: error.message });
  }
});

/**
 * @route DELETE /group/:groupId/members/:adminId
 * @desc 將指定的 Admin 從組別中移除（若為組長則禁止）
 * @access 管理員限定
 */
router.delete("/:groupId", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ status: "error", error: "缺少 groupId " });
    }

    const groupFeature = new Group();
    const updatedGroup = await groupFeature.deleteGroup(groupId);

    res.status(200).json({
      status: "success",
      data: updatedGroup,
      error: null,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

/**
 * @route DELETE /group/:groupId/members/:adminId
 * @desc 將指定的 Admin 從組別中移除（若為組長則禁止）
 * @access 管理員限定
 */
router.delete(
  "/:groupId/members/:adminId",
  authMiddleware,
  async (req, res) => {
    try {
      const { groupId, adminId } = req.params;

      if (!groupId || !adminId) {
        return res
          .status(400)
          .json({ status: "error", error: "缺少 groupId 或 adminId" });
      }

      const groupFeature = new Group();
      const updatedGroup = await groupFeature.removeMember(groupId, adminId);

      res.status(200).json({
        status: "success",
        data: updatedGroup,
        error: null,
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
);

/**
 * @route patch /group/:groupId/members/:adminId/leader
 * @desc 將指定的 Admin 從組別中移除（若為組長則禁止）
 * @access 管理員限定
 */
router.patch(
  "/:groupId/members/:adminId/leader",
  authMiddleware,
  async (req, res) => {
    const { groupId, adminId } = req.params;

    if (!groupId || !adminId) {
      return res
        .status(400)
        .json({ status: "error", error: "缺少 groupId 或 adminId" });
    }

    try {
      const groupFeature = new Group();
      const result = await groupFeature.setMemberAsLeader(groupId, adminId);

      return res.status(200).json({
        status: "success",
        data: result,
        error: null,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
  }
);

export { router as GroupRouter };
