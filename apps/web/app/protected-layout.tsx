// app/ClientLayout.tsx
"use client";

import { useSelector } from "react-redux";
import { selectCan } from "@/src/store/permission/permissionSelector";
import { notFound } from "next/navigation";
import { usePathname } from "next/navigation";

const PROTECTED_ROUTES = {
  "/order": ["order", "view"],
  "/product": ["product", "view"],
  "/analytics": ["analytics", "view"],
  "/purchase-history": ["purchase-history", "view"],
  "/settings": ["settings", "view"],
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const [resource, action] =
      PROTECTED_ROUTES[matchedRoute as keyof typeof PROTECTED_ROUTES];
    const canView = useSelector(selectCan(resource, action));

    if (!canView) {
      // notFound();
    }
  }

  return <>{children}</>;
}
