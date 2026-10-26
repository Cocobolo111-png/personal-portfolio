# Fun V1.0 — 本地开发与验收

2026-10-26。当前交付不提交、不推送、不部署。Work 的 TrainTrace / AI Content Growth System 与 Hero 的代码、样式、项目数据保持本轮开始时的版本。导航按要求将 Play 替换为 Fun。

## 运行

本轮本机：`http://127.0.0.1:5180/fun`，整合 API：`http://127.0.0.1:8790/api/ask-hy/health`。

使用现有 Node 22+ / pnpm，不新增依赖。前端必须使用项目命令（显式 `--config vite.config.ts`），避免读取历史构建遗留的 `vite.config.js`：

```sh
pnpm dev --host 127.0.0.1 --port 5180
# 独立终端：配置只属于服务端，不要使用 VITE_DEEPSEEK_API_KEY
ASK_HY_PORT=8790 node server/ask-hy/server.mjs
```

重启后若没有服务端 Key，明确显示未配置，不伪造回答。可按 `server/ask-hy/.env.example` 在忽略的根 `.env.local` 配置，或通过进程环境注入。`ASK_HY_API_TARGET` 可覆盖本地代理，默认 `http://127.0.0.1:8790`。生产示例仍使用回环 8787。此次真实验收经用户明确授权，仅在内存中复用既有服务端配置，没有保存 Key。

## 六项作品与真实来源

| 项目 | 素材与源码 | 本页可体验程度 |
| --- | --- | --- |
| Ask HY | 从 `Documents/deepseek-harness/default-workspace` 选择性迁移 Panel、hook、API、守卫、限流、公开知识、测试与部署示例；封面为原界面中真实 DeepSeek 鸡/蛋对话截图 | 真实模型文字聊天、推荐问题、加载、错误重试、事实/推测/未知/隐私标签；右侧面板/手机底部层 |
| 盘两下 | 现有 `手串小程序/dist` 只读运行，全新浏览器实际拖动 5 次，计数 0→10；对真实 stage 裁切与转码 | 悬停短录像、完整手动播放、保留案例页；未确认公开体验域名，不生成外链 |
| Love Journal | 原 `projects/love-journal/hero.jpg` 与 `portal-walkthrough.webm` | 原入口穿越录像、原案例；不接触私人网站或真实生活资料 |
| JobFlow | `简历投递/jobflow/docs/jobflow/screenshots` 的 desktop、v011-report、import-preview；核对 V0.1.1 README 和源码 | 原扩展的三种真实界面/合成数据预览；不在网页里冒充已安装扩展，不声称自动提交 |
| 下一把（王者胜率实验） | `规划/next-round` 的已标注测试截图与 `src/domain/analysis.ts`；统计文件原样复用到 `funGameRules.ts` | 可点选 5 场示例胜负并实时重算/恢复；只统计历史，不预测下一局；本页无 OCR |
| 时间规划实验 | 原 `规划` Growth OS 的 dist/server/shared 复制到临时目录，全新示例数据库，打开真实时间块编辑器并录像 | 原界面录像；不连接真实日程数据库；不是新造的通用日历，也不是 AI Content Growth System |

所有新增封面来自真实 UI，已嵌入来源元数据。WebP 封面和两个 MP4 合计约 661 KB；既有 Love Journal 视频按需复用，不重复复制。原 PNG/WebM 采集件保存在忽略的 `.impeccable/review/fun-v1/sources/`。

## 内容和交互边界

Fun 使用既有白、黑、#1646e8 及 Archivo 字体。宽幅 Ask HY + 非对称五项画廊；没有新增全站设计 token、框架、Canvas 或 WebGL。仅原盘两下录像呈现已有 3D。

卡片视频 `preload=none`，悬停才赋予 src；移出或离开视口暂停；不持续循环。减少动态偏好下不自动播放，手动演示仍可使用。手机保留清晰入口和原生视频控制。

Ask HY 只更新必要的公开项目事实、项目 id/路由映射与来源。人格六条、排除主题、调用/限流/守卫核心保留。两个旧内容项目 id 指向同一个合并案例，并按路径去重；Fun 演示链接仅为受控页内锚点。`fact/inference/unknown/safety` 不合并。

## 生产准备（本轮不执行）

1. 人工验收页面与公开知识后，将完整静态构建及 `/fun/index.html` 纳入现有原子发布流程。保留 Work/Story 的直接入口和缓存策略。
2. 单独部署 `server/ask-hy/`，Node 22+；不要把 server、知识文件、环境变量或本地验收目录放进静态 dist。
3. 参考 `server/ask-hy/ask-hy.service.example` 建立非 root 的 `ask-hy` 用户和 systemd 服务。示例 `/srv/ask-hy`、`/etc/ask-hy.env` 是待配置位置，不是已建立状态。环境文件应仅服务用户可读（如 0600）；Key 在服务端填写。
4. 在现有 Caddy site 中合并 `Caddyfile.example` 的 API handle，指向回环 8787；保留现有静态 handle、缓存、HTTPS 与真实 404。不要整体替换当前 Caddy 配置。
5. 生产设置 `NODE_ENV=production`、`ASK_HY_ALLOWED_ORIGINS=https://create.byheyang.cn`、`ASK_HY_ALLOWED_HOSTS=create.byheyang.cn,127.0.0.1,localhost`、`ASK_HY_TRUST_PROXY=1`、随机 `ASK_HY_LOG_SALT`；仅在 Caddy 覆盖 X-Real-IP 后信任代理。
6. 按预算确认模型、每 IP 12 次/10 分钟、每天 300 次/200k Token、并发 4、25 秒超时等原默认值。账单与告警另外核查；现有限额驻内存，进程重启会重置，不能替代计费上限。
7. 本地与上公网分别检查 health、真实提问、429/502/504、隐私拦截、Caddy 请求体限制、日志不含正文或 Key。先保留静态/API 双回滚路径。

GitHub Pages 仍是静态预览，不能单独运行 Node API；本轮没有为它跨域接通生产接口。

## 验收材料与限制

构建、静态路由检查、服务端测试、真实模型和四视口浏览器报告保存在 `.impeccable/review/fun-v1/`；本轮 237 项浏览器检查、20 项真实 DeepSeek 验收、18 项服务端/规则测试通过；构建与静态直接入口检查通过。`docs/ask-hy-v0.1.md` 是上轮历史报告，不代表本轮公开项目清单。

Chromium 桌面/模拟手机不等于实体 iPhone/Safari/Android 验收。尚未做公网带宽、长时费用、真实触摸/声音或低端机性能测试。JobFlow 公开的是截图，不是在本作品集内运行完整扩展；下一把仅手动示例，时间规划仅真实 UI 录像。没有公开这些源产品的私人数据入口。

截图：`fun-full-1440.png` / `1280` / `1024` / `390`，桌面首屏 `fun-desktop-1440.png`，手机聊天 `chat-390.png`；交互录像 `fun-walkthrough.mp4`。以上文件均在本地审阅目录。当前公开知识的 Work 两项目回答已在真实 UI 中核对。

并行工作说明：本轮期间 Story 和 Résumé 由其他工作流更新，相关内容与新增路由保留，本任务没有编写这些页面。回归只确认当前版本可访问；不将它们的内容变更归入 Fun 交付。Linux 原子发布/回滚脚本本轮未在 macOS 执行，也没有触碰生产服务。
