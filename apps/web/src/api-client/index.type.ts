export interface ApiRequest {
  method: Method;
  uri: string;
  props?: object;
}

export interface UserApiRequest extends ApiRequest {
  token: string;
}

export interface NameValue {
  name: string;
  value: string;
}

export interface RequestOptions {
  method?: Method | string;
  headers?: NameValue[];
  body?: object | string | FormData;
}

export interface FetchRequestProps extends RequestOptions {
  url: string;
  baseApiUrl: string;
}

export interface QuickApiFetchProps {
  url: string;
  baseApiUrl: string;
  request?: RequestOptions;
  cacheTag?: string;
}

export interface ApiResult<T> {
  status: "success" | "error" | number;
  data?: T;
  error?: string;
}

export type Method =
  | "GET"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "POST"
  | "PUT"
  | "PATCH"
  | "PURGE"
  | "LINK"
  | "UNLINK";
