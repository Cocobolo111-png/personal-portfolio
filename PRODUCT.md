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

首页是当前唯一页面。2026-10-16 按用户 V0.2 阶段 A 指令，升级 Navbar、居中五标签 Hero 与共享视觉基础；Featured Work、轻页脚和集中管理的真实项目数据保留。Work / Play 分类、Story、简历弹窗及案例详情等待阶段 A 审核后再推进。能力、经历、其他项目和当前状态保留代码。

## Capabilities and Constraints

- React + Vite + TypeScript，组件化开发。
- PC 优先并提供移动端响应式。
- 当前不包含项目详情页、后端、数据库、博客、登录、搜索或联系表单。
- 项目、经历、能力、当前状态和资源链接集中在 `src/data/` 管理；项目视觉数据支持工作流、图片、图集与对照图。
- Hero 的五组文案与独立装饰槽位集中在 `src/data/hero.ts`。当前装饰为 CSS 几何形体，后续可替换透明图片或短视频；不提前引入模型运行时。
- 动画使用 React 状态、CSS 与 requestAnimationFrame。键盘切换、移动触摸及减少动态偏好必须保留。
- 未知数据隐藏或保持非交互状态，不编造项目结果、用户量、商业数据、经历或公司。

## Brand Commitments

- 姓名：何扬。
- 职业定位：AI Product · Operations · Growth。
- 2027 Graduate 可以轻量出现，但学生身份不是主叙事。
- 首页不讲本科专业、转行故事、从零学习 AI 或具体工具带来的个人逆袭。
- 文案克制、具体，优先让项目与结果说话。

## Evidence on Hand

- 当前核心项目为“AI 内容增长系统”，处于搭建阶段，必须明确标为 In Progress / Building / WIP。
- 真实项目截图、GitHub、完整 Workflow、产品逻辑与实际结果尚未提供，不得伪造。
- 其他核心项目、正式经历、邮箱、GitHub 和 Resume 链接尚未获得可靠材料；页面不展示虚构链接或空联系区。

## Product Principles

- 项目先于自我评价。
- 真实状态先于包装完整度。
- AI 服务于产品、运营与增长，而不是成为视觉噱头。
- 首页提供清晰招聘判断，不复制传统简历顺序。
- 架构应允许后续低成本补充真实项目与 Case Study。

## Accessibility & Inclusion

保持可读对比度、语义化标题顺序、键盘可访问、清晰焦点状态、减少动态偏好支持，并在常见桌面与移动视口下避免横向溢出。
