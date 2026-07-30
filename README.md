# ChiCa-POS-System

一個現代化的企業級全棧 POS（銷售點管理）系統，採用 **Turborepo Monorepo** 架構，完美整合了前端、後端、背景工作程式與即時通訊功能。

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![React](https://img.shields.io/badge/React-19.0-61DAFB)
![Fastify](https://img.shields.io/badge/Fastify-5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![Redis](https://img.shields.io/badge/Redis-5.3-red)
![Turborepo](https://img.shields.io/badge/Turborepo-1.12-ef4444)

## Live Demo & API Documentation

| 服務 | 連結 
| :--- | :--- 
| **🌐 Web App** | [直接前往 Live Demo](https://web-production-67648.up.railway.app/) 
| **📚 API Docs** | [瀏覽 Swagger 文檔](https://api-production-d770.up.railway.app/docs)

## 📋 專案概述

**ChiCa-pos** 是一個完整的 POS 解決方案，提供銷售管理、庫存管理、訂單追蹤與第三方支付整合功能。本專案採用最現代化的技術堆疊，高效能、可擴展性及優異的開發者體驗，適用於各種零售與餐飲場景。

---

## 系統架構

採用 **Turborepo Monorepo** 架構，將專案拆分為多個應用程式與可重用模組。

### 📱 應用程式 (Apps)

```mermaid
flowchart TB
    subgraph Frontend [前端應用]
        Client[網頁客戶端<br/>Next.js 15 / React 19]
    end

    subgraph APILayer [API 與即時通訊層]
        API[後端 API<br/>Fastify]
        Socket[Socket.IO 伺服器]
    end

    subgraph Infra [資料庫與訊息代理層]
        DB[(MongoDB<br/>副本集)]
        Redis[(Redis)]
        Queue[BullMQ 佇列]
    end

    subgraph Background [背景處理層]
        Worker[背景工作節點<br/>Node.js]
    end
    
    subgraph External [外部服務]
        Payment[第三方支付<br/>LINE Pay / Stripe]
    end

    %% 前端連線
    Client -->|REST API / JWT| API
    Client -->|WebSocket| Socket
    
    %% API 層連線
    API -->|讀取 / 寫入| DB
    API -->|快取 / 訂閱發布| Redis
    API -->|加入排程佇列| Queue
    
    %% Socket 連線
    Socket -->|訂閱| Redis
    
    %% 佇列與背景任務連線 (修正：由佇列排程後觸發 Worker)
    Queue -->|派發/處理任務| Worker
    
    %% Worker 連線
    Worker -->|更新狀態| Redis
    Worker -->|寫入結果| DB
    Worker -->|呼叫第三方 API| Payment
```

## 建立訂單流程

```mermaid
sequenceDiagram
  participant User as 使用者
  participant Web as Web App
  participant API as Fastify API
  participant Redis as Redis
  participant Queue as BullMQ
  participant Worker as Worker
  participant DB as MongoDB
  participant Pay as LINE Pay

  User->>Web: 送出訂單
  Web->>API: POST /cart/order
  API->>Redis: 檢查 order lock
  API->>Queue: add processOrder job
  API-->>Web: 回傳已送出
  Worker->>Queue: 消費 job
  Worker->>DB: 建立訂單與處理庫存
  alt LINE Pay
    Worker->>Pay: 建立付款請求
    Pay-->>Worker: 回傳付款網址
  end
  Worker->>Redis: publish socket event
  API->>Redis: subscribe socket event
  API-->>Web: Socket.IO 推送結果
```
## 專案結構

| 應用程式 | 核心技術 | 說明 |
|---------|----------|------|
| **`api`** | Fastify + Node.js | RESTful API 後端，提供 TypeBox 驗證、JWT 認證與 Swagger 文檔。 |
| **`web`** | Next.js 15 + React 19 | 現代化前端應用，支援 Turbopack、SSR，並針對跨裝置響應式設計最佳化。 |
| **`worker`** | Node.js + BullMQ | 負責處理背景非同步作業隊列（如：第三方支付回調、郵件發送、資料分析）。 |

### 📦 共享套件 (Packages)

| 套件名稱 | 說明 |
|---------|------|
| **`@repo/api-client`** | 前後端共享的 API 客戶端與 TypeScript 類型定義。 |
| **`@repo/db`** | MongoDB Mongoose 模型與連線實例管理。 |
| **`@repo/lib`** | 共用的工具函式庫與通用功能。 |
| **`@repo/queue`** | BullMQ 隊列設定與常數定義。 |
| **`@repo/redis`** | Redis 客戶端連線與快取工具。 |
| **`@repo/ui`** | 共用 React UI 組件庫，基於 Radix UI 與 Tailwind CSS。 |

---

## 核心技術棧 (Tech Stack)

### 前端 (Web Frontend)
- **Next.js 15.0** - React 框架，支援最新的 Turbopack 與 SSR (Server-Side Rendering)。
- **React 19.0** - 用戶介面庫。
- **Redux Toolkit 2.8** - 應用程式狀態管理。
- **Tailwind CSS 3.4** - 原子化 (Utility-first) CSS 框架。
- **Radix UI** - 無頭 (Headless) UI 元件（如 Dialog, Select, Popover 等），提供極佳的無障礙支援 (A11y)。
- **React Hook Form 7.62** - 高效能的表單狀態管理。
- **Zod 4.0** - TypeScript 優先的 Schema 驗證工具。
- **NextAuth 5.0 (Beta)** - 完整的身分驗證與會話管理。
- **Framer Motion 12.23** - 進階動畫與流暢的轉場效果。
- **Lucide React** - 現代化、開源的 SVG 圖標庫。
- **TanStack React Table 8.21** - 高效能、可高度客製化的資料表元件。

### 後端 API (Backend API)
- **Fastify 5.x** - 高效能、低延遲的 Node.js 網頁框架。
- **@fastify/jwt** - 處理 JSON Web Token 認證。
- **@fastify/rate-limit** - 提供速率限制，防範 DDoS 或暴力破解。
- **@fastify/swagger** - 自動化 API 文件生成。
- **TypeBox 0.34** - 針對 Fastify 提供 JSON Schema 的強型別定義與驗證。
- **Mongoose 8.2** - MongoDB 的物件資料塑模工具 (ODM)。
- **Socket.IO 4.8** - 即時雙向事件通訊，配合 Redis Adapter 支援分散式部署。
- **Bcrypt 5.1** - 高強度的密碼雜湊加密演算法。
- **Cloudinary SDK 2.7** - 用於雲端圖片的上傳、處理與管理。

### 背景作業系統 (Background Worker)
- **BullMQ 5.0** - 基於 Redis 的強大非同步作業與訊息隊列。
- **ioredis 5.3** - 高效能的 Redis 客戶端，為 BullMQ 帶來卓越效能。

### 基礎設施與資料儲存 (Infrastructure & DB)
- **MongoDB 8.0** - 具高擴展性的 NoSQL 資料庫，配置為副本集 (Replica Set) 確保資料強一致性。
- **Redis** - 記憶體內資料結構儲存，用於快取、訊息隊列及 Socket.IO 擴展。

### 開發與建構工具 (Dev Tools)
- **TypeScript 5.3** - 為全端提供靜態型別檢查。
- **Turborepo 1.12** - 高效能的 Monorepo 建構系統與任務編排。
- **ESLint 8.57** - 確保程式碼品質與一致性。
- **Prettier 3.2** - 程式碼自動格式化。
- **tsup 8.0** - 極速 TypeScript 打包工具。
- **Jest** - 單元測試。

---

## 系統亮點與特色

### 1. 企業級安全與認證
- **JWT 會話策略與自動刷新**：前端實現了 Access Token 過期自動呼叫 `/auth/refresh` 換取新 Token 的機制，對使用者完全透明。
- **RBAC 權限管理**：基於角色的精細化存取控制，結合 `NextAuth` 保護前端路由，並由 `Fastify` 保障 API 端點安全。
- **基礎防護機制**：密碼加密儲存 (Bcrypt)、CORS 設定、安全 HTTP 標頭 (Helmet) 以及請求速率限制。

### 2. 非同步訂單處理

下單流程不是直接在 API request 中完成所有工作，而是由 API 建立 queue job，再交給 worker 處理：

1. 前端送出購物車訂單。
2. API 驗證使用者、檢查購物車與 Redis lock。
3. API 將訂單工作送入 BullMQ `orderQueue`。
4. Worker 建立訂單、扣庫存，必要時呼叫 LINE Pay。
5. Worker 透過 Redis Pub/Sub 發布訂單結果。
6. API Socket.IO server 將結果推送給前端。

這個設計可以避免 API 被付款流程或庫存處理阻塞，也比較接近實務上會採用的可擴充架構。
### 3. 即時互動體驗

專案使用 Socket.IO 搭配 Redis Pub/Sub。Worker 完成訂單處理後，不需要讓前端輪詢 API，而是直接將狀態推送回使用者所在的 room。

適用情境包含：
- 訂單建立成功
- 訂單建立失敗
- LINE Pay 付款網址產生
- 系統公告或訂單狀態更新

### 4. 完美響應式設計 (RWD)
- **🖥️ 桌面版 (≥1024px)**：充分利用螢幕空間，展現多欄位的複雜管理介面。
- **⌨️ 平板版 (768px-1023px)**：優化觸控體驗，介面佈局維持高生產力，最適合門市現場平板操作。
- **📱 手機版 (<768px)**：簡潔的堆疊式佈局設計，一手即可掌握所有銷售重點功能。

---



## 🛠️ 開發指南與快速開始

### 前置要求

- [Node.js](https://nodejs.org/) (≥ 22.13)
- [pnpm](https://pnpm.io/) (v11+)
- [Docker](https://www.docker.com/) 與 Docker Compose (用於本地啟動資料庫與 Redis)

### 安裝依賴

```bash
pnpm install
```

### 啟動 MongoDB 與 Redis

專案提供 `docker-compose.yml` 作為本機基礎設施。

```bash
docker-compose up -d
```

如果使用專案內的 MongoDB replica set 設定，本機可能需要讓 `mongo01` 指到 `127.0.0.1`。Windows 開發環境可使用 WSL，或改用自己的 MongoDB Atlas connection string。

### 設定環境變數

請在各 app 建立自己的 `.env` 或 `.env.local`。以下只放範例，不應提交真實 secret。

`apps/api/.env`

```env
NODE_ENV=development
PORT=3011

JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me
JWT_EXPIRES=100s
JWT_REFRESH_EXPIRES=7d

MONGODB_URL=mongodb://root:123456@mongo01:27017/?authSource=admin&replicaSet=mongo-replica-set
MONGODB_DBNAME=db

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=test

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

TIP_RATE=0.1
```

`apps/web/.env.local`

```env
API_URL=http://localhost:3011
NEXT_PUBLIC_API_URL=http://localhost:3011

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me
AUTH_SECRET=change-me
AUTH_TRUST_HOST=true

NEXT_PUBLIC_TIP_RATE=0.1
NEXT_PUBLIC_SITE_NAME=ChiCa
```

`apps/worker/.env`

```env
JWT_SECRET=change-me

MONGODB_URL=mongodb://root:123456@mongo01:27017/?authSource=admin&replicaSet=mongo-replica-set
MONGODB_DBNAME=db

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=test

LINEPAY_API_URL=https://sandbox-api-pay.line.me
LINEPAY_CHANNEL_ID=
LINEPAY_CHANNEL_SECRET=

FRONTEND_DOMAIN=http://localhost:3000
```

### 啟動開發環境

一次啟動所有 app：

```bash
pnpm dev
```

分別啟動：

```bash
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter @repo/worker dev
```

預設網址：

- Web：`http://localhost:3000`
- API：`http://localhost:3011`
- Swagger：`http://localhost:3011/docs`

## 常用指令

```bash
pnpm build
pnpm build:web
pnpm build:api
pnpm build:worker

pnpm test
pnpm --filter web check-types
pnpm --filter @repo/worker type-check
```

**開發規範重點：**
- 必須使用 TypeScript 開發，並盡可能避免使用 `any`。
- 嚴格遵守 ESLint 與 Prettier 設定。
- UI 設計以深色主題 (Dark Theme) 優先，並使用 Tailwind CSS 變數（如 `slate-900`, `cyan-400`）。
- 圖示一律使用 **Lucide React**，禁止在 UI 介面使用 Emoji 替代圖示。

---

**Made with ❤️ by the Nice Cotton Candy Team**
