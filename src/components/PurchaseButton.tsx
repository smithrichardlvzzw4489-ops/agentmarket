"use client";

import { useTransition } from "react";
import { placeOrderAction } from "@/app/actions/marketplace";

export function PurchaseButton({ listingId }: { listingId: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        start(async () => {
          const res = await placeOrderAction(listingId);
          if (!res.ok) {
            window.alert(res.message);
            return;
          }
          window.alert("交易已创建。请在「控制台」查看交付内容。");
        });
      }}
      className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "处理中…" : "获取能力（模拟下单）"}
    </button>
  );
}
