# Gap Taxonomy

Detailed definitions for the 7 gap categories the AI scans for during each turn. This is the reference the AI should use when classifying a gap in a user's explanation.

---

## Priority Order (most to least urgent)

1. `[factual-error]` - poisons everything downstream
2. `[jargon-dodge]` - circular definition blocks further reasoning
3. `[causal-gap]` - motivation anchors retention
4. `[mechanism-blackbox]` - hand-waving = fake understanding
5. `[boundary-blur]` - differentiation is where real understanding lives
6. `[broken-analogy]` - metaphors need stress-testing
7. `[edge-case-blind]` - polish phase

**Tiebreaker**: within the same category, pick the gap closest to the user's current reach (maintains motivation via achievable wins).

---

## 1. `[factual-error]`

Definition: A statement that is demonstrably wrong, in contradiction with established knowledge.

Examples:

- "HTTP is always encrypted" (HTTPS is encrypted, HTTP isn't)
- "JavaScript is multi-threaded by default" (wrong)
- "DNA is made of RNA" (wrong)
- "The sun orbits the earth" (wrong)

How to respond: Quote the exact claim. State the correction tersely. Ask the user to revise.

```
🔍 [factual-error] spot:
> "HTTP is always encrypted"

HTTP is plaintext. HTTPS (with TLS) is the encrypted version.

💬 Reframe your explanation with that distinction in mind.
```

---

## 2. `[jargon-dodge]`

Definition: Using a technical term inside its own definition. The label does no explanatory work.

Also called: jargon laundering, circular definition.

Examples:

- "Recursion is when a function is recursive"
- "A linked list is a list where elements are linked"
- "Encryption means data gets encrypted"
- "Async means things happen asynchronously"

How to respond: Quote the circular phrase. Ask them to define it *without* using the term or any form of it.

```
🔍 [jargon-dodge] spot:
> "Recursion is when a function recurses"

The word 'recurses' is doing no work here — it just restates the term.

💬 Explain recursion without using the word 'recursion' or 'recursive'. Pretend the word doesn't exist.
```

---

## 3. `[causal-gap]`

Definition: Describing *what* happens without *why*. The user explains the behavior but not the motivation or problem being solved.

Examples:

- "Garbage collection clears memory" (why do we need it?)
- "Indexes speed up database queries" (how? at what cost?)
- "TCP uses three-way handshake" (why three? why not two or four?)
- "Passwords are hashed before storage" (what happens if you don't?)

How to respond: Point to the described behavior and ask what problem it solves or what would break without it.

```
🔍 [causal-gap] spot:
> "Garbage collection clears unused memory"

You described what GC does, not why it's necessary.

💬 What specifically breaks if you don't have GC? Give me the concrete failure mode.
```

---

## 4. `[mechanism-blackbox]`

Definition: A step in the explanation where the user says "it just works" or uses passive voice to hide an unknown mechanism.

Also called: hand-waving, magic step, passive voice evasion.

Signal phrases: "somehow", "magically", "it just works", "the system handles it", "gets authenticated", "is processed"

Examples:

- "JWT is safe because it's signed" (how is the signature verified?)
- "The request is authenticated" (by what? how?)
- "The framework handles routing" (using what mechanism?)
- "Data is synchronized across nodes" (how? at what consistency?)

How to respond: Quote the black-box phrase. Name the hidden mechanism. Ask them to describe the step-by-step.

```
🔍 [mechanism-blackbox] spot:
> "JWT is safe because it's signed"

That's the claim, not the mechanism. What verifies the signature, using what?

💬 Walk through the exact steps: user sends JWT → server does WHAT with it → server decides to trust it?
```

---

## 5. `[boundary-blur]`

Definition: The user can't distinguish the concept from an adjacent or similar concept. They conflate neighbors.

Examples:

- Promise vs async/await vs callbacks
- Process vs thread vs fiber
- Authentication vs authorization
- Cache vs buffer
- Concurrency vs parallelism
- TCP vs UDP

How to respond: Name the neighbor concept. Ask what distinguishes them.

```
🔍 [boundary-blur] spot:
> "async/await makes code asynchronous"

Promises also make code asynchronous. What specifically does async/await add that Promises alone don't?

💬 Give me a scenario where async/await helps and Promises alone would be clumsy.
```

---

## 6. `[broken-analogy]`

Definition: The user's analogy works for one dimension but breaks down on a critical dimension. Useful analogies need their limits acknowledged.

Examples:

- "TCP is like mailing a letter" (fails on retransmission, ordering, connection state)
- "A neural network is like the brain" (fails on backprop, discrete weights)
- "DNS is like a phone book" (fails on caching, hierarchy, TTLs)
- "Git is like saving a file" (fails on branching, merging, distributed)

How to respond: Acknowledge the working part of the analogy. Push on the dimension where it breaks.

```
🔍 [broken-analogy] spot:
> "TCP is like mailing a letter"

The addressing part works. But letters arrive out of order, get lost, and mail doesn't retry.

💬 TCP guarantees order and retransmission. How does your letter analogy handle that?
```

---

## 7. `[edge-case-blind]`

Definition: The user only explains the happy path. Their explanation would break on realistic edge cases.

Examples:

- Sorting explanation that ignores empty lists, duplicates, pre-sorted input
- API explanation that ignores rate limiting, auth failures, network errors
- Algorithm explanation that ignores worst case
- Protocol explanation that ignores packet loss, latency

How to respond: Present a realistic edge case. Ask what their explanation predicts for that case.

```
🔍 [edge-case-blind] spot:
> "quicksort picks a pivot and partitions"

What happens if the input is already sorted? Or if all elements are the same?

💬 Run your quicksort explanation on [1,1,1,1,1]. What does the algorithm do?
```

---

## Scoring Multiple Gaps

When a single explanation contains gaps in multiple categories:

1. **Count gaps per category**. Score: `factual-error × 1000 + jargon-dodge × 100 + causal-gap × 50 + mechanism × 20 + boundary × 10 + analogy × 5 + edge-case × 1`
2. Highest-scoring category wins.
3. Within that category, pick the gap with the shortest fix path (tiebreaker).

This weighting ensures that severe gaps (factual errors) always get addressed first, while still allowing minor categories to surface when no major gaps exist.

---

## When NO Gap is Found

If the user's explanation is genuinely solid:

- **Do not end the session**. Mastery requires stress-testing, not one good answer.
- Probe with `[edge-case-blind]` or `[boundary-blur]` — these are hardest to satisfy and prevent premature closure.
- If three consecutive turns find no gaps AND mastery criteria are met, announce mastery.

---

## Scaffold Fit by Gap Type

Some gaps benefit more from mini ELI5 scaffolding than others:

| Gap | Scaffold fit | Best scaffold |
|-----|--------------|---------------|
| `[factual-error]` | Low | Terse correction, then ask for revision |
| `[jargon-dodge]` | Medium | Everyday rephrasing constraint |
| `[causal-gap]` | High | Mini ELI5 focused on the problem being solved |
| `[mechanism-blackbox]` | High | Step-by-step mini ELI5 plus one concrete example |
| `[boundary-blur]` | Medium | Contrastive example |
| `[broken-analogy]` | Medium | Analogy limit statement |
| `[edge-case-blind]` | Medium | One realistic edge case |

Only scaffold after repeated struggle or explicit request, including repeated same-gap failure, explicit stuck requests like `hint` or `I don't know`, shadow-repeat, vague hand-waving, or many low-progress rounds. Factual errors should usually be corrected directly instead of scaffolded, because a wrong premise poisons downstream reasoning.

## Anti-Patterns to Flag (not gaps, but worth calling out)

- **Rote recitation**: user quotes a textbook definition verbatim then stalls. Ask: "Now explain that without the textbook's words."
- **Analogy over-reach**: using one analogy to cover all aspects. Analogies are scaffolding, not explanations.
- **Premature closure**: "I get it now" after one good turn. Ask a novel scenario before accepting.
- **Confidence mismatch**: high confidence + hedge words in same turn. Surface the contradiction.
- **Lateral escape**: when pressed, user pivots to a related concept they know. Re-anchor to original question.
