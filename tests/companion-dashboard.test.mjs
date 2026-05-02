import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dashboardPath = new URL('../companion/dashboard.html', import.meta.url);

test('dashboard exposes all four tier regions', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /id="probe-stage"/);
  assert.match(html, /id="mastery-strip"/);
  assert.match(html, /id="current-round"/);
  assert.match(html, /id="round-history"/);
  assert.match(html, /id="session-meta"/);
  assert.match(html, /id="companion-error"/);
});

test('dashboard polls the normalized state endpoint every second', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /fetch\('\/state'/);
  assert.match(html, /setInterval\(loadState, 1000\)/);
});

test('dashboard declares dark-theme color tokens', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /--page-bg:\s*#10141f;/);
  assert.match(html, /--panel-bg:\s*#0f1320;/);
  assert.match(html, /--text:\s*#e6e9f2;/);
  assert.match(html, /--accent:\s*#5b8def;/);
  assert.match(html, /--probe-bg-from:\s*#1d3a8a;/);
  assert.match(html, /--probe-bg-to:\s*#3b5fc7;/);
});

test('dashboard includes Korean-friendly font fallbacks', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /Apple SD Gothic Neo|Pretendard|Noto Sans KR/);
});

test('dashboard ships both EN and KO label bundles', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /STRINGS\s*=\s*\{[\s\S]*?en\s*:/);
  assert.match(html, /ko\s*:\s*\{/);
});

test('dashboard ships the agreed Korean labels', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /쉬운 말로 설명/);
  assert.match(html, /존재 이유 짚기/);
  assert.match(html, /작동 원리 파악/);
  assert.match(html, /적용 경계 구분/);
  assert.match(html, /압박 검증 통과/);
  assert.match(html, /이번 라운드/);
  assert.match(html, /막힌 부분/);
  assert.match(html, /어떻게 막혔나/);
  assert.match(html, /방금 한 말/);
  assert.match(html, /지난 라운드/);
});

test('dashboard ships the EN labels for the same keys', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /Term independence/);
  assert.match(html, /Causal chain/);
  assert.match(html, /Mechanism transparency/);
  assert.match(html, /Boundary differentiation/);
  assert.match(html, /Stress-test pass/);
  assert.match(html, /Your next move/);
});

test('round history is collapsible by default', async () => {
  const html = await readFile(dashboardPath, 'utf8');

  assert.match(html, /<details[\s\S]*?id="round-history"/);
});
