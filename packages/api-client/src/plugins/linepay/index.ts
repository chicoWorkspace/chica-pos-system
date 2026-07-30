import crypto from "crypto";
import { LinePayResponse, PaymentData } from "./index.type";

const LINEPAY_API_URL =
  process.env.LINEPAY_API_URL || "https://sandbox-api-pay.line.me";
const CHANNEL_ID = process.env.LINEPAY_CHANNEL_ID ?? "";
const CHANNEL_SECRET = process.env.LINEPAY_CHANNEL_SECRET ?? "";

export type PaymentCallbackPayload = {
  orderId: string;
  status: PaymentCallbackStatus;
  exp: number;
};
export type PaymentCallbackStatus = "paid" | "cancelled";

export class LinePayClient {
  private baseUrl: string;
  private channelId: string;
  private channelSecret: string;

  constructor(
    baseUrl: string = LINEPAY_API_URL,
    channelId: string = CHANNEL_ID,
    channelSecret: string = CHANNEL_SECRET,
  ) {
    if (!channelId || !channelSecret) {
      console.log('Secret must be provided',channelId, channelSecret);
      throw new Error("Channel ID and Channel Secret must be provided");
    }
    this.baseUrl = baseUrl;
    this.channelId = channelId;
    this.channelSecret = channelSecret;
  }

  // 簽名生成函數
  private signKey(msg: string): string {
    return crypto
      .createHmac("sha256", this.channelSecret)
      .update(msg)
      .digest("base64");
  }

  // 發送 API 請求
  public async request<T>({
    method,
    apiPath,
    queryString = "",
    data = null,
    signal = null,
  }: {
    method: "GET" | "POST";
    apiPath: string;
    queryString?: string;
    data?: any;
    signal?: AbortSignal | null;
  }) {
    const nonce = crypto.randomUUID();
    let signature = "";

    // 根據不同的 HTTP 方法生成簽名
    if (method === "GET") {
      signature = this.signKey(
        this.channelSecret + apiPath + queryString + nonce,
      );
    } else if (method === "POST") {
      signature = this.signKey(
        this.channelSecret + apiPath + JSON.stringify(data) + nonce,
      );
    }

    const headers = {
      "X-LINE-ChannelId": this.channelId,
      "X-LINE-Authorization": signature,
      "X-LINE-Authorization-Nonce": nonce,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        `${this.baseUrl}${apiPath}${queryString ? "?" + queryString : ""}`,
        {
          method,
          headers,
          body: method === "POST" ? JSON.stringify(data) : null,
          signal,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error in LINE Pay API request:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResult = (await response.json()) as T;
      return apiResult;
    } catch (error) {
      console.error("Error in LINE Pay API request:", error);
      throw error;
    }
  }

  // 建立付款請求
  public static async requestPayment(
    paymentData: PaymentData,
  ): Promise<LinePayResponse> {
    const client = new LinePayClient();
    return client.request<LinePayResponse>({
      method: "POST",
      apiPath: "/v4/payments/request",
      data: paymentData,
    });
  }

  // 解析付款回調的 token
  private static resolvePaymentCallbackSecret(secret?: string) {
    if (secret) {
      return secret;
    }

    if (typeof process !== "undefined" && process?.env.JWT_SECRET) {
      return process.env.JWT_SECRET ?? "supersecret";
    }

    return "supersecret";
  }

  // 建立付款回調的 token
  public static createPaymentCallbackToken(
    payload: PaymentCallbackPayload,
    secret?: string,
  ) {
    const resolvedSecret = this.resolvePaymentCallbackSecret(secret);

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );
    const signature = crypto
      .createHmac("sha256", resolvedSecret)
      .update(encodedPayload)
      .digest("hex");

    return `${encodedPayload}.${signature}`;
  }

  // 驗證付款回調的 token
  public static verifyPaymentCallbackToken(token: string, secret?: string) {
    const resolvedSecret = this.resolvePaymentCallbackSecret(secret);
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = crypto
      .createHmac("sha256", resolvedSecret)
      .update(encodedPayload)
      .digest("hex");

    const actualSignature = Buffer.from(signature, "hex");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");
    if (actualSignature.length !== expectedSignatureBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(actualSignature, expectedSignatureBuffer)) {
      return null;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString("utf8"),
      ) as PaymentCallbackPayload;

      if (
        !payload.orderId ||
        !payload.status ||
        payload.exp <= Math.floor(Date.now() / 1000)
      ) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }
}

export default LinePayClient;
