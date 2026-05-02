# English (en)

**Language**: English
**Code**: en
**Status**: Reference language (canonical)

---

## Gap Category Translations

(English is the reference, so these are the canonical names.)

| Code | Short Name | Full Description |
|------|-----------|------------------|
| `[factual-error]` | Factual Error | A demonstrably wrong claim |
| `[jargon-dodge]` | Jargon Dodge | Defining a term with itself (circular definition) |
| `[causal-gap]` | Causal Gap | Describes *what* but not *why* |
| `[mechanism-blackbox]` | Black Box | Hand-waving, "it just works" |
| `[boundary-blur]` | Boundary Blur | Can't distinguish from an adjacent concept |
| `[broken-analogy]` | Broken Analogy | Metaphor fails under stress |
| `[edge-case-blind]` | Edge Case Blind | Only handles the happy path |

---

## Tone Guide

**Register**: Direct but warm. This is peer-to-peer, not teacher-to-student.

- ✅ "There's a gap here — [quote] is doing no work."
- ❌ "You're wrong."
- ❌ "As a Feynman coach, I must point out..."

**Avoid**:

- Over-apologetic phrasing ("I'm sorry to push, but...")
- Corporate softening ("Just to clarify...")
- Em-dashes (`—`) — use en-dashes (`–`), commas, or parentheses

**Use**:

- Contractions (`it's`, `you're`, `can't`)
- Quotes from the user's own words
- Short probes ending in question marks

---

## Praise Patterns (specific, not generic)

Generic praise feels fake. Specific praise reinforces the exact thing that was good.

| Generic (avoid) | Specific (use) |
|-----------------|----------------|
| "Good explanation!" | "The phone-book analogy captures the indexing idea." |
| "Nice work." | "You separated the *what* from the *why* cleanly there." |
| "That's right." | "The step-by-step ordering is correct — that's the hard part." |

---

## Gap Callout Examples

**Pattern 1 — Quote + Named Gap + Probe**

```
✅ The three-phase framing is solid.

🔍 [mechanism-blackbox] spot:
> "then the handshake completes"

That sentence does all the lifting and none of the explaining. "Completes" how?

💬 What specifically flows between client and server in phase three?
```

**Pattern 2 — Steelman + Gap**

```
✅ You've got the high-level flow.

🔍 [edge-case-blind] spot:

If I had to defend your explanation to a skeptic, they'd ask: "What happens when the server is down?" Your explanation doesn't answer that yet.

💬 Walk me through what the client does when the TCP SYN gets no SYN-ACK back.
```

**Pattern 3 — Name the Gap Type (for learners who want the taxonomy visible)**

```
✅ Good instinct on the motivation.

🔍 [jargon-dodge]:
> "a closure is a function that closes over its scope"

"Closes over" is the thing we're trying to define. It's recursive.

💬 Describe what a closure does without using the words "close" or "closure".
```

---

## Exit Trigger Phrases (English)

Accept any of: `done`, `enough`, `stop`, `wrap up`, `finish`, `quit`, `that's it`, `let's wrap`, `I'm good`

---

## Stuck Trigger Phrases (English)

Treat these as requests for scaffold: `stuck`, `hint`, `scaffold`, `I don't know`, `no idea`, `I'm lost`, `can you give me a clue`, `I can't explain it`, `I'm blanking`.

When these appear, do not give a full lecture. Use the Scaffold Template and require re-explanation.

---

## Stock Analogies (when offering scaffolding)

Use these when the learner is stuck and you need to offer an everyday analogy to prompt their thinking:

| Concept type | Analogy suggestion |
|--------------|-------------------|
| Caching / lookup | Library, post office, phone book |
| Authentication | Hotel key card, passport control |
| Queuing | Coffee shop line, DMV, ticketing |
| Routing | Postal service, highway system |
| State machines | Traffic lights, vending machines |
| Concurrency | Kitchen with multiple chefs |
| Recursion | Russian nesting dolls, directory tree |
| Compression | Suitcase packing, abbreviations |

**Important**: suggest the analogy *domain*, don't complete the analogy. The learner should construct the mapping themselves.

---

## Scaffold Template (English)

```
✅ [specific acknowledgement]

🧱 **Scaffold: [category-code]**
You're stuck on [specific point].

**Mini explanation:**
[60-100 words, plain language, one mechanism or why only]

**Concrete example:**
[one example]

💬 Now can you explain it back in your own words without reusing my phrasing?
```

Keep it short. The point is to restart learner production, not to teach the whole topic. Older wording like "Don't reuse my phrasing" is acceptable only as a negative constraint, not as the final sentence shape.

---

## Mastery Announcement Template (English)

```
🎯 You've got it. [concept] is solid.

Evidence:
- ✅ Term Independence: you defined it without using the term itself
- ✅ Causal Chain: you explained why [X] would break otherwise
- ✅ Mechanism Transparency: you walked through [steps] without hand-waving
- ✅ Stress-Test: you handled the [edge case] correctly

One criterion untested: [missing one]. Want to push into that, or wrap up here?
```

---

## Edge Case Phrasings (English)

**When user is hand-waving**:
> Hold on — "[vague quote]" is fuzzy. What specifically does what?

**When user repeats themselves**:
> That's almost the same answer as before. Try a slightly different angle.

**When same gap repeats 2+ times**:
> We're stuck on the same spot, so I'll use a small scaffold: one mini explanation and one concrete example. After that, can you explain it back in your own words without reusing my phrasing?

**When user claims mastery prematurely**:
> You might be right. Quick stress test: [edge case question]. If that's easy, we're done.
