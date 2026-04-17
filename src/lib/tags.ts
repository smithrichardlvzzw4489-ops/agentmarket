export function tagsToJson(tags: string[]) {
  return JSON.stringify(tags.map((t) => t.trim()).filter(Boolean));
}

export function parseTagsJson(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}
