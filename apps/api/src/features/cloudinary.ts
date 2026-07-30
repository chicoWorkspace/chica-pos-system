import { SignatureResult } from "@repo/api-client";
import { v2 as cloudinary } from "cloudinary";
import { Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { GetEnvConfig } from "../utils";
const config = GetEnvConfig();
const router = Router();

// 產生簽章 (Signature)
router.post("/signature", authMiddleware, async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // 可從前端指定資料夾名稱
    const { folder = "image" } = req.body;

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      config.CLOUDINARY_API_SECRET
    );

    const result: SignatureResult = {
      timestamp,
      signature,
      folder,
      apiKey: config.CLOUDINARY_API_KEY, // 前端上傳需要
      cloudName: config.CLOUDINARY_CLOUD_NAME,
    };

    res.json({
      status: "success",
      data: result,
      error: null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate signature" });
  }
});

export { router as CloudinaryRouter };
