// Five personal chapters. Copy is the approved V0.3 editorial baseline.
export const heroChapters = [
  {
    id: 'who', label: 'WHO I AM',
    lines: [
      { before: '总想试试，', accent: '', after: '' },
      { before: '事情', accent: '还能', after: '怎么做。' },
    ],
    description: '我关注 AI 产品、内容与增长，喜欢把零散的想法做成真实可用的作品，再看它们如何在反馈里继续生长。',
  },
  {
    id: 'care', label: 'WHAT I CARE ABOUT',
    lines: [
      { before: '我更在意，', accent: '', after: '' },
      { before: '人在哪一步', accent: '卡住', after: '。' },
    ],
    description: '比起技术本身，我更关心使用者会不会犹豫、会不会绕路、会不会在第一步就失去继续下去的兴趣。',
  },
  {
    id: 'believe', label: 'WHAT I BELIEVE IN',
    lines: [
      { before: '先把想法做出来，', accent: '', after: '' },
      { before: '再让', accent: '真实反馈', after: '说话。' },
    ],
    description: '我相信判断不该停留在脑子里。先做出可用的版本，再看真实使用发生了什么；有效的留下，不够好的继续调整。',
  },
  {
    id: 'build', label: 'WHAT I BUILD',
    lines: [
      { before: '把身边的问题，', accent: '', after: '' },
      { before: '慢慢做成', accent: '可用', after: '的东西。' },
    ],
    description: '从训练记录、内容创作到关系表达，我习惯从真实场景出发，把一个念头发展成可以被使用、被验证、被继续迭代的作品。',
  },
  {
    id: 'now', label: "WHAT I'M UP TO",
    lines: [
      { before: '最近在打磨', accent: '', after: '' },
      { before: '一套', accent: '内容增长', after: '系统。' },
    ],
    description: '它叫 AI Content Growth OS。我在把选题、创作、发布和复盘串起来，也在用自己的内容实践，持续验证这套工作流到底有没有用。',
  },
] as const

export type HeroChapterId = typeof heroChapters[number]['id']
