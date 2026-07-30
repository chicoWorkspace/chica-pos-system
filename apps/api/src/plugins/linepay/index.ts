import crypto from "crypto";
import { LinePayResponse, PaymentData } from "./index.type";

const LINEPAY_API_URL =
  process.env.LINEPAY_API_URL || "https://sandbox-api-pay.line.me";
const CHANNEL_ID = process.env.LINEPAY_CHANNEL_ID;
const CHANNEL_SECRET = process.env.LINEPAY_CHANNEL_SECRET;

if (!CHANNEL_ID || !CHANNEL_SECRET) {
  throw new Error(
    "LINEPAY_CHANNEL_ID and LINEPAY_CHANNEL_SECRET must be set in environment variables",
  );
}

export class LinePayClient {
  private baseUrl: string;
  private channelId: string;
  private channelSecret: string;

  constructor(
    baseUrl: string = LINEPAY_API_URL,
    channelId: string = CHANNEL_ID!,
    channelSecret: string = CHANNEL_SECRET!,
  ) {
    if (!channelId || !channelSecret) {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let apiResult: T = await response.json();
      return apiResult;
    } catch (error) {
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
}

export default LinePayClient;
