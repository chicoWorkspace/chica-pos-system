// /print/receipt/page.tsx
"use client";

import ReceiptPreview from "@/components/order/order-summary/receipt";
import styles from "./index.module.css";
import { OrderCreaterResult } from "@repo/api-client";
import { useEffect, useState } from "react";

export default function PrintReceiptPage() {
  const [receipt, setReceipt] = useState<OrderCreaterResult | null>(null);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.data?.type === "PRINT_RECEIPT") {
        setReceipt(e.data.payload);
        setTimeout(() => window.print(), 100);
      }
    });
  }, []);

  if (!receipt) return null;

  return (
    <div className={`${styles.receipt} border-2 border-black `}>
      <ReceiptPreview isPrint={true} receipt={receipt} />
    </div>
  );
}
