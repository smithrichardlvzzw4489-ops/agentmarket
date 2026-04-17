import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session-constants";

export { SESSION_COOKIE } from "@/lib/session-constants";

export async function getSessionUser() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("未找到会话用户，请刷新页面完成初始化。");
  return user;
}
