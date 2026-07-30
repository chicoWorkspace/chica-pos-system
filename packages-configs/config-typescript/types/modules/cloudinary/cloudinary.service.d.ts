import { CloudinarySignatureBody } from "./cloudinary.schema";
export type SignatureResult = {
    timestamp: number;
    signature: string;
    folder: string;
    apiKey: string;
    cloudName: string;
};
export declare class CloudinaryService {
    generateSignature(body: CloudinarySignatureBody): Promise<SignatureResult>;
}
