// import { connectToDatabase } from "@repo/db";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import express, { RequestHandler } from "express";
// import { AdminRouter } from "./features/admin";
// import { AuthRouter } from "./features/auth";
// import { CartRouter } from "./features/cart";
// import { CategoryRouter } from "./features/category";
// import { CloudinaryRouter } from "./features/cloudinary";
// import { GroupRouter } from "./features/group";
// import { GroupPermissionRouter } from "./features/group-permission";
// import { OrderRouter } from "./features/order";
// import { PageRouter } from "./features/page";
// import { ProductRouter } from "./features/product";
// import { GetEnvConfig } from "./utils";

// function StartAppServer() {
//   const app = express();
//   app.use(express.json() as RequestHandler);
//   app.use(cookieParser());

//   const corsList = [
//     //網站前台
//     "https://test.chico.tw",
//   ];
//   const corsOptions: cors.CorsOptions = {
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (
//         origin.startsWith("http://localhost") || //本地使用
//         corsList.includes(origin) || //上方列表白名單結尾不加/
//         origin.endsWith(".vercel.app") //vercel 持續部署
//       ) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   };

//   app.use(cors(corsOptions));
//   app.use("/admin", AdminRouter);
//   app.use("/auth", AuthRouter);
//   app.use("/category", CategoryRouter);
//   app.use("/product", ProductRouter);
//   app.use("/cloudinary", CloudinaryRouter);
//   app.use("/group", GroupRouter);
//   app.use("/group-permission", GroupPermissionRouter);
//   app.use("/page", PageRouter);
//   app.use("/cart", CartRouter);
//   app.use("/order", OrderRouter);

//   const config = GetEnvConfig();
//   const port = config.PORT ?? 3000;
//   app.listen(port, () => {
//     
//   });
// }

// (async () => {
//   await connectToDatabase();
//   StartAppServer();
// })();
