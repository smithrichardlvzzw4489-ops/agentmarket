import { PrismaClient, DeliveryFormat, ListingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.agentListing.deleteMany();
  await prisma.user.deleteMany();

  const aurora = await prisma.user.create({ data: { handle: "openclaw_researcher_aurora" } });
  const studio = await prisma.user.create({ data: { handle: "market_ops_studio" } });

  await prisma.agentListing.create({
    data: {
      sellerId: aurora.id,
      slug: "deep-web-intel-scout",
      title: "深海情报探针",
      tagline: "多源信息聚合、去噪与引用追踪，适合竞品与政策跟踪。",
      description:
        "该 Agent 在真实业务中经过多轮迭代：支持 RSS、邮件列表、公开数据库与受限站点的合规抓取策略模板；输出结构化简报，并保留可点击引用链。购买方可获得 OpenClaw 能力包与配套 MCP 工具清单。",
      capabilityTagsJson: JSON.stringify(["信息收集", "引用", "简报", "合规"]),
      deliveryFormat: DeliveryFormat.HYBRID,
      trainingEffortSummary: "约 120 万 tokens 与 6 周迭代，含 3 次真实项目复盘",
      priceMinor: 199_00,
      status: ListingStatus.LIVE,
      instantDeliverMd:
        "## 即时交付（示例）\n\n- OpenClaw bundle：`https://example.com/bundles/intel-scout.bundle`\n- 变更日志：见 bundle 内 `CHANGELOG.md`\n",
    },
  });

  await prisma.agentListing.create({
    data: {
      sellerId: studio.id,
      slug: "vc-deal-room-digest",
      title: "一级市场 Deal Room 摘要官",
      tagline: "把冗长条款与数据 room 压缩成可执行要点，突出风险与对赌。",
      description:
        "面向投资团队的文档型 Agent：擅长 PDF/HTML 混合材料解析、表格抽取与条款对照。默认输出「执行摘要 + 风险矩阵 + 待澄清问题列表」。",
      capabilityTagsJson: JSON.stringify(["文档", "抽取", "风险", "投资"]),
      deliveryFormat: DeliveryFormat.PROMPT_PACK,
      trainingEffortSummary: "约 40 万 tokens 与 2 周专项微调",
      priceMinor: 89_00,
      status: ListingStatus.LIVE,
    },
  });

  await prisma.agentListing.create({
    data: {
      sellerId: aurora.id,
      slug: "supply-chain-signal-hunter",
      title: "供应链信号猎手",
      tagline: "港口、运力与大宗指标的另类数据源交叉验证。",
      description:
        "结合公开航运数据、行业新闻与社交信号的弱监督 pipeline；强调可解释的时间序列对齐与异常标注。适合研究与风控团队作为外脑。",
      capabilityTagsJson: JSON.stringify(["另类数据", "时间序列", "供应链"]),
      deliveryFormat: DeliveryFormat.MCP_SERVER,
      trainingEffortSummary: "持续在线迭代中，当前为 beta 能力",
      priceMinor: 299_00,
      status: ListingStatus.DRAFT,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
