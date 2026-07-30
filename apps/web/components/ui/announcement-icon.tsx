import { AlertTriangle, CheckCircle2, Info, OctagonX } from "lucide-react";

export const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 size={18} className="text-emerald-400" />;
    case "warning":
      return <AlertTriangle size={18} className="text-amber-400" />;
    case "critical":
      return <OctagonX size={18} className="text-rose-500 animate-pulse" />;
    case "info":
    default:
      return <Info size={18} className="text-blue-400" />;
  }
};