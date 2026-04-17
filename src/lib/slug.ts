import { randomBytes } from "crypto";

export function slugifyBase(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function makeUniqueSlug(title: string) {
  const base = slugifyBase(title) || "listing";
  const suffix = randomBytes(3).toString("hex");
  return `${base}-${suffix}`;
}
