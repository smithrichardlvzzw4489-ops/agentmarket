import { ListingStatus } from "@prisma/client";
import { ListingCard } from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const listings = await prisma.agentListing.findMany({
    where: { status: ListingStatus.LIVE },
    orderBy: { updatedAt: "desc" },
    include: { seller: { select: { handle: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">能力市场</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          浏览他人通过时间与 token 打磨出的 Agent 能力，按交付形态接入到你的工作流。当前版本为交易闭环原型：不含真实支付与链上结算。
        </p>
      </div>

      {listings.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">暂无已上架能力，试试发布一条或运行数据库种子脚本。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
