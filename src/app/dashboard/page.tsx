import { OrderStatus, ListingStatus } from "@prisma/client";
import Link from "next/link";
import { publishListingAction } from "@/app/actions/marketplace";
import { FulfillForm } from "@/components/FulfillForm";
import { deliveryFormatLabel } from "@/lib/delivery-format";
import { formatMinor } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/session";
import { parseTagsJson } from "@/lib/tags";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireSessionUser();

  const [listings, buys, sells] = await Promise.all([
    prisma.agentListing.findMany({
      where: { sellerId: user.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.order.findMany({
      where: { buyerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { listing: true },
    }),
    prisma.order.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { listing: true, buyer: { select: { handle: true } } },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">控制台</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          当前身份：<span className="font-mono text-zinc-900 dark:text-zinc-200">@{user.handle}</span>
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">我的上架</h2>
        {listings.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            暂无记录。去 <Link className="text-emerald-700 underline dark:text-emerald-300" href="/sell/new">发布能力</Link>。
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {listings.map((l) => (
              <li
                key={l.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link className="font-medium text-zinc-900 hover:text-emerald-700 dark:text-zinc-50 dark:hover:text-emerald-300" href={`/market/${l.slug}`}>
                      {l.title}
                    </Link>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">{l.status}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {deliveryFormatLabel(l.deliveryFormat)} · {formatMinor(l.priceMinor, l.currency)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {parseTagsJson(l.capabilityTagsJson).map((t) => (
                      <span key={t} className="rounded-full bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {l.status === ListingStatus.DRAFT && (
                  <form action={publishListingAction}>
                    <input type="hidden" name="listingId" value={l.id} />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-500"
                    >
                      上架
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">我买到的</h2>
        {buys.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">暂无订单。</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {buys.map((o) => (
              <li key={o.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link className="font-medium text-zinc-900 hover:text-emerald-700 dark:text-zinc-50 dark:hover:text-emerald-300" href={`/market/${o.listing.slug}`}>
                    {o.listing.title}
                  </Link>
                  <span className="text-xs text-zinc-500">{o.status === OrderStatus.FULFILLED ? "已交付" : "待交付"}</span>
                </div>
                <div className="mt-2 text-xs text-zinc-500">{formatMinor(o.amountMinor, o.currency)}</div>
                {o.fulfillmentMd ? (
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    {o.fulfillmentMd}
                  </pre>
                ) : (
                  <p className="mt-3 text-xs text-zinc-500">卖家尚未填写交付说明。</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">我卖出的订单</h2>
        {sells.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">暂无买家下单。</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {sells.map((o) => (
              <li key={o.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">{o.listing.title}</div>
                  <span className="text-xs text-zinc-500">买家 @{o.buyer.handle}</span>
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  {o.status === OrderStatus.FULFILLED ? "已交付" : "待你交付"} · {formatMinor(o.amountMinor, o.currency)}
                </div>
                {o.fulfillmentMd && (
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    {o.fulfillmentMd}
                  </pre>
                )}
                {o.status === OrderStatus.PENDING && <FulfillForm orderId={o.id} />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
