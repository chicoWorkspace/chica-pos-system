"use client";
import { useAppTheme } from "@/src/context/theme-provider";
import ProtectedLayout from "../protected-layout";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();
  return (
    <div className={theme.classes.layout.page}>
      <ProtectedLayout>{children}</ProtectedLayout>
    </div>
  );
}
