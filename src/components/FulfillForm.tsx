"use client";

import { useTransition } from "react";
import { fulfillOrderAction } from "@/app/actions/marketplace";

export function FulfillForm({ orderId }: { orderId: string }) {
  const [pending, start] = useTransition();

  return (
    <form
      className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
      action={(fd) => {
        fd.set("orderId", orderId);
        start(async () => {
          const res = await fulfillOrderAction(fd);
          if (!res.ok) {
            window.alert(res.message);
            return;
          }
          window.alert("交付已保存，买家可在控制台查看。");
        });
      }}
    >
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300" htmlFor={`fulfill-${orderId}`}>
        交付说明（Markdown）
      </label>
      <textarea
        id={`fulfill-${orderId}`}
        name="fulfillmentMd"
        rows={5}
        required
        className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-xs leading-relaxed dark:border-zinc-800 dark:bg-zinc-950"
        placeholder="写入下载链接、接入步骤、密钥申请方式等。"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-700 px-4 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {pending ? "保存中…" : "标记为已交付"}
      </button>
    </form>
  );
}
