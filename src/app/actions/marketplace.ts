"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { DeliveryFormat, ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/session";
import { makeUniqueSlug } from "@/lib/slug";
import { tagsToJson } from "@/lib/tags";

const deliveryEnum = z.enum([
  "OPENCLAW_BUNDLE",
  "MCP_SERVER",
  "PROMPT_PACK",
  "WEBHOOK_API",
  "HYBRID",
]);

const createListingSchema = z.object({
  title: z.string().trim().min(3).max(120),
  tagline: z.string().trim().min(3).max(200),
  description: z.string().trim().min(20).max(12000),
  tagsRaw: z.string().trim().min(1).max(500),
  deliveryFormat: deliveryEnum,
  trainingEffortSummary: z.string().trim().max(2000).optional(),
  priceUsd: z.coerce.number().min(0).max(1_000_000),
  publishNow: z.boolean(),
  instantDeliverMd: z.string().trim().max(20000).optional(),
});

function parseTags(raw: string) {
  return raw
    .split(/[,，\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 16);
}

export type MarketplaceActionResult =
  | { ok: true; slug?: string }
  | { ok: false; message: string };

export async function createListingAction(formData: FormData): Promise<MarketplaceActionResult> {
  const user = await requireSessionUser();

  const parsed = createListingSchema.safeParse({
    title: formData.get("title"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    tagsRaw: formData.get("tags"),
    deliveryFormat: formData.get("deliveryFormat"),
    trainingEffortSummary: formData.get("trainingEffortSummary") || undefined,
    priceUsd: formData.get("priceUsd"),
    publishNow: formData.get("publishNow") === "on",
    instantDeliverMd: formData.get("instantDeliverMd") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "表单校验失败" };
  }

  const tags = parseTags(parsed.data.tagsRaw);
  if (tags.length === 0) {
    return { ok: false, message: "请至少填写一个能力标签（用逗号分隔）。" };
  }

  const priceMinor = Math.round(parsed.data.priceUsd * 100);
  const status: ListingStatus = parsed.data.publishNow ? "LIVE" : "DRAFT";
  const slug = makeUniqueSlug(parsed.data.title);

  await prisma.agentListing.create({
    data: {
      sellerId: user.id,
      slug,
      title: parsed.data.title,
      tagline: parsed.data.tagline,
      description: parsed.data.description,
      capabilityTagsJson: tagsToJson(tags),
      deliveryFormat: parsed.data.deliveryFormat as DeliveryFormat,
      trainingEffortSummary: parsed.data.trainingEffortSummary || null,
      priceMinor,
      status,
      instantDeliverMd: parsed.data.instantDeliverMd || null,
    },
  });

  revalidatePath("/market");
  revalidatePath("/dashboard");
  return { ok: true, slug };
}

export async function placeOrderAction(listingId: string): Promise<MarketplaceActionResult> {
  const buyer = await requireSessionUser();

  const listing = await prisma.agentListing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.status !== "LIVE") {
    return { ok: false, message: "该能力暂不可购买。" };
  }

  if (listing.sellerId === buyer.id) {
    return { ok: false, message: "不能购买自己上架的能力。" };
  }

  const existing = await prisma.order.findFirst({
    where: { listingId: listing.id, buyerId: buyer.id, status: { in: ["PENDING", "FULFILLED"] } },
  });

  if (existing) {
    return { ok: false, message: "你已对该能力发起过交易，请在控制台查看。" };
  }

  const instant = listing.instantDeliverMd?.trim();
  await prisma.order.create({
    data: {
      listingId: listing.id,
      buyerId: buyer.id,
      sellerId: listing.sellerId,
      amountMinor: listing.priceMinor,
      currency: listing.currency,
      status: instant ? "FULFILLED" : "PENDING",
      fulfillmentMd: instant ?? null,
    },
  });

  revalidatePath("/market");
  revalidatePath(`/market/${listing.slug}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

const fulfillSchema = z.object({
  orderId: z.string().min(1),
  fulfillmentMd: z.string().trim().min(10).max(20000),
});

export async function fulfillOrderAction(formData: FormData): Promise<MarketplaceActionResult> {
  const seller = await requireSessionUser();

  const parsed = fulfillSchema.safeParse({
    orderId: formData.get("orderId"),
    fulfillmentMd: formData.get("fulfillmentMd"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "交付内容不合法" };
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order || order.sellerId !== seller.id) {
    return { ok: false, message: "无权操作该订单。" };
  }

  if (order.status !== "PENDING") {
    return { ok: false, message: "该订单已交付或已结束。" };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      fulfillmentMd: parsed.data.fulfillmentMd,
      status: "FULFILLED",
    },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function publishListingAction(formData: FormData) {
  const user = await requireSessionUser();
  const listingId = String(formData.get("listingId") ?? "");
  if (!listingId) redirect("/dashboard");

  const listing = await prisma.agentListing.findUnique({ where: { id: listingId } });
  if (!listing || listing.sellerId !== user.id) {
    redirect("/dashboard");
  }
  await prisma.agentListing.update({
    where: { id: listingId },
    data: { status: "LIVE" },
  });
  revalidatePath("/market");
  revalidatePath("/dashboard");
  redirect(`/market/${listing.slug}`);
}
