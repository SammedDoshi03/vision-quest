import test from 'node:test';
import assert from 'node:assert/strict';
import { withTimeout, DeadlineExceededError, coarsenLocation } from '../src/util';
import { buildInterestScoringPipeline, type ViewerVector } from '../src/mongo';

test('withTimeout resolves when call finishes within ms budget', async () => {
  const result = await withTimeout(async () => {
    return 'fast_result';
  }, 200);
  assert.strictEqual(result, 'fast_result');
});

test('withTimeout rejects with DeadlineExceededError when deadline is breached', async () => {
  await assert.rejects(
    async () => {
      await withTimeout(async () => {
        await new Promise((r) => setTimeout(r, 100));
        return 'too_slow';
      }, 20);
    },
    DeadlineExceededError
  );
});

test('coarsenLocation rounds coordinates to 3 decimal places for ~110m privacy blurring', () => {
  const coarsened = coarsenLocation(12.971598, 77.594562, 3);
  assert.strictEqual(coarsened.lat, 12.972);
  assert.strictEqual(coarsened.lng, 77.595);
});

test('buildInterestScoringPipeline returns expected MongoDB stages', () => {
  const vector: ViewerVector = {
    tagIds: ['tag_1'],
    depths: [5],
    ancestors: ['music'],
    languages: ['en'],
    heritageRegionIds: ['mysore'],
    home: { type: 'Point', coordinates: [77.59, 12.97] },
    gender: 'Man',
    prefs: {
      genders: ['Woman'],
      ageMin: 21,
      ageMax: 35,
      maxDistanceKm: 25,
    },
    age: 28,
    birthDateFloor: new Date(),
    birthDateCeil: new Date(),
    excludeIds: [],
    minScore: 10,
  };

  const stages = buildInterestScoringPipeline(vector);
  assert.strictEqual(stages.length, 3);
  assert.ok(stages[0].$set);
});
