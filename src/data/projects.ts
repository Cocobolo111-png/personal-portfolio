import { siteUrl } from '../paths'

export type ProjectStatus = 'In Progress' | 'Building' | 'Coming Soon' | 'Published'

export type ProjectImage = {
  src: string
  alt: string
}

export type CaseImage = ProjectImage & { caption: string; width: number; height: number; portrait?: boolean }
export type CaseFeature = { label: string; title: string; description: string; image: CaseImage }
export type CaseVideo = { src: string; caption: string; poster?: string; portrait?: boolean }
export type ProjectCase = {
  displayTitle?: string
  introduction: string
  role: string
  period: string
  context: string
  maturity: string
  coverCaption: string
  question?: { lead: string; emphasis: string }
  experience: { title: string; description: string }
  evolutionHeading?: { title: string; description: string }
  outcomeHeading: { title: string; description: string }
  evidenceNote: string
  beginning: { title: string; paragraphs: string[]; image: CaseImage }
  walkthrough?: CaseVideo
  daily?: CaseFeature
  features?: CaseFeature[]
  evolution?: { label: string; title: string; description: string; image: CaseImage }[]
  comparison?: { before: CaseImage; after: CaseImage; note: string }
  proof?: { before: CaseImage; after: CaseImage; caption: string }
  narrative?: {
    title: string; description: string
    steps: { title: string; body: string; quote?: string }[]
    results: { label: string; value: string }[]
    resultNote: string
    datasets: { name: string; result: string; source: string; boundary: string }[]
    sources: string[]
  }
  aiAnalysis?: {
    title: string; description: string; image: CaseImage; video: CaseVideo
    notes: { title: string; description: string }[]; evidenceUrl: string
  }
  outcomes: { title: string; description: string }[]
  reflections: { title: string; description: string }[]
}

// Product pixels come from the existing Love-Journal-Portfolio package; new
// copies carry origin metadata. Captions distinguish history, demos and empty states.
const journalImage = (file: string, alt: string, caption: string, width = 1920, height = 1080): CaseImage => ({
  src: siteUrl(`/projects/love-journal/${file}`), alt, caption, width, height,
})

export type ShowcaseTag = string | {
  label: string
  side?: 'left' | 'right'
  row?: number
  rotation?: number
  expandedRotation?: number
}

export type ProjectVisual =
  | { kind: 'workflow'; label: string; steps: string[] }
  | { kind: 'image'; image: ProjectImage; ratio?: 'wide' | 'standard' | 'portrait' }
  | { kind: 'gallery'; images: ProjectImage[]; ratio?: 'wide' | 'standard' | 'portrait' }
  | { kind: 'comparison'; before: ProjectImage; after: ProjectImage; ratio?: 'wide' | 'standard' | 'portrait' }

export type Project = {
  slug: string
  title: string
  englishTitle: string
  category: string
  details: { label: string; value: string }[]
  status: ProjectStatus
  visual: ProjectVisual
  caseStudyUrl?: string
  caseStudy?: ProjectCase
  featured: boolean
  visible: boolean
  showcase?: {
    statement: string
    background: string
    tagBackground: string
    tagColor: string
    tags: ShowcaseTag[]
    ctaLabel: string
    demoUrl?: string
    portrait?: boolean
  }
}

const productImage = (project: string, file: string, alt: string, caption: string, portrait = false): CaseImage => ({
  src: siteUrl(`/projects/${project}/${file}`), alt, caption,
  width: portrait ? 780 : 1440, height: portrait ? 1688 : 1000, portrait,
})
const workbenchImage = (file: string, alt: string, caption: string) => productImage('ai-video-workbench', file, alt, caption)
const growthImage = (file: string, alt: string, caption: string) => productImage('ai-content-growth-os', file, alt, caption)
const trainingImage = (file: string, alt: string, caption: string) => productImage('traintrace', file, alt, caption, true)
const beadImage = (file: string, alt: string, caption: string) => productImage('panliangxia', file, alt, caption, true)

