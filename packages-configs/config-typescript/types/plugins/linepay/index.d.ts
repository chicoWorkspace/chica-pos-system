import { LinePayResponse, PaymentData } from "./index.type";
export declare class LinePayClient {
    private baseUrl;
    private channelId;
    private channelSecret;
    constructor(baseUrl?: string, channelId?: string, channelSecret?: string);
    private signKey;
    request<T>({ method, apiPath, queryString, data, signal, }: {
        method: "GET" | "POST";
        apiPath: string;
        queryString?: string;
        data?: any;
        signal?: AbortSignal | null;
    }): Promise<T>;
    static requestPayment(paymentData: PaymentData): Promise<LinePayResponse>;
}
export default LinePayClient;
