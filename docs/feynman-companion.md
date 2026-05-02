# Feynman live companion

The Feynman live companion is an optional, read-only browser dashboard. It mirrors the current learning state from a `/feynman` session so you can scan the active gap, probe, mastery progress, and session history beside the terminal or chat.

Terminal or chat remains the only learner answer surface. The dashboard does not accept answers and does not replace the markdown session log.

## Start the dashboard

Run the dependency-free Node server from the skill package:

```bash
node companion/server.mjs --state feynman-companion/state.json --port 0
```

The server prints JSON like this:

```json
{
  "type": "feynman-companion-started",
  "url": "http://127.0.0.1:54321",
  "statePath": "/absolute/path/to/feynman-companion/state.json"
}
```

Open the `url` in a browser and keep using `/feynman` in terminal or chat.

## Use it in a session

Ask for the companion when starting the session:

```text
/feynman JWT signatures with live companion
```

The skill writes display state to `feynman-companion/state.json` by default. If that file already exists, the skill treats the companion as enabled for the session.

## What the dashboard shows

The dashboard is laid out as a four-tier hierarchy so the next question is unmistakable:

1. **Probe Stage** — the next question to answer, rendered as a hero card. This is what the learner should focus on between turns.
2. **Mastery + Current round** — five mastery chips show progress at a glance, and three mini-cards show the current gap category, gap summary, and the learner's last quote.
3. **Round history** — a collapsible list of completed rounds. Open it when you want to recall earlier turns.
4. **Session meta** — log path, last updated time, and scaffold status as a small footer line.

When the session is conducted in Korean, the dashboard chrome speaks natural Korean: 쉬운 말로 설명 / 존재 이유 짚기 / 작동 원리 파악 / 적용 경계 구분 / 압박 검증 통과 for mastery, and 막힌 부분 / 어떻게 막혔나 / 방금 한 말 / 지난 라운드 for the supporting sections. The skill writes `language: "ko"` into the snapshot when it detects a Korean session, and the dashboard switches bundles automatically.

## Fallback behavior

The companion is optional. If the server is not running, the snapshot path cannot be written, or the dashboard cannot refresh, the Feynman session continues normally in terminal or chat. The skill may mention once that the companion could not update, but visualization never blocks the learning loop.

The markdown session log remains the durable record. The JSON snapshot is disposable display state.

## Cleanup

`feynman-companion/` is ignored by git because it contains runtime display state. Remove it whenever you want to reset the dashboard state.

On macOS, Linux, or Git Bash:

```bash
rm -rf feynman-companion
```

On PowerShell:

```powershell
Remove-Item -Recurse -Force feynman-companion
```