// Keep the original workbench case available at its existing URL.
const videoWorkbench = {
    slug: 'ai-video-workbench', caseStudyUrl: siteUrl('work/ai-video-workbench'),
    title: 'AI 视频生产工作台', englishTitle: 'AI VIDEO PRODUCTION WORKBENCH',
    category: '工作流设计 · 人机协作 · 本地 Web', status: 'Building', featured: true, visible: false,
    details: [{ label: 'My Role', value: '产品定义、流程设计、提示词策略、AI 协作开发与验收' }],
    visual: { kind: 'image', image: workbenchImage('00-cover-storyboard-desktop-1440.webp', '视频工作台的真实 AI 分镜界面', '真实本地工作台'), ratio: 'wide' },
    showcase: {
      statement: '把一份终稿，组织成可执行的视频制作流程。',
      background: '#dce3f0', tagBackground: '#526784', tagColor: '#ffffff',
      tags: ['Workflow Design', 'Human + AI', 'Storyboarding', 'Local Web'], ctaLabel: '查看案例',
    },
    caseStudy: {
      displayTitle: 'AI VIDEO\nWORKBENCH', introduction: '让制作的下一步，\n清楚地出现在同一个地方。',
      role: '产品定义 · 工作流设计 · 提示词策略 · AI 协作开发与测试', period: '2026.10',
      context: '内容生产 / 本地 Web 工作台', maturity: '本地开发中 · V0.1 · 自动剪辑尚未接通',
      coverCaption: '真实本地产品截图 · 2026-10-17 · 已保存的 Codex 分镜结果；声音方案不代表已有音频。',
      question: { lead: '有了文案之后，', emphasis: '怎样让每一步都可以接着做？' },
      experience: { title: '从文案到镜头，\n每一步都有明确的产物。', description: 'AI 规划画面，人确认表达与素材。\n推荐、文件和执行结果分别留痕。' },
      beginning: {
        title: '视频制作的难点，\n不只在剪辑器里。',
        paragraphs: ['我在制作口播和产品演示时发现，终稿、比例、出镜方式、分镜和素材容易散落在不同工具里。问题经常出现在交接：这条视频到底确认了什么，还缺什么？', '我把单条视频项目作为组织单位，让原稿、设定、镜头与素材任务放在同一条路径上。先把生产准备做清楚，再把实际剪辑交给已有编辑工具。'],
        image: workbenchImage('01-copy-desktop-1440.webp', '独立项目中的原始文案编辑页', '每条视频独立保存文案。截图中的口播表达属于原稿，不是工作台测量的业务指标。'),
      },
      daily: { label: '创作设定', title: '只确认这条视频，\n真正需要的设定。', description: '形式、画面比例、出镜方式和补充要求按项目保存。不确定的可选项交由 AI 推荐，不把上一条视频的设置默默带过来。', image: workbenchImage('02-direction-desktop-1440.webp', '工作台的创作设定表单', '真实界面 · 项目设定隔离已通过测试。') },
      features: [
        { label: '结构化分镜', title: '同一句口播，\n对应具体的画面任务。', description: '分镜把口播、视觉、屏幕文字和剪辑提示拆开，素材任务再关联到镜头。已有一次真实 Codex 生成记录，返回 25 个镜头与 9 项素材任务。', image: workbenchImage('00-cover-storyboard-desktop-1440.webp', '25 个镜头的真实分镜结果总览', '真实 Codex 输出 · 镜头时长为规划估计，尚不是剪辑时间码。') },
        { label: '人工编辑', title: '终稿已经审定，\nAI 就专心把它变成画面。', description: '我为生成器划定职责：口播只能逐字拆镜，拼接后必须保留原文。剪辑提示默认收起，人工可以展开修改；声音设计与真实音频文件分开处理。', image: workbenchImage('03-human-edit-desktop-1440.webp', '展开后的分镜剪辑提示编辑入口', '真实界面 · 展开查看剪辑提示；本次作品集整理没有改写原项目。') },
      ],
      outcomeHeading: { title: '先把制作准备做实，\n再谈自动交付。', description: '用接口、持久化与真实模型记录验证。\n按已验收范围描述当前产品。' },
      outcomes: [
        { title: '可保存与复用', description: '文案、独立设定、分镜和素材引用本地保存；上传、预览、Range 读取与重启恢复已有验收。' },
        { title: '真实 AI 分镜', description: '25 镜头、9 项任务来自既有真实生成。原文保护、输入隔离与模型信息解析有回归测试。' },
        { title: '素材确认机制', description: '声音选择、实际文件关联、关键素材确认、脚本过期检查与交接脚本已有源码和隔离测试。完整新流程仍需连续验收。' },
        { title: '清楚的执行边界', description: '工作台尚未直接驱动 ChatCut 剪辑或导出。页面中的开始剪辑和人工验收阶段不代表自动成片已经实现。' },
      ],
      reflections: [
        { title: '我的贡献', description: '我定义项目边界、拆解制作阶段、制定提示词约束，并通过真实输出和回归测试验收。AI 协助代码实现与排查。' },
        { title: '关键判断', description: '把 AI 建议、素材方案和真实文件分清楚。关键素材没有确认，就不把下一阶段描述为已经完成。' },
        { title: '下一步', description: '用一条真实视频连续验收素材确认、执行脚本和可编辑剪辑交付；当前没有同条件耗时对照，不宣称效率提升比例。' },
      ],
      evidenceNote: '依据：AI Content Studio 本地验收与分镜优化记录、server/agent.mjs、server/production.mjs。D.1 复跑原有 6 项测试与新增 1 项生产流程测试通过。截图为 2026-10-17 快照；本案例没有自动剪辑或增长成果主张。',
    },
  } satisfies Project

