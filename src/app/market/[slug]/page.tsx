import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PurchaseButton } from "@/components/PurchaseButton";
import { deliveryFormatLabel } from "@/lib/delivery-format";
import { formatMinor } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { parseTagsJson } from "@/lib/tags";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await prisma.agentListing.findUnique({
    where: { slug },
    include: { seller: { select: { handle: true } } },
  });

  if (!listing) notFound();

  const tags = parseTagsJson(listing.capabilityTagsJson);
  const purchasable = listing.status === ListingStatus.LIVE;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/market" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
        ← 返回市场
      </Link>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">{deliveryFormatLabel(listing.deliveryFormat)}</span>
          <span className="font-mono">@{listing.seller.handle}</span>
          {!purchasable && <span className="text-amber-700 dark:text-amber-300">草稿 / 未上架</span>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{listing.title}</h1>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{listing.tagline}</p>
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{formatMinor(listing.priceMinor, listing.currency)}</div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            {t}
          </span>
        ))}
      </div>

      {listing.trainingEffortSummary && (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">训练与迭代投入</div>
          <p className="mt-2 whitespace-pre-wrap">{listing.trainingEffortSummary}</p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">能力说明</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{listing.description}</p>
      </section>

      <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">获取能力</h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          当前为原型下单：将创建一条买卖双方可见的订单记录。若上架方配置了「即时交付」，你会立刻在控制台看到 Markdown 交付物；否则需要卖家在控制台填写交付说明。
        </p>
        {purchasable ? (
          <PurchaseButton listingId={listing.id} />
        ) : (
          <p className="text-sm text-zinc-500">该能力尚未上架。</p>
        )}
      </div>
    </div>
  );
}
