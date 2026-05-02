import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createCompanionServer } from '../companion/server.mjs';

test('serves dashboard HTML', async (t) => {
  const { statePath, dashboardPath } = await fixture(t);
  await writeFile(dashboardPath, '<!doctype html><h1>Feynman Companion</h1>');

  const server = createCompanionServer({ statePath, dashboardPath });
  const url = await listen(t, server);

  const response = await fetch(`${url}/dashboard.html`);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(await response.text(), /Feynman Companion/);
});

test('serves normalized state JSON', async (t) => {
  const { statePath, dashboardPath } = await fixture(t);
  await writeFile(dashboardPath, '<!doctype html>');
  await writeFile(
    statePath,
    JSON.stringify({
      concept: 'Queue backpressure',
      status: 'in-progress',
      round: 2,
      currentProbe: 'What happens when producers outrun consumers?'
    })
  );

  const server = createCompanionServer({ statePath, dashboardPath });
  const url = await listen(t, server);

  const response = await fetch(`${url}/state`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(body.ok, true);
  assert.equal(body.error, '');
  assert.equal(body.statePath, statePath);
  assert.equal(body.snapshot.concept, 'Queue backpressure');
  assert.equal(body.snapshot.round, 2);
  assert.equal(body.snapshot.masteryCriteria.length, 5);
});

test('returns readable fallback when state file is missing', async (t) => {
  const { statePath, dashboardPath } = await fixture(t);
  await writeFile(dashboardPath, '<!doctype html>');

  const server = createCompanionServer({ statePath, dashboardPath });
  const url = await listen(t, server);

  const response = await fetch(`${url}/state`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, false);
  assert.equal(body.statePath, statePath);
  assert.match(body.error, /ENOENT|no such file/i);
  assert.equal(body.snapshot.concept, 'Untitled concept');
  assert.equal(body.snapshot.currentProbe, 'Start a Feynman session in the terminal.');
});

test('returns readable fallback when state file contains malformed JSON', async (t) => {
  const { statePath, dashboardPath } = await fixture(t);
  await writeFile(dashboardPath, '<!doctype html>');
  await writeFile(statePath, '{not valid json');

  const server = createCompanionServer({ statePath, dashboardPath });
  const url = await listen(t, server);

  const response = await fetch(`${url}/state`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, false);
  assert.equal(body.statePath, statePath);
  assert.match(body.error, /json|expected|property|position|token/i);
  assert.equal(body.snapshot.concept, 'Untitled concept');
  assert.equal(body.snapshot.status, 'inactive');
});

test('serves health status', async (t) => {
  const { statePath, dashboardPath } = await fixture(t);
  await writeFile(dashboardPath, '<!doctype html>');

  const server = createCompanionServer({ statePath, dashboardPath });
  const url = await listen(t, server);

  const response = await fetch(`${url}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
  assert.deepEqual(body, { ok: true, statePath });
});

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'feynman-companion-server-'));
  t.after(() => rm(dir, { recursive: true, force: true }));

  return {
    dir,
    statePath: join(dir, 'state.json'),
    dashboardPath: join(dir, 'dashboard.html')
  };
}

async function listen(t, server) {
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => close(server));

  const address = server.address();
  assert.equal(typeof address, 'object');

  return `http://127.0.0.1:${address.port}`;
}

async function close(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
