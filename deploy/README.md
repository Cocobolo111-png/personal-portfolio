# 作品集生产部署

正式站点：<https://create.byheyang.cn/>

独立预览：<https://cocobolo111-png.github.io/personal-portfolio/>

GitHub main → GitHub Actions → 专用用户 SSH/rsync → Caddy → HTTPS 静态站点。
不需要 React 开发服务器、常驻 Node、数据库、Docker 或 PM2。详细服务器审计仅保存在本机，不上传公共仓库。

## 日常更新

1. Codex 在分支修改代码，保留项目事实与内容边界。
2. 创建 PR，检查 Node.js 22 / pnpm 10 下两种部署路径构建通过，人工验收页面。
3. 合并 main；生产工作流和原有 Pages 工作流各自发布。
4. 查看 Actions 结果，并核对正式站点 `/deployment.json` 的 commit。

生产构建为 `PORTFOLIO_BASE=/`、`PORTFOLIO_ORIGIN=https://create.byheyang.cn`；
Pages 构建为 `PORTFOLIO_BASE=/personal-portfolio/`。不要混用产物，也不要给 Pages 添加正式域名 CNAME。

`pnpm install --frozen-lockfile` 后，`pnpm build` 包含 TypeScript 检查、Vite 构建和五个案例的静态 HTML 入口。
每页生成标题、Canonical，产物还包含 robots.txt、sitemap.xml 和 favicon。
Caddy 直接提供静态入口，不使用全路径 SPA fallback；未知路径和缺失资源返回真实 404。

## 发布与凭证

[production.yml](../.github/workflows/production.yml) 先构建、检查、生成 Commit SHA 与 SHA256SUMS，
上传完整 `dist`（包含隐藏占位文件），再通过 SSH 上传到 incoming；服务器验证文件后原子切换 current。
真实 TLS 健康检查失败时恢复原指针；只有通过健康检查的版本才标记 `.verified`，支持回滚。

Environment `production` 的部署分支限制为 **main branch**，不允许任意分支或标签。
Secrets：`DEPLOY_HOST`、`DEPLOY_SSH_KEY`、`DEPLOY_KNOWN_HOSTS`。
Environment Variables：`DEPLOY_PORT`、`DEPLOY_USER=portfolio-deploy`。
仓库变量 `PRODUCTION_DEPLOY_ENABLED=true` 启用发布，false 停止后续发布；构建仍可执行并留存产物。

专用部署用户无 sudo、密码锁定，仅使用专用公钥认证；公钥禁用转发和 PTY。
Host Key 已通过可信记录核验，StrictHostKeyChecking 始终开启。
私钥只在 GitHub Environment Secrets 内保存，运行时临时文件由 job 清理；不进入仓库或聊天。
日常发布不使用 root/admin，也不需要重载 Web 服务。只上传 dist，不上传源码或 node_modules。

## 目录与缓存

```text
/srv/www/sites/portfolio/
  incoming/<sha>-<run>-<attempt>/
  releases/<sha>-<run>-<attempt>/
  current -> releases/<healthy-release>
  previous -> releases/<previous-healthy-release>
  deployments.log
/usr/local/libexec/portfolio-release
/etc/caddy/sites-available/portfolio.caddy
/etc/caddy/sites-enabled/portfolio.caddy
```

发布脚本 root 所有，部署用户不能修改。版本目录保留，不自动删除 current/previous 或其他版本。
哈希资源保留旧文件，已打开页面可以跨发布继续加载；HTML 使用 no-cache，哈希资源一年 immutable，普通媒体一小时缓存。
Actions 构建产物保留 14 天，服务器版本不依赖其保留期。磁盘维护时应先核对当前/回滚指针与发布日志。

## HTTPS 与服务维护

复用 Caddy，独立 server_name、目录及配置，不覆盖其他站点。
证书由明确配置的 Let’s Encrypt ACME issuer 自动管理，Caddy 已启用开机启动，证书持久化目录归服务用户管理。
首次上线已验证独立 staging CA 域名挑战、正式受信任证书、HTTP→HTTPS、持久化权限和保留证书的平滑重载。
实际到期前续期结果需要后续运维核对，不能把首发签发或 staging 测试表述为一次已发生的到期续期。

现有网络曾出现 ACME 出站 HTTP/2 响应超时；使用 [systemd 兼容配置](caddy-acme-network.conf.example)
将 Caddy 的出站客户端设为 HTTP/1.1。只作用于该服务的出站请求，不关闭 TLS 校验，也不关闭网站入站 HTTP/2。
参考：[Go HTTP/2 客户端设置](https://pkg.go.dev/net/http#hdr-HTTP_2)、[Caddy 自动 HTTPS](https://caddyserver.com/docs/automatic-https)。

修改站点配置后先运行 `sudo caddy validate --config /etc/caddy/Caddyfile`，通过后 `sudo systemctl reload caddy`。
不要为日常发布重启服务器、替换 Web 服务或重启其他站点。

## 回滚

先将 GitHub 仓库变量 `PRODUCTION_DEPLOY_ENABLED` 设为 false，并等待或取消在途生产发布，避免它覆盖回滚。
使用部署用户连接服务器后：

```sh
cd /srv/www/sites/portfolio
readlink current
readlink previous
cat deployments.log
previous_release=$(basename "$(readlink previous)")
previous_sha=${previous_release%%-*}
/usr/local/libexec/portfolio-release rollback "$previous_release" "$previous_sha"
```

回滚再次验证哈希与真实 TLS 路由，原子切换；失败恢复切换前版本。不会删除任何 release。
之后通过 revert/fix PR 修复 main，验收后恢复发布开关。不使用强推覆盖 Git 历史。

## 备案与验收边界

网站 Footer 使用已核实的 `赣ICP备2026027416号-1`，链接工信部查询。
公安联网备案仍需按实际要求办理，取得编号后再展示。
公开桌面端已做基本冒烟测试；完整移动端优化和长期可用性观察属于后续工作。
