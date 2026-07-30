import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useDialog } from "@/hooks/use-dialog";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, use, useEffect } from "react";
import { getAnnouncementAsync } from "../store/announcement/announcementThunk";
import { useWebSocket } from "@/hooks/use-web-socket";
import { addAnnouncements } from "../store/announcement/announcementSlice";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { AnnouncementResult } from "@repo/api-client";

export interface BaseContextProps {}
export const BaseContext = createContext<BaseContextProps | undefined>(
  undefined,
);
export function BaseContextProvider({ children }: { children: ReactNode }) {
  const { openDialog } = useDialog();
  const appDispatch = useAppDispatch();
  const ctx = useWebSocket();
  const { socket, status } = ctx;
  const params = useSearchParams();
  const rawType = params.get("type");
  const msg = params.get("msg");
  const validTypes = ["info", "success", "warning"] as const;
  const type = validTypes.includes(rawType as any)
    ? (rawType as "info" | "success" | "warning")
    : null;

  useEffect(() => {
    if (type && msg) {
      openDialog({
        content: msg,
        type: type,
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("type");
      url.searchParams.delete("msg");
      window.history.replaceState({}, "", url);
    }
  }, [type, msg]);

  //--------公告相關--------//
  useEffect(() => {
    // 首次載入時獲取公告列表
    appDispatch(
      getAnnouncementAsync({
        createdAtFrom: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        createdAtTo: new Date(
          new Date().setHours(23, 59, 59, 999),
        ).toISOString(),
      }),
    )
      .unwrap()
      .then((res) => {})
      .catch((err) => {});
  }, []);

  // socket事件監聽，接收公告發布事件
  useEffect(() => {
    if (!socket) return;

    const handlePublish = (payload: AnnouncementResult) => {
      appDispatch(addAnnouncements(payload));
    };

    socket.on("announcement:publish", handlePublish);

    return () => {
      socket.off("announcement:publish", handlePublish);
    };
  }, [socket, appDispatch]); // socket作為依賴 確保在socket變化時重新註冊事件
  //-------------------------//

  return <BaseContext.Provider value={{}}>{children}</BaseContext.Provider>;
}
