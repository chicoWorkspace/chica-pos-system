import dotenv from "dotenv";
import path from "path";

// 指定 .env 位置（根據你 monorepo 結構調整）
dotenv.config({ path: path.resolve(__dirname, ".env") });