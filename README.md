# AgentMarket

把「时间与 token 训练出的 Agent 能力」做成可发现、可下单、可交付的最小可行市场。当前代码为 **MVP 原型**：含匿名会话、上架、浏览、下单与买卖双方控制台；**不含真实支付、托管与链上结算**。

## 产品分层（实施路线）

1. **信任与发现（当前）**：结构化上架字段、标签、交付形态、训练投入说明；市场列表与详情页。
2. **交易闭环（当前）**：订单表记录价格与状态；支持「即时交付 Markdown」与「卖家手动交付」。
3. **结算与风控（下一步）**：Stripe / 国内支付、退款、争议与评价；可选平台抽成。
4. **交付标准化（与 OpenClaw 对齐）**：能力包签名与版本号、MCP 端点健康检查、沙箱试用分钟数、使用量计量。
5. **合规与产权（中长期）**：服务条款、可审计访问日志、密钥托管（Vault）、地域与数据出境策略。

## 本地运行

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

浏览器访问 `http://localhost:3000`。首次访问会通过 `/api/session/init` 写入匿名会话 Cookie（`gm_uid`），并在数据库创建对应用户。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run db:push` | 根据 `prisma/schema.prisma` 更新本地 SQLite |
| `npm run db:studio` | 打开 Prisma Studio 查看数据 |
| `npm run db:seed` | 写入演示上架数据 |

## 技术栈

Next.js（App Router）· React · Tailwind CSS v4 · Prisma · SQLite（可替换为 Postgres）
