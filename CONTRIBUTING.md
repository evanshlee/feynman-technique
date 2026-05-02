# Contributing to feynman-technique

Thanks for your interest! This skill is better when the community shapes it.

## What You Can Contribute

### 🌐 New Language Translations

The most impactful contribution. See [i18n/README.md](i18n/README.md) for the workflow.

### 📝 Example Sessions

Real session transcripts help new users understand what a good Feynman session looks like. See existing examples in [`examples/`](examples/).

**Good example contributions**:

- Cover a different domain than existing examples
- Show the full session from kickoff to mastery

- Include at least one edge case or stuck moment

- Under ~150 lines

### 🔍 Gap Category Refinements

If you use the skill and notice gaps the 7 categories miss, open an issue describing:

- What the learner said
- Which category almost fit but didn't

- Why the existing categories miss it

- A proposed 8th category (if warranted)

### 🐛 Platform Bugs

If the skill misbehaves on a specific platform:

1. Note the platform and version

2. Paste the exact prompt and response
3. Describe expected vs actual behavior

### 📖 Documentation

Clarifications, corrections, better examples in `docs/`.

---

## Contribution Workflow

1. **Open an issue first** for non-trivial changes (new language, new category, structural edits)
2. **Fork and branch** with a descriptive name (`add-ja-i18n`, `fix-mastery-edge-case`)
3. **Keep PRs focused** — one topic per PR
4. **Update docs** if you change behavior

---

## Style Guide

### Markdown

- Use `[code blocks]` for command examples
- Use tables for structured comparisons

- Keep line length natural (no hard wrapping at 80 chars)
- Headings are sentence case (`## How to add a language`, not `## How To Add A Language`)

### Tone (in docs and examples)

- Direct, warm, peer-to-peer
- No em-dashes (`—`) — use en-dashes (`–`), commas, or parentheses

- Avoid corporate softening ("please kindly...")
- Specific > generic in all praise and criticism

### File Naming

- i18n files: ISO 639-1 code, lowercase (`ja.md`, `fr.md`, `zh-cn.md`)
- Examples: `<domain>-<concept>.md` (e.g., `coding-jwt-signature.md`, `biology-mitosis.md`)
- Docs: kebab-case (`gap-taxonomy.md`, `design-rationale.md`)

---

## Code of Conduct

- Be kind to contributors
- Assume good faith on translations — multiple valid phrasings exist
- If you disagree with a design decision, read `docs/design-rationale.md` first
- Native speakers have final say on their language's tone

---

## Questions?

Open a discussion in the repo, or find the maintainer's contact in the repo description.
