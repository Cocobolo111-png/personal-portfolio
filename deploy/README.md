# 阿里云生产部署

目标：<https://create.byheyang.cn>。**尚未公开上线，生产工作流尚未启用。**
详细服务器审计单独保存在本机，不上传公共仓库。不以构建成功代替线上验收。

## 结构

GitHub main → Actions（Node 22 / pnpm 10）→ SSH + rsync → 独立目录 → Caddy 自动 HTTPS。
服务器已安装 Caddy，复用它比安装 Nginx 侵入更小；无需新增数据库、Docker、PM2 或常驻 Node。

建议目录（最终启用前再次核对，当前未创建）：

```text
/srv/www/sites/portfolio/
  incoming/<sha>-<run>-<attempt>/
  releases/<sha>-<run>-<attempt>/
  current -> releases/<healthy-release>
  previous -> releases/<previous-healthy-release>
  deployments.log
/usr/local/libexec/portfolio-release
/etc/caddy/sites-available/portfolio.caddy
```

`releases` 保留，不自动删除。每个版本附带 `deployment.json` Commit SHA 与 `SHA256SUMS`；
校验所有文件后才切换 `current`，本机真实 HTTPS 健康检查失败则恢复旧指针。
仅成功版本写入 `.verified`，回滚拒绝未经健康检查的版本。
保留旧版本哈希资源，让已打开的页面跨发布继续加载；后续按磁盘情况维护保留策略，不能删除 current/previous 指向的版本。

## 构建与检查

```sh
pnpm install --frozen-lockfile
PORTFOLIO_BASE=/ PORTFOLIO_ORIGIN=https://create.byheyang.cn pnpm build
PORTFOLIO_BASE=/ PORTFOLIO_ORIGIN=https://create.byheyang.cn node scripts/deploy/check-dist.mjs
```

`pnpm build` 已含 TypeScript 检查。`build-pages.mjs` 为五个案例生成标题、Canonical 和独立 HTML，
同时生成 robots.txt / sitemap.xml；不依赖全路径 SPA fallback，未知路径和缺失资源返回 404。

GitHub Pages 保留原有 `.github/workflows/pages.yml`，继续使用 `/personal-portfolio/`；
两套构建由独立 `checks.yml` 校验。不要给 Pages 增加 CNAME 或把生产根路径产物上传 Pages。

## 首次启用顺序（运维操作，待备案同步后由 Codex 继续）

1. 刷新阿里云备案订单和“我的备案”，确认 `byheyang.cn` 已在阿里云成功备案/接入。
   用户提供的编号为 `赣ICP备2026027416号`；如网站备案详情另有 `-1` 等网站编号，应以真实详情更新，不能猜。
2. 再审计服务器进程、80/443 与 Caddy 配置，保留 Love Journal 的 `127.0.0.1:3101` 服务及 `/srv/www/sites/love-journal` 全部文件。
3. 创建无 sudo 的 `portfolio-deploy` 用户，锁定密码，创建上述独立目录，目录归该用户所有、静态目录和文件分别 755/644。
   用户家目录及 `.ssh` 为 700，`authorized_keys` 为 600；仅授权专用部署公钥，使用 `restrict` 禁止转发/PTY。
   不复用 admin 私钥作为 Actions 部署凭证。不修改其他用户 SSH 权限。
4. 将 `scripts/deploy/release.sh` 安装为 root:root、755 的 `/usr/local/libexec/portfolio-release`。
   部署用户日常只运行此脚本，不需要 sudo 或 reload Web 服务。
5. 生成新的部署密钥，私钥仅通过本机 stdin 写入 GitHub production Environment Secret。
   通过控制台 `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` 核对 Host Key 指纹后，保存对应 known_hosts 行；非 22 端口使用 `[host]:port` 格式。
   不把私钥、密码或 AccessKey 放进聊天或 Git。可使用已核验的本机 known_hosts，不盲信新的 ssh-keyscan 结果。
