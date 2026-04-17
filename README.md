# AgentMarket

把「时间与 token 训练出的 Agent 能力」做成可发现、可下单、可交付的最小可行市场。当前代码为 **MVP 原型**：含匿名会话、上架、浏览、下单与买卖双方控制台；**不含真实支付、托管与链上结算**。

## 产品分层（实施路线）

1. **信任与发现（当前）**：结构化上架字段、标签、交付形态、训练投入说明；市场列表与详情页。
2. **交易闭环（当前）**：订单表记录价格与状态；支持「即时交付 Markdown」与「卖家手动交付」。
3. **结算与风控（下一步）**：Stripe / 国内支付、退款、争议与评价；可选平台抽成。
4. **交付标准化（与 OpenClaw 对齐）**：能力包签名与版本号、MCP 端点健康检查、沙箱试用分钟数、使用量计量。
5. **合规与产权（中长期）**：服务条款、可审计访问日志、密钥托管（Vault）、地域与数据出境策略。

## 本地运行

**Node 版本**：建议使用 **20.19+**、**22.13+** 或 **24+**（满足依赖链里 `eslint-visitor-keys` 的 `engines` 要求，可避免 `EBADENGINE` 警告；你当前的 22.2.0 会触发该警告，升级 Node 即可消除）。

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### Windows：`npm install` 报 `EBUSY`（重命名 `@prisma/engines` 失败）

多为 **文件被占用**：本项目的 `next dev` / `prisma studio`、其它终端里的 Node、杀毒/Defender 实时扫描、或资源管理器打开了 `node_modules` 下的文件夹。

按顺序尝试：

1. **停掉本项目相关进程**：关掉正在跑的开发服务器、Prisma Studio；在任务管理器中结束占用该目录的 `Node.js`（确认没有其它重要 Node 任务后再结束）。
2. **关掉可能锁定文件的程序**：暂时退出 Cursor/VS Code 再装（或至少关掉所有指向该仓库的终端）。
3. **删除依赖后重装**（在项目根目录执行；**命令提示符 cmd** 与 **PowerShell** 命令不同，不要混用）：

   **命令提示符（cmd.exe）**：

   ```bat
   rmdir /s /q node_modules
   del /f /q package-lock.json
   npm install
   ```

   **PowerShell**（开始菜单搜「PowerShell」打开，或在 Cursor 里把终端默认 shell 设为 PowerShell）：

   ```powershell
   Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue
   npm install
   ```

4. 若仍 `EBUSY`：把 **`D:\AI project\agentmarket`** 加入 **Windows 安全中心 → 病毒和威胁防护 → 管理设置 → 排除项**，或对 `node_modules` 关闭实时扫描后再执行第 3 步。
5. 极端情况：注销或重启后再删除 `node_modules` 并重装。

`EBUSY` 与 `EBADENGINE` 是两件事：前者是 **文件锁**，后者是 **Node 版本偏旧**；两者可同时处理。

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
