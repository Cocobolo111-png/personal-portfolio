export type Outcome = 'win' | 'loss';
export type Match = { id: string; outcome: Outcome | null; confidence?: number };
export const MAX_MATCHES = 20;
export const RULES = { lossRateWeight: 60, recentLossWeight: 20, lossStreakWeight: 5, winStreakWeight: 4, streakCap: 4, restScore: 70, steadyScore: 45, restLossStreak: 3 } as const;

/** All inputs are newest first. Never call with unconfirmed / unknown rows. */
export function analyze(outcomes: readonly Outcome[]) {
  if (!outcomes.length || outcomes.length > MAX_MATCHES || outcomes.some(x => x !== 'win' && x !== 'loss')) {
    throw new Error(`请确认 1–${MAX_MATCHES} 场有效战绩。`);
  }
  const total = outcomes.length;
  const wins = outcomes.filter(x => x === 'win').length;
  let streak = 0;
  for (const outcome of outcomes) { if (outcome !== outcomes[0]) break; streak++; }
  const streakType = outcomes[0];
  const recent = outcomes.slice(0, 5);
  const lossRate = (total - wins) / total;
  const recentLossRate = recent.filter(x => x === 'loss').length / recent.length;
  const streakAdjustment = Math.min(streak, RULES.streakCap) * (streakType === 'loss' ? RULES.lossStreakWeight : -RULES.winStreakWeight);
  const score = Math.max(0, Math.min(100, Math.round(lossRate * RULES.lossRateWeight + recentLossRate * RULES.recentLossWeight + streakAdjustment)));
  const advice = (streakType === 'loss' && streak >= RULES.restLossStreak) || score >= RULES.restScore ? '先休息' : score >= RULES.steadyScore || streakType === 'loss' ? '稳一稳' : '继续排';
  const title = score >= 70 ? '峡谷抗压选手' : score >= 45 ? '排位过山车乘客' : score >= 20 ? '峡谷稳健派' : '顺风发动机';
  const comment = advice === '先休息' ? '水晶可以再推，心态先回个泉水。' : advice === '稳一稳' ? '先把节奏找回来，别把“再来一把”打成连续剧。' : '手感在线，记得带上清醒一起进峡谷。';
  const adviceDetail = advice === '先休息' ? '离开排位喝口水，等心态回满再出发。' : advice === '稳一稳' ? '整理一下上局思路，再决定要不要点匹配。' : '可以再来一把，累了就及时收工。';
  let trend = '样本较少';
  let trendDelta: number | null = null;
  if (total >= 4) {
    const half = Math.floor(total / 2);
    const latest = outcomes.slice(0, half);
    const earlier = outcomes.slice(-half);
    trendDelta = Math.round((latest.filter(x => x === 'win').length / half - earlier.filter(x => x === 'win').length / half) * 100);
    trend = trendDelta >= 20 ? '状态回升' : trendDelta <= -20 ? '状态回落' : '走势平稳';
  }
  return { total, wins, losses: total - wins, winRate: Math.round(wins / total * 100), streak, streakType, score, advice, title, comment, adviceDetail, trend, trendDelta,
    breakdown: { lossRatePoints: lossRate * RULES.lossRateWeight, recentLossPoints: recentLossRate * RULES.recentLossWeight, streakAdjustment } };
}
export type Report = ReturnType<typeof analyze>;