6. 在仓库 Settings → Environments → production 限制 Deployment branches 为 **main**。
   Secrets：`DEPLOY_SSH_KEY`、`DEPLOY_KNOWN_HOSTS`。
   Variables：`DEPLOY_HOST`（实际服务器地址）、`DEPLOY_PORT`（实际 SSH 端口）、`DEPLOY_USER=portfolio-deploy`。
   仓库 Actions variable `PRODUCTION_DEPLOY_ENABLED` 仍保持不存在/false。
7. 只从已验收并合并 main 的提交构建，上传到 incoming，核对 SHA256SUMS。
   首次没有 HTTPS 时，先在独立回环 Caddy 预览验收，建立初始 current 指针；不要把首次证书签发包装成健康发布。
8. 备份现有 `/etc/caddy/Caddyfile`，移除仅原厂的 `:80` 示例块并加入独立站点 import。
   合并 `portfolio.caddy.example`，不覆盖其他站点块。`caddy validate --config /etc/caddy/Caddyfile` 成功后，
   当前 inactive 的 Caddy 才首次启动；已运行时用 `systemctl reload caddy`。确认正常后启用开机启动。
9. DNS 切换前用回环临时站点、`curl -H 'Host: create.byheyang.cn'` 检查静态入口。
   控制台仅配置 create 的 A 记录到该公网 IPv4；核对同名 CNAME/AAAA，不能修改根域名其他解析。
   云防火墙只放行必要 TCP 80/443 与受控 SSH 来源，不公开 3101/4189/2019。
10. DNS 生效后 Caddy 自动签发/续期证书并跳转 HTTPS；检查日志、证书 SAN/有效期、HTTP 跳转、全部路由/资源、404、缓存与浏览器控制台。
    Caddy 没有 Certbot 的 `renew --dry-run`；不要声称未发生的续期已测试。
    先用独立数据目录、ACME staging CA 验证同域名挑战/自动证书管理，再检查生产证书自动管理日志、证书持久化目录权限、服务开机启动和出站 ACME 连通。
    staging 证书不交付用户，也不关闭浏览器或 curl 的生产证书验证。证书到期前的实际续期结果需要后续运维确认。
11. 完成生产验收，给初始版本写 `.verified`，再复制 `deploy/production.yml.example` 至 `.github/workflows/production.yml`。
    配置完 Environment 及 main 分支限制后设置仓库 variable `PRODUCTION_DEPLOY_ENABLED=true`，
    先通过 main 手动运行并验收，后续 main push 自动发布。未准备好时保持不存在/false。
12. 仅在真实线上通过后替换 README 首页/案例链接，并将 GitHub About → Website 改为正式域名。
    保留 Pages 预览链接与原始 Git 历史。按实际适用要求办理公安联网备案，取得编号后再展示。

## 日常更新

Codex 分支修改 → PR 两种路径构建检查 → 人工浏览器验收 → 合并 main → 独立 Pages 与生产发布。
生产凭证只在 main 的 production Environment 内使用，不向 PR 暴露。发布只上传 dist，不上传源码或 node_modules。
公网 HTTPS 检查是发布结果的额外信号；若服务器本机健康但公网失败，检查 DNS/云防火墙，不以本机健康代替公网验收。

## 回滚

以部署用户连接服务器，查看真实的上一成功版本：

```sh
cd /srv/www/sites/portfolio
readlink current
readlink previous
cat deployments.log
previous_release=$(basename "$(readlink previous)")
previous_sha=${previous_release%%-*}
/usr/local/libexec/portfolio-release rollback "$previous_release" "$previous_sha"
```

回滚会再次验证哈希和真实 TLS 路由、原子切换，并将被替换的版本留作 previous。
失败自动恢复切换前指针。不删除任何版本。首次上线没有 previous 时只能恢复运维备份/已验证版本，不能虚构可回滚版本。
同时在 GitHub 把 `PRODUCTION_DEPLOY_ENABLED` 设为 false，避免待执行的 main 发布覆盖回滚；
修复代码并通过新 PR 后恢复为 true。需要长期撤回某次改动时，通过 revert PR 保留 Git 历史。
