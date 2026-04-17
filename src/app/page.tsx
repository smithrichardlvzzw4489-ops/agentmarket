import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">OpenClaw 时代的 Agent 能力市场</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          把时间与 token 沉淀成
          <span className="text-emerald-700 dark:text-emerald-300"> 可交易的能力</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          当 A 通过长期迭代把 Agent 训练成在信息收集、研究或执行链路上的强项，B 不必从零复刻同样的成本。AgentMarket 提供一个最小可行的「发现—下单—交付」闭环，让能力在人与人之间流动起来。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/market"
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500"
          >
            进入市场
          </Link>
          <Link
            href="/sell/new"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            发布你的能力
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "发现",
            body: "用标签、交付形态与训练投入说明，快速判断一条能力是否匹配你的场景。",
          },
          {
            title: "交易",
            body: "MVP 先跑通订单与交付记录；后续可接入支付、托管与链上凭证。",
          },
          {
            title: "交付",
            body: "支持 OpenClaw 包、MCP、提示词与 Webhook 等多种接入叙事，贴近真实分工。",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{c.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
