import { v2 as cloudinary } from "cloudinary";
import { GetEnvConfig } from "../../utils";
import { CloudinarySignatureBody } from "./cloudinary.schema";

const config = GetEnvConfig();

export type SignatureResult = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};

export class CloudinaryService {
  async generateSignature(
    body: CloudinarySignatureBody
  ): Promise<SignatureResult> {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = body.folder ?? "image";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      config.CLOUDINARY_API_SECRET
    );

    return {
      timestamp,
      signature,
      folder,
      apiKey: config.CLOUDINARY_API_KEY,
      cloudName: config.CLOUDINARY_CLOUD_NAME,
    };
  }
}
