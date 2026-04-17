"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createListingAction } from "@/app/actions/marketplace";

const deliveryOptions = [
  ["OPENCLAW_BUNDLE", "OpenClaw 能力包"],
  ["MCP_SERVER", "MCP 服务"],
  ["PROMPT_PACK", "提示词与流程"],
  ["WEBHOOK_API", "Webhook / API"],
  ["HYBRID", "混合交付"],
] as const;

export function ListingForm() {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <form
      className="mx-auto flex max-w-2xl flex-col gap-5"
      action={(fd) => {
        start(async () => {
          const res = await createListingAction(fd);
          if (!res.ok) {
            window.alert(res.message);
            return;
          }
          router.push("/dashboard");
          router.refresh();
        });
      }}
    >
      <Field label="标题" htmlFor="title" hint="一句话说清能力边界。">
        <input
          id="title"
          name="title"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          placeholder="例如：深海情报探针"
        />
      </Field>

      <Field label="卖点" htmlFor="tagline" hint="展示在卡片上的副标题。">
        <input
          id="tagline"
          name="tagline"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        />
      </Field>

      <Field label="详细说明" htmlFor="description" hint="训练场景、数据范围、合规边界等。">
        <textarea
          id="description"
          name="description"
          required
          rows={8}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-950"
        />
      </Field>

      <Field label="能力标签" htmlFor="tags" hint="逗号分隔，例如：信息收集, 引用, 简报">
        <input
          id="tags"
          name="tags"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        />
      </Field>

      <Field label="交付形态" htmlFor="deliveryFormat" hint="告诉买家如何接入能力。">
        <select
          id="deliveryFormat"
          name="deliveryFormat"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          defaultValue="HYBRID"
        >
          {deliveryOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="训练投入说明（可选）" htmlFor="trainingEffortSummary" hint="tokens、时间、真实项目轮次等，建立信任。">
        <textarea
          id="trainingEffortSummary"
          name="trainingEffortSummary"
          rows={3}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
        />
      </Field>

      <Field label="定价（USD）" htmlFor="priceUsd" hint="MVP 不含真实支付，仅记录价格。">
        <input
          id="priceUsd"
          name="priceUsd"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          placeholder="199.00"
        />
      </Field>

      <Field
        label="即时交付内容（可选）"
        htmlFor="instantDeliverMd"
        hint="若填写，买家下单后将立刻在订单中看到该 Markdown（适合固定能力包链接）。"
      >
        <textarea
          id="instantDeliverMd"
          name="instantDeliverMd"
          rows={6}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-950"
          placeholder={"## 交付物\n- bundle: https://..."}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" name="publishNow" className="h-4 w-4 rounded border-zinc-300" />
        立即上架（否则保存为草稿，稍后在控制台发布）
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "提交中…" : "提交"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {label}
        </label>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">{hint}</p>
      </div>
      {children}
    </div>
  );
}
