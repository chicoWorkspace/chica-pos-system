import { DialogContext } from "@/src/context/dialog-provider";
import { useContext } from "react";

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
