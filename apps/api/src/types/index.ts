// 建議放在一個 types.d.ts 或 types/index.ts 文件中

import { Request } from 'express';
import { JwtPayload } from './jwt';

// 定義一個包含 user 屬性的 Request 介面
export interface AuthRequest extends Request {
  user?: JwtPayload; // user 屬性是可選的，且類型為 JwtPayload
}