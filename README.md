# feynman-technique

> An AI agent skill that makes you learn concepts the hard way: by explaining them out loud and getting your gaps exposed.

`/feynman JWT signatures` → the AI plays a strict critic, points out ONE gap in your explanation per turn, and loops until you actually understand it (or you tap out).

No passive summaries. The AI does not replace your explanation. If you get stuck, it can give a small scaffold, but you still have to explain the idea back in your own words.

## What is this?

An implementation of the **Feynman Technique** as an interactive agent skill. Named after physicist Richard Feynman's learning method: if you can't explain something simply, you don't understand it.

The skill acts as the missing piece most learners lack — a critic who stress-tests your explanation and refuses to let you get away with fluent-sounding BS.

## Why?

Self-study suffers from two well-documented illusions:

- **Fluency illusion**: re-reading or re-explaining feels like learning, but the explanation gets smoother without getting deeper.
- **Illusion of Explanatory Depth (IOED)**: people believe they can explain mechanisms they actually can't.

Feynman Technique alone doesn't fix these — you still grade your own homework. This skill adds the missing critic.

## Quick Start

### 1. Install

Pick your platform:

- **[Claude Code](INSTALL.md#claude-code)** (drop the skill into `.claude/skills/`)
- **[Copilot CLI](INSTALL.md#github-copilot-cli)**
- **[Gemini CLI](INSTALL.md#gemini-cli)**
- **[Codex CLI](INSTALL.md#codex-cli)**
- **[Generic Claude API](INSTALL.md#generic-claude-api-or-other-llms)** (system prompt version)

Full installation guide: [INSTALL.md](INSTALL.md).

### 2. Run

```
/feynman [concept you want to master]
```

Optional beginner on-ramp if you cannot explain the topic yet:

```
/feynman primer [concept you cannot explain yet]
```

Primer mode is optional. `/feynman primer [concept]` gives you a short on-ramp, then hands the turn back to you. The normal mastery loop still begins with your explanation in your own words.

Example:

```
/feynman TCP three-way handshake
```

The AI will:

1. Ask you to explain the concept in your own words
2. Quote your words, name one gap, and ask one probing question
3. If you get stuck, give a capped scaffold instead of taking over
4. Require you to explain the point back in your own words after any scaffold
5. Repeat until 4 of 5 mastery criteria are met, or you say "done"
6. Save a session log you can revisit or resume

### 3. Example session

```
User: /feynman DNS

AI: 🎓 Feynman session started: DNS
    Rules: explain simply, I point out ONE gap per turn, say "done" to wrap up.
    Go ahead.

User: DNS is like a phone book. You type a domain and it gives you an IP.

AI: ✅ The phone-book analogy captures the indexing idea.

    🔍 [mechanism-blackbox] spot:
    > "gives you an IP"

    Who does the lookup, and where? A phone book has a shelf.

    💬 When you visit a brand-new site, who does your computer ask first?

User: My computer asks my router, I think?

AI: ✅ You're tracing a path, which is the right instinct.

    🔍 [mechanism-blackbox] spot:
    > "my router, I think"

    The router forwards it somewhere. The hedging suggests this is the black box.

    💬 What does the router do with that query?

[... continues until mastery ...]
```

### Optional: live companion

Start the optional read-only browser dashboard:

```bash
node companion/server.mjs --state feynman-companion/state.json --port 0
```

Then ask for it in a session:

```text
/feynman JWT signatures with live companion
```

The dashboard mirrors current gap, probe, mastery progress, and session history while terminal or chat remains the only answer surface. See [docs/feynman-companion.md](docs/feynman-companion.md) for details.

## Features

- 🎯 **7-category gap taxonomy** with priority ordering
- 🧩 **Hybrid scaffold** for stuck moments, capped and followed by learner re-explanation
- 🪜 **Optional primer mode** for a short beginner on-ramp before the normal loop
- 🖥️ **Optional live companion** - browser dashboard for current gap, probe, mastery progress, and session history
- 📝 **Review Sheet** at wrap-up with a simple explanation, analogy, limits, and transfer quiz
- 🔁 **Multi-turn loop** - one gap at a time, strict
- 🏁 **4-of-5 mastery detection** - knows when to stop
- 📁 **Session logs** - markdown files you can resume, revisit, or share
- 🌐 **Language mirroring** - AI replies in whatever language you explain in
- 🌍 **i18n support** - English + Korean shipped, more via community
- 🔌 **5+ agent platforms** supported

## Gap Categories (quick reference)

| Code | Category | What it catches |
|------|----------|-----------------|
| `[factual-error]` | Wrong claim | "HTTP is always encrypted" |
| `[jargon-dodge]` | Term defined by itself | "Recursion is when a function recurses" |
| `[causal-gap]` | No "why" | Describing what without motivation |
| `[mechanism-blackbox]` | Magic steps | "it just works" |
| `[boundary-blur]` | No differentiation | Can't tell X from Y |
| `[broken-analogy]` | Metaphor breaks | Analogy fails under stress |
| `[edge-case-blind]` | Happy path only | No handling of weird inputs |

Full details: [docs/gap-taxonomy.md](docs/gap-taxonomy.md).

## Mastery Criteria (4 of 5 required)

1. **Term Independence** — defines core term without using itself
2. **Causal Chain** — can explain *why* it exists
3. **Mechanism Transparency** — step-by-step, no black boxes
4. **Boundary Differentiation** — distinguishes from adjacent concepts
5. **Stress-Test Pass** — handles at least one edge case

Full criteria: [docs/mastery-criteria.md](docs/mastery-criteria.md).

## Examples

See [`examples/`](examples/) for full session transcripts:

- [Coding: JWT signature verification](examples/coding-jwt-signature.md)
- [Scaffolded: JWT signature verification](examples/scaffolded-jwt-signature.md)
- [Primer: DNS to Feynman loop](examples/primer-to-loop.md)
- [Science: Transformer attention mechanism](examples/science-attention-mechanism.md)
- [Business: Product-market fit](examples/business-market-fit.md)

## Internationalization

The skill ships with language tone guides:

- 🇬🇧 [English](i18n/en.md)
- 🇰🇷 [Korean](i18n/ko.md)

Want to add your language? See [i18n/README.md](i18n/README.md) and use the [TEMPLATE.md](i18n/TEMPLATE.md).

## Design Philosophy

Read [docs/design-rationale.md](docs/design-rationale.md) for the research grounding (retrieval practice, desirable difficulty, IOED, metacognition) and why specific design decisions were made.

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) — especially for new language translations and domain-specific example sessions.

## License

MIT. See [LICENSE](LICENSE).

## Credits

Inspired by Richard Feynman's learning approach, popularized by Scott Young and the Farnam Street blog. Cognitive science grounding: Chi (self-explanation), Dunning-Kruger, Rozenblit & Keil (IOED), Sweller (cognitive load), Roediger & Karpicke (retrieval practice).
