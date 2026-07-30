"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "../store";
import { DialogContextProvider } from "./dialog-provider";
import { BaseContextProvider } from "./base-provider";
import { PersistGate } from "redux-persist/integration/react";
import PersistLoading from "@/components/ui/persist-loading";
import { SocketProvider } from "./socket-provider";
import { CustomThemeProvider } from "./theme-provider";

function AuthWatcher({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // 取得目前路徑


  useEffect(() => {
    if (status === "loading") return; // 避免閃爍

    if (status === "unauthenticated" && pathname !== "/login") {
      // signOut({ callbackUrl: "/login" });
    }
    // if (!session && router.pathname !== "/login") {
    //   router.push("/login");
    // }

    if (session?.error) {
      signOut({
        callbackUrl: `/login?warning=${encodeURIComponent("登入已失效, 請重新登入")}`,
      });
    }
  }, [session, status]);

  return <>{children}</>;
}

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session?: any; // 從 getServerSession / pageProps 傳入
}) {
  return (
    <SessionProvider session={session}>
      <AuthWatcher>
        <Provider store={store}>
          <PersistGate loading={<PersistLoading />} persistor={persistor}>
            <SocketProvider>
              <CustomThemeProvider>
                <DialogContextProvider>
                  <BaseContextProvider>{children}</BaseContextProvider>
                </DialogContextProvider>
              </CustomThemeProvider>
            </SocketProvider>
          </PersistGate>
        </Provider>
      </AuthWatcher>
    </SessionProvider>
  );
}
