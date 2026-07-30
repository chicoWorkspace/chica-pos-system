import { getSession, signOut } from "next-auth/react";
import {
  ApiRequest,
  ApiResult,
  FetchRequestProps,
  QuickApiFetchProps,
  RequestOptions,
  UserApiRequest,
} from "./index.type";

export default class Api {
  private apiUrl: string;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public callWithoutToken<T>(bag: ApiRequest) {
    const { method, uri, props } = bag;
    const result = this.callByFetch<T>(uri, {
      method,
      headers: [
        {
          name: "Content-Type",
          value: "application/json",
        },
      ],
      body: props,
    });
    return result;
  }

  protected call<T>(bag: UserApiRequest) {
    const { method, uri, props, token } = bag;

    if (!token) {
      throw new Error("呼叫API缺乏token");
    }

    const result = this.callByFetch<T>(uri, {
      method,
      headers: [
        {
          name: "Content-Type",
          value: "application/json",
        },
        {
          name: "Authorization",
          value: `Bearer ${token}`,
        },
      ],
      body: props,
    });

    return result;
  }

  private callByFetch<T>(uri: string, options: RequestOptions) {
    let url = `${this.apiUrl}${uri}`;
    const result = this.ApiFetch<T>({
      baseApiUrl: this.apiUrl,
      url,
      ...options,
    });
    return result;
  }

  private ApiFetch<T>(request: FetchRequestProps) {
    return quickApiFetch<T>({
      request,
      url: request.url,
      baseApiUrl: request.baseApiUrl,
    });
  }
}

export async function quickApiFetch<T>(props: QuickApiFetchProps) {
  // if (apiResult.status == 401) {

  //   // 會自動觸發 jwt callback，如果 token 過期就會執行 refreshAccessToken
  //   const newSession = await getSession();

  //   if (!newSession?.accessToken) {
  //     // refresh 失敗 → 強制登入
  //     throw new Error("無法刷新 Session，請重新登入。");
  //   }

  //   // 建立一個新的 props 物件來進行重試，確保 Authorization header 被更新
  //   const retryProps: QuickApiFetchProps = {
  //     ...props,
  //     request: {
  //       ...props.request,
  //       headers: [
  //         ...(props.request?.headers?.filter(
  //           (h) => h.name.toLowerCase() !== "authorization"
  //         ) || []),
  //         // 加上新的 Authorization header
  //         { name: "Authorization", value: `Bearer ${newSession.accessToken}` },
  //       ],
  //     },
  //   };
  //   apiResult = await quickFetch(retryProps);
  // }

  try {
    const apiResult: ApiResult<T> = await quickFetch(props);


    if (!apiResult) {
      throw new Error("API No Response (回傳值為空)");
    }

    if (apiResult.status === "success") {
      return apiResult.data as T;
    }

    const errMsg = apiResult.error || "API Status Not Success";
    throw new Error(errMsg);
  } catch (err: any) {
    console.error("[QuickApiFetch] 捕捉到錯誤:", err.message || err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}

export async function quickFetch<T>(props: QuickApiFetchProps) {
  const request = props.request;
  const url = props.url;

  var headers = new Headers();
  let body: string | undefined | FormData = undefined;

  if (request?.headers) {
    for (const header of request?.headers) {
      headers.append(header.name, header.value);
    }
  }
  if (request?.body) {
    const bodyType = typeof request?.body;
    body =
      bodyType === "string" ||
      request?.body instanceof FormData ||
      request?.body === undefined
        ? (request?.body as FormData)
        : JSON.stringify(request?.body);
  }

  const fetchResult = await fetch(url, {
    method: request?.method ?? "GET",
    headers: request?.headers ? headers : undefined,
    body: body as any,
    redirect: "follow",
    credentials: "include",
  });

  const resultStr = await fetchResult.text();
  const result: T = await JSON.parse(resultStr);

  return result;
}
