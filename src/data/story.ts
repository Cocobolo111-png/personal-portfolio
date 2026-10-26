// Story V1.1 — concise copy confirmed by He Yang on 2026-10-26.
// Keep this wording intact; the three-act layout lives in StoryPage.tsx.
const titleLines = ['一个不太', '安分的', '普通人。'] as const

export const story = {
  title: titleLines.join(''),
  titleLines,
  subtitle: 'An unfinished story.',
  opening: [
    '何扬喜欢两种看起来不太搭的生活。',
    '一种很慢，一种很快。',
  ],
  openingQuote: '想把日子过慢一点，却又迫不及待地想看看世界会变成什么样。',
  chapters: [
    {
      id: 'quiet', title: 'THE QUIET SIDE',
      lead: '慢一点，也挺好。',
      paragraphs: [
        '写写字、骑骑车，认真完成一次训练。',
        '曾经很向往陶渊明笔下的生活。做些自己喜欢的事，不必事事都有结果。',
      ],
    },
    {
      id: 'restless', title: 'THE RESTLESS SIDE',
      lead: '但世界还在不断向前。',
      paragraphs: [
        '从飞机第一次升空，到人类踏上月球，再到新技术让普通人拥有过去难以想象的创造能力。',
        '这些事情总能让他兴奋很久。',
        '今天那些看似不可能的事情，未来又会变成什么样？',
      ],
    },
    {
      id: 'making', title: 'STILL MAKING THINGS',
      lead: '有些麻烦，确实是自己找的。',
      paragraphs: [
        '一个小小的想法，可能因为一句「好像还能更好一点」，就被反复折腾好几轮。',
        '不过，他喜欢看着脑海里的东西一点点变成现实。',
        '至于以后会成为怎样的人，还没有标准答案。',
        '希望能照顾好在意的人，也一直保留对世界的好奇。',
      ],
    },
  ],
  ending: '故事才刚写了几页。',
  signoff: 'Still curious. Still making things.',
  signature: '— He Yang',
} as const
