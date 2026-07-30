import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnnouncementLinkType } from "@repo/api-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleAnnouncementClick = (
  link: AnnouncementLinkType,
  navigate: (path: string, isExternal?: boolean) => void,
) => {
  if (!link || link.action === "none") return;

  const internalResources: Record<string, string> = {
    analytics: "/analytics",
    product: "/product",
    purchase_history: "/purchase-history",
  };


  // 處理物件轉換為 Query String (?key=value&...)
  const buildQueryString = (
    params?: Record<string, any>,
    excludeKeys: string[] = [],
  ) => {
    if (!params) return "";
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      // 排除掉已經拼接到路徑中的 ID
      if (!excludeKeys.includes(key) && value !== undefined) {
        query.append(key, String(value));
      }
    });
    const qs = query.toString();
    return qs ? `?${qs}` : "";
  };

  switch (link.action) {
    case "external":
      if (link.url) navigate(link.url, true);
      break;

    case "internal_route":
      if (link.url) {
        // 即使是直接跳轉路徑，也可以附加 params 作為 Query
        const qs = buildQueryString(link.params);
        navigate(`${link.url}${qs}`);
      }
      break;
    case "analytics":
    case "product":
    case "purchase_history":
      const basePath = internalResources[link.action];
      const qs = buildQueryString(link.params);
      navigate(`${basePath}${qs}`, true);
      break;

    default:
      console.warn("未知的動作類型:", link.action);
  }
};
