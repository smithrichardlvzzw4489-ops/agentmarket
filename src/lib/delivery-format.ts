import type { DeliveryFormat } from "@prisma/client";

const labels: Record<DeliveryFormat, string> = {
  OPENCLAW_BUNDLE: "OpenClaw 能力包",
  MCP_SERVER: "MCP 服务",
  PROMPT_PACK: "提示词与流程",
  WEBHOOK_API: "Webhook / API",
  HYBRID: "混合交付",
};

export function deliveryFormatLabel(f: DeliveryFormat) {
  return labels[f] ?? f;
}
