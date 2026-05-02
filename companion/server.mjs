import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { readSnapshotFile } from './schema.mjs';

const HOST = '127.0.0.1';
const DEFAULT_STATE_PATH = './feynman-companion/state.json';
const DEFAULT_DASHBOARD_PATH = join(dirname(fileURLToPath(import.meta.url)), 'dashboard.html');

export function createCompanionServer({ statePath, dashboardPath } = {}) {
  const resolvedStatePath = resolve(statePath ?? process.env.FEYNMAN_COMPANION_STATE ?? DEFAULT_STATE_PATH);
  const resolvedDashboardPath = resolve(dashboardPath ?? DEFAULT_DASHBOARD_PATH);

  return createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url ?? '/', `http://${request.headers.host ?? HOST}`).pathname;

      if (pathname === '/' || pathname === '/dashboard.html') {
        const body = await readFile(resolvedDashboardPath, 'utf8');
        send(response, 200, body, 'text/html; charset=utf-8');
        return;
      }

      if (pathname === '/state') {
        const snapshot = await readSnapshotFile(resolvedStatePath);
        sendJson(response, 200, { ...snapshot, statePath: resolvedStatePath });
        return;
      }

      if (pathname === '/health') {
        sendJson(response, 200, { ok: true, statePath: resolvedStatePath });
        return;
      }

      sendJson(response, 404, { ok: false, error: `No route for ${pathname}` });
    } catch (error) {
      sendJson(response, 500, {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const statePath = resolve(options.statePath ?? process.env.FEYNMAN_COMPANION_STATE ?? DEFAULT_STATE_PATH);
  const port = options.port ?? Number.parseInt(process.env.FEYNMAN_COMPANION_PORT ?? '0', 10);
  const server = createCompanionServer({ statePath });

  await mkdir(dirname(statePath), { recursive: true });
  await new Promise((resolveListen) => {
    server.listen(Number.isInteger(port) ? port : 0, HOST, resolveListen);
  });

  const address = server.address();
  const listeningPort = typeof address === 'object' && address ? address.port : port;

  console.log(JSON.stringify({
    type: 'feynman-companion-started',
    url: `http://${HOST}:${listeningPort}`,
    statePath
  }));
}

function parseArgs(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--state') {
      options.statePath = args[index + 1];
      index += 1;
    } else if (args[index] === '--port') {
      options.port = Number.parseInt(args[index + 1], 10);
      index += 1;
    }
  }

  return options;
}

function sendJson(response, statusCode, body) {
  send(response, statusCode, JSON.stringify(body), 'application/json; charset=utf-8');
}

function send(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    'content-type': contentType,
    'cache-control': 'no-store'
  });
  response.end(body);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}
