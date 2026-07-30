import { auth } from "@/lib/auth";
import { getSignature } from "@/src/action/cloudinary/action";
import { getCloudinaryApi } from "@/src/api-client/cloudinary";
import { useSession } from "next-auth/react";
import { useState } from "react";

export interface UploadOptions {
  apiEndpoint?: string; // 後端簽章 API
  accept?: string; // ex: "image/*"
  maxSizeMB?: number; // ex: 5
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType?: string;
}

export function useCloudinaryUpload(options: UploadOptions = {}) {
  const {
    apiEndpoint = "/api/uploads/signature",
    accept = "image/*",
    maxSizeMB = 2,
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File): Promise<UploadResult | null> {
    try {
      // === 前置驗證 ===
      if (accept && !file.type.match(accept.replace("*", ".*"))) {
        throw new Error(`檔案格式不支援：${file.type}`);
      }

      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`檔案超過大小限制 (${maxSizeMB}MB)`);
      }

      setIsUploading(true);

      const sigRes = await getSignature();
      if (!sigRes) {
        throw new Error(`取得簽章失敗)`);
      }

      const { timestamp, signature, apiKey, cloudName, folder } = sigRes;
       
      //上傳到Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadRes.json();

      
      if (!uploadRes.ok) {
        throw new Error(data.error?.message || "Cloudinary 上傳失敗");
      }

      const result: UploadResult = {
        url: data.secure_url,
        publicId: data.public_id,
        resourceType: data.resource_type,
      };

      onSuccess?.(result);
      return result;
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      onError?.(err);
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading };
}
