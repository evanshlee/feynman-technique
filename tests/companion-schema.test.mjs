import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeSnapshot } from '../companion/schema.mjs';

test('normalizes a complete snapshot', () => {
  const snapshot = normalizeSnapshot({
    concept: 'JWT signatures',
    status: 'in-progress',
    round: 3,
    currentLearnerQuote: 'JWT is safe because it is signed',
    currentGapCategory: '[mechanism-blackbox]',
    currentGapSummary: 'The verification step is still hidden.',
    currentProbe: 'Who verifies the signature, and what input do they use?',
    masteryCriteria: [
      { id: 'termIndependence', status: 'done', evidence: 'Explained token without saying JWT.' },
      { id: 'causalChain', status: 'done', evidence: 'Named tamper detection.' },
      { id: 'mechanismTransparency', status: 'active', evidence: 'Currently probing signature verification.' }
    ],
    scaffoldState: { status: 'none', summary: '' },
    roundHistory: [
      {
        round: 1,
        quote: 'It proves the token is real.',
        gapCategory: '[causal-gap]',
        gapSummary: 'The problem solved was not named.',
        probe: 'Why does the server need proof?',
        scaffoldUsed: false
      }
    ],
    sessionLogPath: 'feynman-sessions/2026-04-30-jwt-signatures.md',
    updatedAt: '2026-04-30T12:00:00-04:00'
  });

  assert.equal(snapshot.concept, 'JWT signatures');
  assert.equal(snapshot.status, 'in-progress');
  assert.equal(snapshot.round, 3);
  assert.equal(snapshot.masteryCriteria.length, 5);
  assert.equal(snapshot.masteryCriteria[0].status, 'done');
  assert.equal(snapshot.masteryCriteria[2].status, 'active');
  assert.equal(snapshot.roundHistory[0].round, 1);
  assert.equal(snapshot.sessionLogPath, 'feynman-sessions/2026-04-30-jwt-signatures.md');
});

test('uses explicit empty states when fields are missing', () => {
  const snapshot = normalizeSnapshot({});

  assert.equal(snapshot.concept, 'Untitled concept');
  assert.equal(snapshot.status, 'inactive');
  assert.equal(snapshot.round, 0);
  assert.equal(snapshot.currentProbe, 'Start a Feynman session in the terminal.');
  assert.deepEqual(
    snapshot.masteryCriteria.map((criterion) => criterion.status),
    ['pending', 'pending', 'pending', 'pending', 'pending']
  );
  assert.deepEqual(snapshot.roundHistory, []);
});

test('sanitizes malformed values without throwing', () => {
  const snapshot = normalizeSnapshot({
    concept: 42,
    status: ['bad'],
    round: -5,
    masteryCriteria: [
      { id: 'termIndependence', status: 'finished', evidence: 100 },
      { id: 'stressTestPass', status: 'done', evidence: null }
    ],
    scaffoldState: { status: 'surprised', summary: 99 },
    roundHistory: Array.from({ length: 10 }, (_, index) => ({
      round: index + 1,
      quote: `quote ${index + 1}`,
      gapCategory: '[mechanism-blackbox]',
      gapSummary: 'summary',
      probe: 'probe',
      scaffoldUsed: index % 2 === 0
    }))
  });

  assert.equal(snapshot.concept, '42');
  assert.equal(snapshot.status, 'inactive');
  assert.equal(snapshot.round, 0);
  assert.equal(snapshot.masteryCriteria[0].status, 'pending');
  assert.equal(snapshot.masteryCriteria[4].status, 'done');
  assert.equal(snapshot.scaffoldState.status, 'none');
  assert.equal(snapshot.scaffoldState.summary, '99');
  assert.equal(snapshot.roundHistory.length, 8);
  assert.equal(snapshot.roundHistory[0].round, 3);
});

test('defaults language to "en" when missing', () => {
  const snapshot = normalizeSnapshot({});
  assert.equal(snapshot.language, 'en');
});

test('preserves language when "ko"', () => {
  const snapshot = normalizeSnapshot({ language: 'ko' });
  assert.equal(snapshot.language, 'ko');
});

test('preserves language when "en"', () => {
  const snapshot = normalizeSnapshot({ language: 'en' });
  assert.equal(snapshot.language, 'en');
});

test('falls back to "en" for unknown language values', () => {
  assert.equal(normalizeSnapshot({ language: 'ja' }).language, 'en');
  assert.equal(normalizeSnapshot({ language: 42 }).language, 'en');
  assert.equal(normalizeSnapshot({ language: null }).language, 'en');
});
