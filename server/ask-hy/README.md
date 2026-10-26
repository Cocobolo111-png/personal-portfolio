# Ask HY V0.1 — secure DeepSeek endpoint

Ask HY 是作品集 Fun 页面里的侧边对话实验。这个目录只服务端运行，不进入 Vite 客户端构建。

## 文件

- `server.mjs`：HTTP 路由、CORS/来源校验、限流、超时、DeepSeek 调用、响应归一化。
- `config.mjs`：读取环境变量；`.env.local` 不会被提交。
- `knowledge.mjs` + `knowledge/public-knowledge.json`：只加载 `status=public_seed` 的公开资料。
- `prompt.mjs`：内部人格与回答规则；不会发送给浏览器。
- `guard.mjs`：隐私/密钥/提示词注入/伪造数据的前置拦截，以及输出校验。
- `limiter.mjs`：滑动窗口限流、每日请求/Token 预算、并发闸门。
- `acceptance.mjs`：真实 API 验收脚本（需要本地服务已启动）。

## 本地运行

需要 Node.js 22+。仓库根目录执行：

```sh
# 服务端读取仓库根的 .env.local（该文件被 .gitignore 忽略）
cp server/ask-hy/.env.example .env.local
# 编辑 .env.local，填入 DEEPSEEK_API_KEY

ASK_HY_PORT=8790 node server/ask-hy/server.mjs
```

另开一个终端启动前端，Vite 会把 `/api/ask-hy` 代理到 `127.0.0.1:8790`：

```sh
pnpm dev
# 打开 http://127.0.0.1:5173/fun
```

也可以先构建再预览：

```sh
pnpm build
pnpm preview --port 4175
```

`vite.config.ts` 中的 `ASK_HY_API_TARGET` 可改代理目标。不要把 Key 写进任何 `VITE_*` 变量。

### 三种运行状态

| 状态 | 条件 | UI |
|---|---|---|
| `live` | 有 `DEEPSEEK_API_KEY` | 正常对话，回答带“公开资料 / AI 推测 / 资料不足 / 边界说明”标记 |
| `demo` | `ASK_HY_MOCK=1` 且无 Key | 顶部显示 `DEMO` 与“不是真实模型”提示 |
| `unconfigured` | 没有 Key 且没有 `ASK_HY_MOCK` | 显示“AI 尚未配置”，不伪造回答 |

`GET /api/ask-hy/health` 返回 `{ ok, configured, mode }`，前端据此显示状态。健康检查不调用模型。

模型默认 `deepseek-v4-pro`，用 `DEEPSEEK_MODEL` 覆盖，并可用 `DEEPSEEK_FALLBACK_MODEL` 指定空回答时的备用模型。本轮实测 `deepseek-flash` 在 JSON 模式下偶尔把最终 `content` 返回为空白；服务端会对空白回答自动重试一次，仍失败才返回 502。所有尝试共享 `ASK_HY_TIMEOUT_MS` 的总时限。

## API 契约

`POST /api/ask-hy`

```json
{ "messages": [{ "role": "user", "content": "TrainTrace 是做什么的？" }] }
```

成功响应：

```json
{
  "answer": "根据公开项目资料……",
  "answer_kind": "fact",
  "related_projects": [{ "id": "traintrace", "label": "TrainTrace" }],
  "disclaimer": null,
  "mode": "live"
}
```

`related_projects` 只可能是服务端白名单中的 id；前端再用自己的 id → 站内路由映射生成链接。模型不能返回任意 URL。

错误响应只包含可读的 `error` 与 `message`，不转发 DeepSeek 原始报错：

- `400` 消息格式/长度问题
- `413` 请求体超过 32 KB
- `415` 非 JSON
- `429` 单 IP 限流、并发或每日预算
- `502` 上游失败/鉴权失败
- `503` `not_configured`
- `504` 超时

## 安全控制

