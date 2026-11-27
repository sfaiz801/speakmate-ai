import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeUpdatedStreak,
  upsertTodayActivity,
  buildTodayTasks,
  getLastSevenDaysSeries,
} from '../src/lib/storage/progressHelpers.js';
import { createDefaultAppState } from '../src/lib/storage/defaultState.js';
import { GRAMMAR_LESSONS } from '../src/data/grammarLessons.js';
import { VOCABULARY_SETS } from '../src/data/vocabularyData.js';
import { CONVERSATION_SCENARIOS } from '../src/data/conversationScenarios.js';
import {
  SYLLABUS_STAGES,
  SYLLABUS_MODULES,
  CERTIFICATION_TIERS,
} from '../src/data/syllabusData.js';

test('computeUpdatedStreak increments on consecutive day and resets after gap', () => {
  assert.equal(computeUpdatedStreak('2026-11-26', 4, '2026-11-27'), 5);
  assert.equal(computeUpdatedStreak('2026-11-27', 4, '2026-11-27'), 4);
  assert.equal(computeUpdatedStreak('2026-11-20', 4, '2026-11-27'), 1);
});

test('upsertTodayActivity aggregates minutes and sessions for today', () => {
  const initial = [];
  const afterFirst = upsertTodayActivity(initial, { minutes: 5, sessions: 1, wordsLearned: 2 });
  assert.equal(afterFirst.length, 1);
  assert.equal(afterFirst[0].minutes, 5);

  const afterSecond = upsertTodayActivity(afterFirst, { minutes: 7, sessions: 1, wordsLearned: 3 });
  assert.equal(afterSecond.length, 1);
  assert.equal(afterSecond[0].minutes, 12);
  assert.equal(afterSecond[0].sessions, 2);
  assert.equal(afterSecond[0].wordsLearned, 5);
});

test('createDefaultAppState starts with zeroed real-time tracking and curriculum satisfies counts', () => {
  const state = createDefaultAppState();
  assert.equal(state.auth.mode, 'local');
  assert.equal(state.version, 2);
  assert.equal(state.progress.streakDays, 0);
  assert.equal(state.progress.totalSpeakingMinutes, 0);
  assert.equal(state.progress.totalSessions, 0);
  assert.equal(state.progress.practiceHistory.length, 0);
  assert.equal(getLastSevenDaysSeries(state.progress.dailyActivity).length, 7);
  assert.equal(GRAMMAR_LESSONS.length, 11);
  assert.equal(CONVERSATION_SCENARIOS.length, 9);
  for (const set of VOCABULARY_SETS) {
    assert.equal(set.words.length, 10);
  }
  const tasks = buildTodayTasks(state);
  assert.equal(tasks.length, 4);
  assert.equal(SYLLABUS_STAGES.length, 4);
  assert.equal(SYLLABUS_MODULES.length, 12);
  assert.equal(CERTIFICATION_TIERS.length, 3);
});
