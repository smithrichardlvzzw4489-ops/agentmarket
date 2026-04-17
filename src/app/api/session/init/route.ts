import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session-constants";

export async function GET(req: NextRequest) {
  const nextPath = req.nextUrl.searchParams.get("next") || "/";
  const target = new URL(nextPath, req.url);

  const existingId = req.cookies.get(SESSION_COOKIE)?.value;
  if (existingId) {
    const existingUser = await prisma.user.findUnique({ where: { id: existingId } });
    if (existingUser) {
      return NextResponse.redirect(target);
    }
  }

  const handle = `trader_${randomBytes(5).toString("hex")}`;
  const user = await prisma.user.create({ data: { handle } });

  const res = NextResponse.redirect(target);
  res.cookies.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