- Key 只在服务端环境变量；不写入客户端、JSON、构建产物或日志。
- 只接受 `POST` + `application/json`；请求体上限 32 KB；消息数上限 8；单条 600 字符。
- 只允许 `user` / `assistant` 角色，客户端不能注入 `system` 消息。
- 按 IP 滑动窗口（默认 12 次 / 10 分钟）+ 每日请求上限（300）+ 每日 Token 上限（200k）+ 并发 4。
- 上游超时 25 秒；不把原始上游错误、堆栈或鉴权信息返回给访客。
- 默认只记录请求 id、状态、耗时、答案类型、字数、Token、脱敏 IP；不记录问题或回答正文。
- 对隐私、账号密钥、系统提示词、历史聊天、角色覆盖和伪造数据做前置拦截；输出再做泄漏检查。
- 知识库只加载 `public_seed`；`owner_review`、`inference_only` 事实和私人资料不进入公开 system prompt。
- `ASK_HY_TRUST_PROXY=1` 时只信任 `X-Real-IP`（应由 Caddy 覆盖），不直接信任客户端可伪造的 `X-Forwarded-For`。

## 生产接线（本轮未执行）

当前正式站是 Caddy 托管的静态站点。真实 AI 需要一个常驻 Node 进程；**本轮没有部署、没有改生产 Caddy、没有发布**。上线前需要：

1. 把服务端代码放到服务器固定目录，例如 `/srv/ask-hy/`，创建专用无 sudo 用户。
2. Key 放在 root 拥有、权限 600 的 `/etc/ask-hy.env`，不要放在仓库或 web 根目录。
3. 用 systemd 运行 `node server/ask-hy/server.mjs`，仅监听 `127.0.0.1:8787`。
4. Caddy 增加 `/api/ask-hy*` 反向代理，并覆盖 `X-Real-IP`。示例见 `Caddyfile.example` 与 `ask-hy.service.example`。
5. 设置 `NODE_ENV=production`，显式配置 `ASK_HY_ALLOWED_ORIGINS`，验证 HTTPS、限流、无 Key、上游失败和费用上限。

不要把静态 `dist` 直接当 API；GitHub Pages 预览没有 Node 进程，页面会显示“AI 服务未连接”。

## 验收

单元/集成测试（不调用真实模型）：

```sh
node --test server/ask-hy/*.test.mjs
```

真实 API 验收（先启动带 Key 的本地服务）：

```sh
ASK_HY_BASE_URL=http://127.0.0.1:8790 node server/ask-hy/acceptance.mjs
```

报告默认写入 `.artifacts/ask-hy/acceptance-report.json`。脚本会检查事实边界、AI 推测标记、隐私拒绝、注入防护、项目链接、未配置、限流和上游错误映射。

## 知识库审核

上线前请确认：

- Work / Fun 项目名称与当前公开路由一致。
- 每个“已经实现”的表述能在仓库或案例页找到证据。
- 所有公开链接实际可访问；JobFlow、王者胜率预测、时间规划 Demo 没有公开入口。
- `owner_review`（学历、历史粉丝/播放数据、具体兴趣清单）没有进入运行时知识。
- 私人生活、伴侣、健康、训练记录、简历账号、密钥没有进入知识文件。
- 推断性问题始终显示“AI 推测，不代表本人观点”。

## 已知边界

- V0.1 是单轮/短历史对话，没有跨会话记忆、登录、后台知识管理或向量检索。
- 模型可能仍会误解问题；协议层能保证不泄漏密钥、不返回任意链接，但不能保证每句话都正确。上线前应保留人工抽检。
- 每日上限是请求/Token 预算，不是精确账单；DeepSeek 价格与模型可用性以官方账户为准。

## Fun V1.0 整合

2026-10-26 的新版说明见 `docs/fun-v1.md`。Work 仅 TrainTrace 与 AI Content Growth System；旧视频工作台 id 映射合并案例，其他 Fun 演示 id 仅指向受控页内入口。人格六条与服务端调用、守卫、限流核心保持原实现。8790 为本地整合验收端口；生产示例使用 8787，二者由环境变量明确配置。
