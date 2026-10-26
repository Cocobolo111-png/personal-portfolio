import test from 'node:test'
import assert from 'node:assert/strict'
import { analyze } from '../src/data/funGameRules.ts'

test('Next Round keeps the source sample statistics without claiming future odds', () => {
  const report = analyze(['loss', 'loss', 'win', 'loss', 'win'])
  assert.equal(report.winRate, 40)
  assert.equal(report.score, 58)
  assert.equal(report.advice, '稳一稳')
  assert.equal('predictedWinRate' in report, false)
})
test('winning and losing streaks lead to bounded and conservative advice', () => {
  assert.equal(analyze(Array(5).fill('win')).score, 0)
  assert.equal(analyze(Array(5).fill('loss')).score, 100)
  assert.equal(analyze(['loss', 'loss', 'loss', 'win']).advice, '先休息')
  assert.throws(() => analyze([]))
  assert.throws(() => analyze(['unknown']))
})
