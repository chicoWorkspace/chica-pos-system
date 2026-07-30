import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "ChiCa POS API",
        description: `
# ChiCa POS 平台後端 API 文件

---

## 一、使用方式：請先取得 Access Token

在測試任何需要授權的 API 之前，請先呼叫：

**POST /auth/login**

成功登入後，系統會回傳如下格式：

\`\`\`json
{
  "status": "success",
  "data": {
    "accessToken": "<你的 JWT Access Token>",
    "refreshToken": "<你的 Refresh Token>",
    "role": "member",
    "permissions": [
      {
        "pageKey": "order",
        "actions": ["view", "add", "edit", "delete"]
      }
    ]
  },
  "error": null
}
\`\`\`

說明：
- \`accessToken\` 用於 API 授權
- \`refreshToken\` 用於刷新 Token（Swagger UI 不會使用）


---

## 二、在 Swagger UI 中啟用授權

請依照以下步驟操作：

1. 呼叫 **POST /auth/login**
2. 從回傳結果中複製 **data.accessToken**
3. 點擊右上角的 **Authorize** 按鈕
4. 在彈窗中貼上 **accessToken**（不需要加 Bearer）
5. 按下 **Authorize** 完成授權

授權成功後，所有需要 Token 的 API 會自動加入下列 Header：

\`\`\`
Authorization: Bearer <accessToken>
\`\`\`


---

## 三、補充說明

- 若 Access Token 過期，請重新登入取得新的 Token  
- 若 API 回傳 401，表示 Token 無效或已過期  
- Refresh Token 不會在 Swagger UI 上使用  

`,
        version: "1.0.0",
      },

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list", // 業界常用：列表模式
    },
  });
});
