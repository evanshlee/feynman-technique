# Installation Guide

`feynman-technique` works across multiple agent platforms. The core file is `SKILL.md` — each platform loads it slightly differently.

---

## Claude Code

Claude Code auto-loads skills from `.claude/skills/<name>/SKILL.md`.

**Install (project-scoped):**

```bash
# From your project root
mkdir -p .claude/skills/feynman
curl -o .claude/skills/feynman/SKILL.md https://raw.githubusercontent.com/<owner>/feynman-technique/main/SKILL.md
```

**Install (user-scoped, all projects):**

```bash
mkdir -p ~/.claude/skills/feynman
curl -o ~/.claude/skills/feynman/SKILL.md https://raw.githubusercontent.com/<owner>/feynman-technique/main/SKILL.md
```

**Invoke**: `/feynman <concept>` in Claude Code.

Frontmatter fields consumed by Claude Code: `name`, `description`, `argument-hint`, `allowed-tools`.

---

## GitHub Copilot CLI

Copilot CLI auto-discovers skills from installed plugins or a local skills directory.

**Install (local):**

```bash
mkdir -p ~/.copilot/skills/feynman
cp SKILL.md ~/.copilot/skills/feynman/
```

**Invoke**: `copilot /feynman <concept>` or use the `skill` tool within Copilot.

Frontmatter compatibility: same format as Claude Code.

---

## Gemini CLI

Gemini CLI loads skill metadata at session start, activates full content via `activate_skill`.

**Install:**

```bash
mkdir -p ~/.gemini/skills/feynman
cp SKILL.md ~/.gemini/skills/feynman/
```

Then add to `GEMINI.md` in your project root:

```markdown
## Available Skills

- `feynman`: Feynman Technique learning session - see ~/.gemini/skills/feynman/SKILL.md
```

**Invoke**: call `activate_skill` with `feynman`, or reference it in a prompt.

**Tool name mapping**: Gemini uses different tool names. Mapping:

| SKILL.md name | Gemini equivalent |
|---------------|-------------------|
| Read | read_file |
| Write | write_file |
| Edit | replace |
| Glob | glob |
| Grep | search_file_content |
| AskUserQuestion | (inline prompt) |

---

## Codex CLI

Codex agents load instructions from `AGENTS.md` files or custom skill directories.

**Install:**

```bash
mkdir -p .codex/skills/feynman
cp SKILL.md .codex/skills/feynman/
```

Reference it in `AGENTS.md`:

```markdown
## Feynman Skill

When user invokes feynman, load .codex/skills/feynman/SKILL.md and follow its instructions.
```

**Invoke**: mention "feynman" or "run feynman on [concept]" in your prompt.

---

## Generic Claude API (or other LLMs)

Use the SKILL.md body as a system prompt for a dedicated conversation.

**Python example:**

```python
from anthropic import Anthropic

client = Anthropic()

with open("SKILL.md") as f:
    skill_content = f.read()

# Strip frontmatter (everything between first two --- lines)
body = skill_content.split("---", 2)[2].strip()

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=body,
    messages=[
        {"role": "user", "content": "I want to learn: TCP three-way handshake"}
    ]
)
print(message.content)
```

**Considerations for API use:**

- File operations (creating session logs) require external tools — you'll need to implement file I/O in your calling code
- `AskUserQuestion` becomes a conversation turn
- The skill is stateless; maintain conversation history yourself

---

## OpenAI GPT (via Assistant API or custom GPT)

Create a custom GPT or Assistant with SKILL.md content as instructions:

1. Go to GPT builder or Assistants API
2. Paste the body of SKILL.md (without frontmatter) into "Instructions"
3. Name it "Feynman Coach"
4. Enable file search / code interpreter if you want session log persistence

---

## Ollama / Local LLMs

Use SKILL.md body as a system prompt:

```bash
ollama run llama3 --system "$(sed -n '/^---$/,/^---$/!p' SKILL.md)"
```

Or create a Modelfile:

```
FROM llama3
SYSTEM """
[paste SKILL.md body here]
"""
```

---

## Optional live companion

The live companion is an optional read-only browser dashboard for the current `/feynman` session. It requires Node.js, but no package installation and no npm dependencies.

Start the local dashboard from the skill package:

```bash
node companion/server.mjs --state feynman-companion/state.json --port 0
```

Then invoke a session with the companion enabled:

```text
/feynman JWT signatures with live companion
```

Terminal or chat remains the only learner answer surface. If Node.js is unavailable, the server is not running, or the snapshot cannot be written, the Feynman session continues normally and the skill may mention once that the companion could not update.

See [docs/feynman-companion.md](docs/feynman-companion.md) for the full guide.

---

## Verification

After installing, test with a simple concept:

```
/feynman photosynthesis
```

You should see:

```
🎓 Feynman session started: photosynthesis
Rules: ...
Go ahead — tell me what photosynthesis is.
```

If you see a greeting like this, installation worked.

---

## Troubleshooting

**Skill not found**: confirm SKILL.md is in the platform's expected skill directory. Run the platform's "list skills" command.

**AI gives the answer instead of asking**: the system prompt may have been truncated. Verify the full SKILL.md body is loaded. Try reducing context if using a small model.

**No file saving**: check the platform's file-write permission. For stateless API usage, implement file I/O in your calling code.

**Wrong language**: check `language` field handling in your platform. The skill mirrors the user's first explanation language.