export const projects: Project[] = [
  {
    slug: 'traintrace', caseStudyUrl: siteUrl('work/traintrace'), title: 'TrainTrace · 训练有迹可循', englishTitle: 'TRAINTRACE',
    category: '真实训练场景 · 移动 PWA · 规则与 AI 反馈', status: 'Building', featured: true, visible: true,
    details: [{ label: 'My Role', value: '场景定义、记录与反馈规则、交互、AI 协作开发与验收' }],
    visual: { kind: 'image', image: trainingImage('00-cover-workout-synthetic-mobile-390.webp', 'TrainTrace 手机逐组训练界面，合成演示记录', '真实 App · 合成演示数据'), ratio: 'portrait' },
    showcase: { statement: '让下一次训练，接得上上一次的真实表现。', background: '#d5ddca', tagBackground: '#526448', tagColor: '#ffffff', tags: ['Product Thinking', 'Mobile PWA', 'Training Facts', 'AI Feedback'], ctaLabel: '查看案例', portrait: true },
    caseStudy: {
      displayTitle: 'TRAINTRACE', introduction: '每一次训练，\n都不该从零开始。', role: '场景定义 · 数据与反馈规则 · 移动交互 · AI 协作开发与验收', period: '2026.10',
      context: '真实训练场景 / 移动 PWA', maturity: '本地 V1.3 RC · 真实模型已接入 · 实体手机最终验收待完成',
      coverCaption: '原 App 的真实移动界面 · 隔离合成演示数据，非个人训练成绩。',
      question: { lead: '计划写得再完整，', emphasis: '它知道我上次实际练了什么吗？' },
      experience: { title: '先把每一组记清楚，\n再给下一次提供依据。', description: '计划和实际完成分开。\n历史比较只使用兼容的动作与计重口径。' },
      beginning: { title: '从自己的训练习惯，\n找到记录真正该做的事。', paragraphs: ['我需要的不是每次重新生成一份课表，而是在健身房快速记录重量与次数，并知道上次实际完成了什么。训练中的注意力有限，记录与休息不能互相打断。', '我把已完成组作为事实来源，再围绕它组织历史预填、断点继续与保守反馈。规则先给出可以解释的结论，模型再按需补充自然语言说明。'], image: trainingImage('01-onboarding-mobile-390.webp', 'TrainTrace 新手引导真实页面', '新手引导 · 当前 App 界面，不包含私人训练记录。') },
      daily: { label: '逐组记录', title: '正在做的这一组，\n是操作的中心。', description: '重量、次数和完成状态放在同一处。上次表现用于参考，计划值不会自动成为实绩；暂停、恢复与下一组预填支持现场连续使用。', image: trainingImage('00-cover-workout-synthetic-mobile-390.webp', '训练中的重量、次数和上次表现', '合成演示记录 · 只有确认完成的组进入训练统计。') },
      features: [
        { label: '历史依据', title: '先判断能不能比，\n再讨论有没有变化。', description: '动作、器械、变式、计重口径与单位需要兼容。没有历史就建立基准，不把不同器械、计划组或最高负重直接拼成进步结论。', image: trainingImage('02-history-synthetic-mobile-390.webp', 'TrainTrace 训练历史列表', '真实 App · 合成演示训练记录。') },
        { label: '本地反馈', title: '一句结论，\n一份依据，一条行动。', description: '本地规则可离线提供即时反馈。同重量多完成次数可以描述完成量变化，但单次数字上涨不直接等于绝对力量提升。', image: trainingImage('03-feedback-synthetic-mobile-390.webp', '基于可比历史的本地训练反馈', '真实规则计算 · 演示样本 24→26 次，不是模型伪造的结果。') },
        { label: '组间休息', title: '记录完就休息，\n准备好再继续。', description: '组间倒计时可以调整与跳过，训练计时支持暂停。回到前台依据时间戳恢复，避免补响迟到提示；声音和震动仍需实体设备确认。', image: trainingImage('04-rest-synthetic-mobile-390.webp', 'TrainTrace 组间休息倒计时', '原 App 操作截图 · 合成数据；不等于真机声音与震动验收。') },
      ],
      aiAnalysis: {
        title: 'AI-Powered\nTraining Analysis',
        description: '我让 AI 解释已经确认的训练事实，而不是再生成一套课表。2026-10-18，通过原 App 主动请求 DeepSeek；结果在真实页面中展示，录屏保留了点击、加载和返回过程。',
        image: trainingImage('ai-demo-result.webp', 'TrainTrace 原 App 展示新一次真实 DeepSeek 分析', '真实 DeepSeek 模型响应 + 明确的合成演示训练数据。完整样本：60 kg、3 组，24→26 次。'),
        video: { src: siteUrl('projects/traintrace/traintrace-ai-walkthrough.mp4'), poster: siteUrl('projects/traintrace/ai-demo-result.webp'), portrait: true, caption: '34.4 秒 · 390×844 真实浏览器操作 · 无音轨 · 合成训练数据，真实模型调用。手动播放，可暂停。' },
        notes: [
          { title: '本地规则负责事实与行动', description: '统计、可比历史与下一条优先行动由规则计算，可离线使用。模型返回的 nextAction 会被服务端约束为原有规则行动。' },
          { title: 'DeepSeek 负责解释变化', description: '本次真实返回正确指出：60 kg 下多完成 2 次是容量变化；单次完成量增加不等于最大力量或肌肉已经增长。页面显示“暂不加重，先稳定重复本次表现”。' },
          { title: '一次可核对的新调用', description: 'deepseek-flash · HTTP 200 · 1,495 ms · 3,472 Tokens。仅 1 次请求；这是一条演示样本的调用结果，不是服务速度保证或训练效果证明。' },
        ],
        evidenceUrl: siteUrl('projects/traintrace/ai-call-evidence.json'),
      },
      outcomeHeading: { title: '可用的训练记录，\n加上有边界的 AI 解释。', description: '产品核心是持续保存训练事实。\nAI 分析按需开启，不取代记录。' },
      outcomes: [
        { title: '记录闭环', description: '训练偏好、计划、逐组记录、历史、备份与恢复已有实现。D.1 复跑 84 项测试通过，既有记录含 26 条浏览器验收。' },
        { title: '真实 AI 路径', description: '本轮在隔离浏览器发起新一次官方模型调用，检查了接口、页面与可播放录屏。没有 Mock 或静态 HTML 冒充 App。' },
        { title: '数据边界', description: '仅把脱离私人档案的合成样本用于公开演示。密钥留在已有服务端环境，没有进入前端、截图、视频或本案例资料。' },
        { title: '仍是 RC', description: '本地功能与模型路径可用，不等于 V1.3 稳定版已发布。实体手机安装、键盘、长后台与存储回收仍待最终验收。' },
      ],
      reflections: [
        { title: '我的贡献', description: '我从训练习惯提出场景需求，定义完成事实、比较口径和保守行动，推进移动交互与 AI 协作开发，再用测试和真实调用核对。' },
        { title: '关键取舍', description: '让规则提供可信的短反馈，模型解释按需展开。把“这次完成更多”和“长期能力提高”分开表达。' },
        { title: '下一步', description: '完成真实手机连续训练验收，核对数字输入、后台恢复和休息听感，再冻结稳定版。当前不宣称用户留存或训练效果提升。' },
      ],
      evidenceNote: 'D.1 截图摄于 2026-10-17；真实 AI 演示执行于 2026-10-18（北京时间）。本轮从当前产品源码构建至临时目录，复用已有 App、缓存与代理，未改产品功能。静态作品集播放录像，不在 GitHub Pages 上调用私有 AI 服务。',
    },
  },
  videoWorkbench,
  {
    slug: 'ai-content-growth-os', caseStudyUrl: siteUrl('work/ai-content-growth-os'),
    title: 'AI Content Growth System', englishTitle: 'AI CONTENT GROWTH SYSTEM',
    category: '内容策略 · 视频生产 · 增长复盘', status: 'In Progress', featured: true, visible: true,
    details: [{ label: 'My Role', value: '内容策略、生产流程、评估方法、AI 协作开发与验收' }],
    visual: videoWorkbench.visual,
    showcase: { statement: '从内容判断到视频生产，留下每一步的依据。', background: '#e2e2d7', tagBackground: '#686b51', tagColor: '#ffffff', tags: ['Content Strategy', 'Video Workflow', 'Human + AI', 'Growth Review'], ctaLabel: '查看案例' },
    caseStudy: {
      displayTitle: 'CONTENT\nGROWTH SYSTEM', introduction: '从判断做什么，到组织怎么做，\n再回看实际发生了什么。',
      role: '内容策略 · 视频生产流程 · 评估与复盘 · AI 协作开发', period: '2026.08—10',
      context: '内容策略与生产 / CLI + Skill + 本地 Web', maturity: '两套工具分别运行 · 自动剪辑未接通 · 前瞻增长实验待验证',
      coverCaption: videoWorkbench.caseStudy.coverCaption,
      question: { lead: '当 AI 说这条内容不错，', emphasis: '我用什么证据决定是否相信？' },
      experience: { title: '判断、制作、复盘，\n各自留下明确的产物。', description: 'Growth OS 保留版本与人工决策。\n视频工作台组织分镜、素材与制作交接。' },
      beginning: {
        title: '做过内容之后，\n我更想知道判断哪里出了错。',
        paragraphs: ['实际运营中，相近的内容分数可能对应完全不同的播放和收藏。只留下最终成片与一个总分，很难知道下次应该改什么。', '我先在 Cheat on Content 中记录稿件、人工改写、AI 评分、预测与复盘，再把这些经验整理为 Growth OS：保存版本、区分诊断与预测、记录采纳或拒绝，并用统一窗口验证。两套记录的评分标准与实绩分别呈现。', '制作环节则由 AI 视频生产工作台承接：按单条视频保存终稿与设定，把口播拆成分镜和素材任务。本案例将两部分合并展示为 AI Content Growth System；它们仍是分别运行的工具，不代表已经打通自动生产或增长闭环。'],
        image: growthImage('01-version-comparison-document-1440.webp', 'Growth OS 测试稿的版本诊断与历史数据说明', '既有测试报告 · v1→v2 是稿件诊断变化，不是发布效果提升。'),
      },
      daily: { label: '七维诊断', title: '分数之后，\n必须能说清具体改哪里。', description: '当前 Growth OS 用选题、钩子、痛点、新鲜度、实用价值、讨论和经历七个维度，逐项保留原句证据、扣分原因与建议。总分只做内容诊断，不映射成播放保证。', image: growthImage('00-cover-seven-dimensions-document-1440.webp', '七维诊断的原句证据与修改建议', 'Growth OS：TP / HP / PV / NV / UV / DP / IP。与下方历史 Cheat v0 评分不混用。') },
      features: [
        { label: '版本留存', title: '改了哪一版，\n就评估哪一版。', description: '保存全文、版本号和哈希；改稿以后形成新版本，旧诊断不覆盖。已有测试样本保留了 v1 1.7143 与 v2 6.5714 的诊断，不能据此声称增长提升。', image: growthImage('01-version-comparison-document-1440.webp', '版本迭代报告', '既有 Codex 测试样本；不是发布前后效果对照。') },
        { label: '人工决策', title: 'AI 给出建议，\n采纳与否由人留下理由。', description: '先冻结标题、封面、时间、标签和首评的原方案，再围绕一个主变量记录建议。采纳、部分采纳、否决与实际执行分别保存，避免事后补写成功故事。', image: growthImage('02-frozen-decision-demo-document-1440.webp', '冻结建议与人工决策报告', 'CLI 的 DEMO 合成实验记录；演示软件行为，不代表真实增长。') },
        videoWorkbench.caseStudy.features[0],
        { ...videoWorkbench.caseStudy.features[1], title: '终稿已定，\n再把它变成画面。' },
      ],
      narrative: {
        title: '真实案例：\n让 AI 反过来问你。',
        description: '2026 年 9 月的一条抖音内容。从两段提示词的长稿，收敛到一个可复制的方法。以下过程来自历史记录整理，不是后来用 Growth OS 补造的前瞻实验。',
        steps: [
          { title: '原始内容：一个视频承载两个方法', body: '既有长稿同时讲“让 AI 了解你”和“允许 AI 反驳你”，原稿标注约 1000 字、预计 3.5–4 分钟。这是写作阶段估计，不是已拍成片。', quote: '先让它了解真实的你，再允许它反驳你。' },
          { title: '人工改写：保留一条主线', body: '最终稿与预测日志明确记录：拆开两段提示词，只保留“让 AI 反过来提问”。用户确认正文，加入逐个追问、模糊时追问、确认后再给建议的执行约束。旧稿到终稿的逐次编辑时间未完整留存，因此只展示有证据的收敛决定。', quote: '一次只问我一个最关键的问题。如果我的回答比较模糊，请继续追问，不要自行猜测。' },
          { title: '发布前评估：保留乐观判断，也保留风险', body: '2026-09-01 的 Cheat on Content v0 记录为 7.14 / 10，主桶 1000–10000、中枢约 1800。它看好可复制价值，也记录了提示词较长、缺少现场对比的风险。评分文件包含 non_blind_warning，置信度低；不是严格无污染盲评。' },
          { title: '发布与人工选择：留下发生过的事实', body: '内容于 2026-09-02 00:20 发布，真实成片 83 秒。系统保留用户最终改写要点；没有完整的拍摄稿一致性确认，也没有 Growth OS 单变量采纳表，不把这些缺口补写成历史事实。' },
          { title: '复盘：桶命中，不等于预测准确', body: '2026-09-07 19:22 回收时，播放 6285、收藏 63，落入主桶，但明显高于中枢。原先按字数估计的 120–150 秒也与真实 83 秒不同。我把“可复制收益是否前置”和“使用实际时长”记为后续验证方向；单条数据不能证明改稿带来增长。' },
        ],
        results: [{ label: '平台与发布时间', value: '抖音 · 2026-09-02 00:20' }, { label: '回收窗口', value: '2026-09-07 19:22 · 发布后约 5 天 19 小时' }, { label: '播放 / 点赞', value: '6,285 / 81' }, { label: '收藏 / 分享', value: '63 / 3' }, { label: '收藏率 / 成片时长', value: '1.00% / 83 秒' }, { label: '评论', value: '1 条，身份未确认；不作可靠受众聚类' }],
        resultNote: '来源为既有 douyin-session 回收报告与预测日志，本轮没有重新登录平台抓取。这是历史账号内容结果，不能归因于 10 月开发的 Growth OS。',
        datasets: [
          { name: '快手 AI 知识口播', result: '11 条 · 20,969 播放 · 133 赞 · 10 收藏', source: '用户作品导出表，A1:H12；本轮直接从原始 Excel 复算。', boundary: '指标截止时间未知，分享缺失；72h 可比样本为 0。仅作历史描述。' },
          { name: 'Cheat on Content', result: '4 条校准记录 · rubric v0', source: '.cheat-state.json、4 篇正式复盘和 rubric-memo.md。', boundary: '历史七维为 ER / HP / QL / NA / AB / SR / SAT。窗口、题材和置信度有限，不与 Growth OS 七维分数合并。' },
          { name: 'Growth OS 工具', result: '56 项 CLI + 16 项便携脚本测试通过', source: 'D.1 本机复跑；CLI 状态机、冻结、证据校验和评分计算。', boundary: '真实 workspace 的实验仍为空，采纳率与命中率为 null。豆包实际运行未验收。' },
          { name: 'Growth OS 前瞻实证', result: '尚无完成的真实增长实验', source: '现有 workspace 状态与验收记录。', boundary: '没有用历史成绩反推事前建议，也没有声称工具带来增长。' },
        ],
        sources: ['历史原稿：scripts/2026-09-01_1432c8287cf6_两个提示词把AI变成陪练.md。终稿：scripts/2026-09-01_30692b977e0a_让AI反过来问你.md。', '预测与复盘：predictions/2026-09-01_30692b977e0a_让AI反过来问你.md；发布数据：对应 videos/ 目录的 report.md。仅公开必要摘录，不公开完整工作区。', '快手汇总：kuaishou-export-20261015.xlsx，原始区域 A1:H12。原表与含账号信息的工作表名保持私有。', '“32 条、72,334 播放”暂未找到原始数据来源，本页不将它列为已核实成绩。受众画像文件仍为骨架，不声称已有完整用户画像。'],
      },
      outcomeHeading: { title: '从一次内容判断，\n走向可复用的工作方法。', description: '实绩、分析、工具和前瞻验证，\n分别交代来源与边界。' },
      outcomes: [
        { title: '真实内容实践', description: '有原稿、人工收敛决定、发布前评估、真实发布与回收数据。历史不是事后重建的成功预测。' },
        { title: '把失准留下来', description: '既记录桶命中，也记录中枢偏差、时长估计错误与不确定因素。当前样本不足以可靠重校权重。' },
        { title: '内容与生产工具', description: 'Growth OS 的 CLI / Skill 保存判断与证据；本地视频工作台保存终稿、独立设定、分镜与素材引用。两套工具分别运行。' },
        { title: '下一次如何验证', description: '真实未发布稿先冻结，只测试一项包装变量，保留人工决策，再回收同账号、同窗口数据。这个前瞻闭环尚待发生。' },
      ],
      reflections: [
        { title: '我的贡献', description: '我做选题与文案取舍，记录 AI 判断和实绩偏差，再把重复动作整理为评分、版本和实验流程。AI 协助分析与代码实现。' },
        { title: '关键判断', description: '相近分数不能替代真实内容判断。把“文本可复制”与“观众何时看到价值”分开观察，才有可检验的下一步。' },
        { title: '验证边界', description: '历史账号表现证明内容实践已经发生；工具测试证明记录机制可运行。它们都不能单独证明 Growth OS 带来增长。' },
      ],
      evidenceNote: '本页合并展示 Growth OS 与 AI 视频生产工作台，沿用各自已有内容和真实截图，不代表两个产品已合并或自动联通。工作台来源：AI Content Studio 本地验收、server/agent.mjs、server/production.mjs；2026-10-17 截图与既有 25 镜头 / 9 项素材任务记录不作自动剪辑主张。本页为作品集中的证据整理，非实际系统看板。历史数据、Cheat v0、Growth OS 七维和 DEMO 均分别标注。来源核对与 Excel 复算于 2026-10-18 完成，原稿、预测、账号文件和原始表未改动。',
    },
  },
  {
    slug: 'panliangxia', caseStudyUrl: siteUrl('work/panliangxia'), title: '盘两下', englishTitle: 'PAN LIANG XIA',
    category: '移动沉浸体验 · 3D 交互 · 独立产品实践', status: 'Building', featured: true, visible: false,
    details: [{ label: 'My Role', value: '产品概念、触摸反馈、视觉方向、AI 协作开发与验收' }],
    visual: { kind: 'image', image: beadImage('00-cover-wood-mobile-390.webp', '盘两下小叶紫檀真实 H5 主页', '真实 H5 界面'), ratio: 'portrait' },
    showcase: { statement: '围绕一个小动作，做完整的沉浸体验。', background: '#e8deca', tagBackground: '#86684b', tagColor: '#ffffff', tags: ['Interaction Design', 'Mobile Web', '3D Experience', 'Local-first'], ctaLabel: '查看案例', portrait: true },
    caseStudy: {
      displayTitle: 'PAN\nLIANG XIA', introduction: '随手盘两下，\n慢慢养出自己的光泽。', role: '产品概念 · 触摸与反馈体验 · 视觉方向 · AI 协作开发与验收', period: '2026.09—10',
      context: '移动沉浸体验 / 3D H5', maturity: '可运行的本地 H5 · 三款核心手串 · 公开部署状态未复核',
      coverCaption: '正式 dist H5 的真实界面 · 390×844 手机视口 · 新浏览器默认存档，不含个人资料。',
      question: { lead: '不靠更多功能，', emphasis: '一个动作能不能让人愿意多停留一会？' },
      experience: { title: '盘珠、声音与场景，\n围绕同一个动作发生。', description: '先把手感与反馈做好。\n品类和养成承接持续体验。' },
      beginning: { title: '把碎片休息，\n变成一个可以随手开始的动作。', paragraphs: ['我把触摸盘珠作为产品的中心：不先填写资料，也不进入复杂任务。打开就能拨动手串，看到运动、计数和轻微反馈。', '我希望它在手机上形成一种轻量的停留体验。这个方向是产品假设，目前没有用户研究证明减压效果，也不把个人感受写成市场验证。'], image: beadImage('00-cover-wood-mobile-390.webp', '小叶紫檀盘玩主页', '真实 H5 · 默认纯净模式。') },
      daily: { label: '选串交互', title: '不同的材质，\n也有不同的性格。', description: '小叶紫檀、星月菩提和金刚菩提是当前三款核心 3D 手串。选择后回到盘玩主页，计数和包浆分别留在每一串自己的存档中。', image: beadImage('01-picker-mobile-390.webp', '盘两下手串选择界面', '三款核心 3D 产品已实现；其他配置中的广告品类不能视为同等完成度。') },
      features: [
        { label: '场景', title: '换一种氛围，\n不打断手上的节奏。', description: '纯净模式之外提供素案、书房、茶席、窗边、榻边和庭院六个场景。背景层不接管盘珠手势，切换时等待图片加载完成。', image: beadImage('02-scenes-mobile-390.webp', '纯净模式和六个水墨场景选择', '真实产品场景面板 · 图像是既有场景素材，不是用户照片。') },
        { label: '材质与氛围', title: '让画面变化，\n服务于同一种盘玩体验。', description: '珠子的运动、碰撞音与环境音协同工作；不支持震动时静默降级。声音的真实听感和设备差异仍需手机验收。', image: beadImage('03-moon-study-mobile-390.webp', '书房场景中的星月菩提', '真实运行画面 · 星月菩提与书房场景。') },
        { label: '持续进度', title: '每一串，\n保留自己的过程。', description: '今日计数、累计盘玩与包浆由本地存档管理。进度来自实际盘珠事件，刷新可以恢复；当前没有账号或跨设备同步。', image: beadImage('04-patina-mobile-390.webp', '盘两下包浆等级与进度面板', '真实 UI 默认状态；不人为填入高等级或用户成绩。') },
      ],
      outcomeHeading: { title: '一个动作，\n做成一个可运行的产品。', description: '触摸、运动、反馈和保存相互衔接。\n不把占位入口写成已实现服务。' },
      outcomes: [
        { title: '三个核心品类', description: '三款 3D 手串具有不同材质与几何；选串与主盘玩场景已经接通。' },
        { title: '反馈与存档', description: '盘珠运动、计数、包浆、碰撞音、环境音与设备支持时的震动已有实现；每款独立存档。' },
        { title: '47 项测试', description: 'D.1 复跑覆盖手势方向、计数边界、材质复用、场景切换、声音与存档。浏览器检查不等于物理震动验收。' },
        { title: '服务边界', description: '广告解锁与递串仍有占位行为，没有真实广告 SDK、好友分享、账号、付费或云端同步。' },
      ],
      reflections: [
        { title: '我的贡献', description: '我定义核心动作与氛围方向，围绕触摸反馈提出修改要求，借助 AI 完成实现与排查，再用测试和手机比例页面验收。' },
        { title: '关键判断', description: '先保持盘玩体验的连续性，让场景与养成辅助核心动作。没有为了展示完整度加入未经验证的社交和商业化叙事。' },
        { title: '下一步', description: '验证真实设备的手感、声音与长时间性能；没有减压、留存或付费数据时，先用运行结果证明交互实现。' },
      ],
      evidenceNote: '素材来自正式 dist H5，摄于 2026-10-17。独立 V2.1 视觉示意图没有当作产品截图使用；独立材质实验和微信小程序上传记录也未冒充本 H5 的公开发布结果。',
    },
  },
  {
    slug: 'love-journal',
    caseStudyUrl: siteUrl('work/love-journal'),
    title: '予你 · Love Journal',
    englishTitle: 'LOVE JOURNAL',
    category: '个人产品实践 · 产品定义 · AI 协作 · 本地优先 Web',
    details: [
      { label: 'Problem', value: '让日常、纪念日、心愿与影像既能被记录，也值得再次走进。' },
      { label: 'My Role', value: '产品定义、体验判断、视觉方向与 AI 协作推进。' },
    ],
    status: 'Building',
    visual: {
      kind: 'image',
      image: {
        src: siteUrl('projects/love-journal/hero.jpg'),
        alt: '予你 Love Journal 的真实网页界面：暖色植物入口、黄昏远景与 Step Into Our World 标题；隔离环境默认空状态，无私人资料。',
      },
      ratio: 'wide',
    },
    showcase: {
      statement: '把日常记录，变成愿意再次走进的私人记忆空间。',
      background: '#b4b098',
      tagBackground: '#77735c',
      tagColor: '#ffffff',
      tags: ['Product Design', 'AI 协作', 'Web App', 'Local-first'],
      ctaLabel: '界面预览',
    },
    caseStudy: {
      introduction: '把两个人的日常，\n留成一个值得重访的世界。',
      role: '产品定义 · 体验判断 · 视觉方向 · AI 协作推进',
      period: '2026.09—10',
      context: '情感化体验 / 本地优先 Web',
      maturity: '可运行的本地产品 · 非公开运营服务',
      coverCaption: '当前产品的真实界面 · 隔离环境默认空状态 · 植物场景为既有 AI 图像',
      question: { lead: '能记下来之后，', emphasis: '为什么愿意回来？' },
      experience: { title: '先进入一个世界，\n再走进日常。', description: '用植物入口与黄昏光线建立情绪，\n让每一类记忆都有自己的位置。' },
      evolutionHeading: { title: '不是换一张图，\n是重新判断它该带来什么感受。', description: '从功能齐全，到情绪合适。\n每一轮修改，都有一个具体的问题。' },
      outcomeHeading: { title: '做出来，\n还要能真正用起来。', description: '把一个生活想法推进为\n能记录、保存、完成互动的本地产品。' },
      evidenceNote: '本案例依据已有项目资料与 2026-10-15 的截图 / 验证记录整理。没有用户增长或商业化指标，不将个人使用体验写成市场验证；本轮也未重新验收生产部署。',
      beginning: {
        title: '最开始，只想把\n我们的日常放在一起。',
        paragraphs: [
          '日常、照片、纪念日，还有没实现的愿望。我希望这些零碎不再散落，而是被放进一个属于两个人的小世界。',
          '先让记录、浏览、修改和保存形成闭环。等它真正能用了，再问自己：除了能记下来，什么会让人愿意回来看看？',
        ],
        image: journalImage('final-navigation.png', 'Love Journal 的四个章节入口：日常、相册、纪念日和心愿', '四个主入口，把不同时间尺度的记忆放在一起。当前产品截图，默认状态。', 1920, 1574),
      },
      walkthrough: {
        src: siteUrl('projects/love-journal/portal-walkthrough.webm'),
        caption: '入口穿越 · 2026-10-15 隔离浏览器实录，无音轨；不是历史版本录像。',
      },
      daily: {
        label: '日常记录', title: '普通的今天，\n也值得被记住。',
        description: '让日期、文字和影像成为记录的主角。日常可以编辑、配图、按月回看，照片与视频也能一起保存。',
        image: journalImage('final-diary-demo.png', 'Love Journal 日常记录页面，显示一起散步的合成演示记录', '日常记录 · 隔离环境中的合成演示数据，非真实用户日记。'),
      },
      features: [
        {
          label: '纪念日', title: '记住过去，\n也期待下一次。',
          description: '把等待变得具体。纪念日支持倒计时与每年重复，也考虑了闰日这样的边界。',
          image: journalImage('final-anniversary-demo.png', 'Love Journal 纪念日页面，显示演示纪念日倒计时', '纪念日 · 日期与记录为合成演示数据。'),
        },
        {
          label: '心愿清单', title: '一起把以后，\n慢慢变成现在。',
          description: '愿望可以被写下、完成，也能撤销完成。共同期待不只留在对话里，还能有一个持续更新的位置。',
          image: journalImage('final-wishes-demo.png', 'Love Journal 心愿清单页面，显示一起看日落的演示心愿', '心愿清单 · 合成演示记录，非真实私人愿望。'),
        },
        {
          label: '相册', title: '给每一段影像，\n留一个位置。',
          description: '日常中的照片与视频会进入相册，也能放大查看。这里保留产品的真实空状态，没有导入私人照片。',
          image: journalImage('final-gallery-empty.png', 'Love Journal 相册的真实空状态，没有私人照片', '相册 · 真实 UI 空状态，未导入私人照片。'),
        },
      ],
      evolution: [
        {
          label: '浅色手账', title: '先把生活，\n装进一个地方。',
          description: '浅色手账已经能清楚地组织记录，却更像一份电子工具。功能逐渐完整之后，我开始寻找一种更愿意停留的体验。',
          image: journalImage('early-journal-rebuilt.png', '从真实历史代码重建运行的浅色手账首页', '浅色手账 · 2026-10-15 根据真实历史代码重建，不是当时拍摄的截图。'),
        },
        {
          label: '沉浸入口', title: '让首页，\n成为一个可以进入的世界。',
          description: '植物前景、洞口与远景建立了纵深。我选择先营造进入空间的感受，再用章节入口承接具体内容。',
          image: journalImage('portal-original.jpg', 'Love Journal 既有植物入口原图，洞口通向黄昏远景', '沉浸入口 · 既有 AI 场景素材；不是生活照片。', 1672, 941),
        },
        {
          label: '冷暗反思', title: '沉浸，\n不等于亲密。',
          description: '画面有空间感，但暗部偏冷、植物带着枯枝感，与亲密关系的柔软氛围有距离。问题不在结构，而在情绪。',
          image: journalImage('portal-original.jpg', '用于说明冷暗氛围问题的同一份植物入口原图', '复用同一份既有原图说明冷暗问题，没有补造一个新的设计版本。', 1672, 941),
        },
        {
          label: '暖色调整', title: '同一个入口，\n换一种温度。',
          description: '参考《小妇人》的暖色氛围，保留已经成立的构图，让光线、色彩和植物暗部更柔和。用范围明确的调整，让体验更接近关系本身。',
          image: journalImage('portal-warm.jpg', 'Love Journal 调暖后的既有植物场景原图', '暖色版本 · 既有 AI 场景素材。', 1672, 941),
        },
      ],
      comparison: {
        before: journalImage('portal-original.jpg', '调色前的既有植物入口场景', '原版', 1672, 941),
        after: journalImage('portal-warm.jpg', '调色后的既有暖色植物入口场景', '暖版', 1672, 941),
        note: '拖动分界线查看两份既有原图。构图接近，暖色变化较细；不是重新制作的夸张对比。',
      },
      proof: {
        before: journalImage('coupon-before-demo.png', '演示电影券兑换前剩余三张的实际界面', '兑换之前 · 3 张', 1440, 1000),
        after: journalImage('coupon-after-demo.png', '同一张演示电影券兑换后剩余两张的实际界面', '确认兑换后 · 2 张', 1440, 1000),
        caption: '一次可以看见的状态变化：详情 → 确认 → 3 张变 2 张，刷新后仍保留。2026-10-15 隔离浏览器验证，电影券为合成演示内容。',
      },
      outcomes: [
        { title: '能持续记录', description: '日常、相册、纪念日、心愿与打卡已经形成可运行的本地体验。' },
        { title: '能完成互动', description: '爱情券补齐详情、确认、数量扣减和编辑，声音反馈跟随实际操作。' },
        { title: '能保存与备份', description: '主手账本地持久化，支持 JSON 导入导出；小确幸的独立备份仍待补齐。' },
        { title: '有明确交付边界', description: '有私有预览部署记录与独立的开源演示副本；本案例不把它描述为已公开运营的线上服务。' },
      ],
      reflections: [
        { title: '我的实际贡献', description: '定义需求，收敛视觉方向，把体验中的问题变成明确的修改要求，并持续验收。AI 协助代码实现、素材生成与排查。' },
        { title: '关键取舍', description: '先把本地记录与互动做完整，暂缓账号和云同步；保留已成立的结构，让复杂度服务于体验。' },
        { title: '下一步', description: '先补齐小确幸备份，再明确跨设备需求。视频兼容性、动效与声音还需要真实设备专项验证。' },
      ],
    },
    featured: true,
    visible: false,
  },
]

export const visibleProjects = projects.filter((project) => project.visible)
