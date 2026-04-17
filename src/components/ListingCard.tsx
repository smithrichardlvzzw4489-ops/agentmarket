import Link from "next/link";
import type { AgentListing, User } from "@prisma/client";
import { deliveryFormatLabel } from "@/lib/delivery-format";
import { formatMinor } from "@/lib/money";
import { parseTagsJson } from "@/lib/tags";

type ListingWithSeller = AgentListing & { seller: Pick<User, "handle"> };

export function ListingCard({ listing }: { listing: ListingWithSeller }) {
  const tags = parseTagsJson(listing.capabilityTagsJson).slice(0, 4);

  return (
    <Link
      href={`/market/${listing.slug}`}
      className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
            {listing.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{listing.tagline}</p>
        </div>
        <div className="shrink-0 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {formatMinor(listing.priceMinor, listing.currency)}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
        <span>{deliveryFormatLabel(listing.deliveryFormat)}</span>
        <span className="font-mono text-[11px]">@{listing.seller.handle}</span>
      </div>
    </Link>
  );
}
