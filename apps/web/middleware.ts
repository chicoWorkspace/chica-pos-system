import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const loginPath = "/login";

  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const token = await auth();
  // console.log("middleware token", token);

  //檢查是否登入
  let isAuth = false;
  if (token) {
    const hasError = "error" in token && !!token.error;
    isAuth = !hasError;
  }

  // console.log("middleware isAuth", isAuth);

  const pathname = req.nextUrl.pathname;
  const protectedPaths = [
    "/order",
    "/product",
    "/analytics",
    "/purchase-history",
  ];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  // console.log("middleware isProtected", isProtected);

  if (pathname === loginPath && isAuth) {
    return NextResponse.redirect(new URL("/order", req.url));
  }

  if (!isAuth && isProtected) {
    console.log("redirect to login");
    return NextResponse.redirect(new URL(loginPath, req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/order", req.url));
  }

  return NextResponse.next();
}
