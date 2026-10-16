# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

主要用户是正在筛选 AI 产品、AI 产品运营、AI 运营、AI 用户增长、AI Growth 与 AI 应用岗位候选人的招聘方和业务负责人。他们需要在短时间内判断何扬的方向、项目判断、执行能力与成长潜力。

## Product Purpose

这是一个面向求职场景的个人作品集网站。它通过项目、经历、数据、结果与作品逐步呈现 AI × 产品 × 运营 × 增长能力，而不是复述简历或堆叠自我评价。

## Positioning

作品集把 AI 作为产品与增长工作的底层能力，重点展示如何理解用户、组织内容和工作流、推进项目并形成可验证的结果。

## Operating Context

首页是当前唯一页面。阶段 A 已验收的黑白蓝 Navbar、五标签 Hero 与既有轻页脚保留。2026-10-17 的阶段 B / B.1 只完善一个真实 Love Journal 展示：参考 Sanvi 的实际 Playwright 行为采样，修复初始 hash / 历史定位、渐进雾化、Hover 展开与标签扩展。Play、Story、简历弹窗及案例详情尚未进入开发。作品集与 TrainTrace 是独立产品，不共享其视觉规范。

## Capabilities and Constraints

- React + Vite + TypeScript，组件化开发。
- PC 优先并提供移动端响应式。
- 当前不包含项目详情页、后端、数据库、博客、登录、搜索或联系表单。
- 项目、经历、能力、当前状态和资源链接集中在 `src/data/` 管理；项目视觉数据支持工作流、图片、图集与对照图。
- Hero 的五组文案与独立装饰槽位集中在 `src/data/hero.ts`。当前桌面使用已验收的蓝色折纸图片及各章节既有 SVG / 媒体构图，不回退到旧的通用三几何形体方案；不提前引入模型运行时。
- Work 继续使用 `src/data/projects.ts`。标签支持纯文字和可选的左右列、行号、旋转配置；增加标签不重复四个固定位置。真实 demoUrl 未配置时只展示非交互预览标识。
- 桌面视觉以已验收 Hero 代码和当前 `DESIGN.md` 为准。旧 root tokens 中的绿色 / sage 仅作为既有小屏及未修改区域兼容值，不是桌面重设计要求。
- 动画使用 React 状态、CSS 与 requestAnimationFrame。键盘切换、移动触摸及减少动态偏好必须保留。
- 未知数据隐藏或保持非交互状态，不编造项目结果、用户量、商业数据、经历或公司。

## Brand Commitments

- 姓名：何扬。
- 职业定位：AI Product · Operations · Growth。
- 2027 Graduate 可以轻量出现，但学生身份不是主叙事。
- 首页不讲本科专业、转行故事、从零学习 AI 或具体工具带来的个人逆袭。
- 文案克制、具体，优先让项目与结果说话。

## Evidence on Hand

- “AI 内容增长系统”数据保留，处于 In Progress；阶段 B 暂不渲染它，首页只展示 Love Journal。
- Love Journal 的真实截图及产品定义、体验判断、视觉方向和 AI 协作贡献来自既有作品集案例包。封面为 2026-10-15 隔离环境中的实际网页截图，默认空状态，无私人资料；植物场景为既有 AI 图像，非生活照片。展示图仅作 JPEG 压缩，不重绘界面。
- 未确认 Love Journal 的公开演示地址，蓝色“界面预览”胶囊是非交互视觉标识。只有项目数据配置真实 demoUrl 时才渲染链接；不创建详情页。
- 其他核心项目、正式经历、邮箱、GitHub 和 Resume 链接尚未获得可靠材料；页面不展示虚构链接或空联系区。

## Product Principles

- 项目先于自我评价。
- 真实状态先于包装完整度。
- AI 服务于产品、运营与增长，而不是成为视觉噱头。
- 首页提供清晰招聘判断，不复制传统简历顺序。
- 架构应允许后续低成本补充真实项目与 Case Study。

## Accessibility & Inclusion

保持可读对比度、语义化标题顺序、键盘可访问、清晰焦点状态、减少动态偏好支持，并在常见桌面与移动视口下避免横向溢出。
