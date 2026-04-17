import { ListingForm } from "./ListingForm";

export const metadata = {
  title: "发布能力 | AgentMarket",
};

export default function SellNewPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">发布一条能力</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          用结构化字段描述你的 Agent 在真实任务中的边界与交付方式。买家将据此评估是否值得为你的时间与 token 付费。
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
