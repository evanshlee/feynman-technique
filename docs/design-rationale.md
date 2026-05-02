# Design Rationale

Why this skill is built the way it is. Research grounding and trade-offs behind specific decisions.

---

## Core Problem

Self-directed learners suffer from two documented illusions:

**1. Fluency Illusion** (Benjamin et al., 1998; Kornell & Bjork, 2008)
Re-reading, highlighting, and re-explaining *feel* productive because the material becomes smoother to process. But processing fluency doesn't equal learning depth. A smoother explanation is not a better one.

**2. Illusion of Explanatory Depth (IOED)** (Rozenblit & Keil, 2002)
People routinely believe they can explain mechanisms (toilets, zippers, bicycles, democracy) that they actually cannot. IOED collapses when someone has to produce a detailed explanation — but collapses too late, after the learner has already acted on false confidence.

**What's missing**: the Feynman Technique asks the learner to produce explanations, which should surface IOED. But *the learner is also the grader*. They don't know what they don't know, so they accept their own fluent-sounding output.

**This skill adds**: an external critic that doesn't share the learner's blind spots. The AI plays the role a skeptical audience would play — someone who asks "what do you mean by X?" until the explanation actually holds.

---

## Design Decision: User Explains First (Not AI)

Two modes are possible:

- **Strict Feynman**: user explains, AI critiques
- **Reverse Feynman**: AI explains, user critiques

This skill uses strict Feynman. Why:

- Feynman's original philosophy is "if you can't *explain* it, you don't understand it." The act of production is the diagnostic.
- Reverse mode is closer to "summarize this for me" — useful, but it's not Feynman, it's supervised reading.
- The productive discomfort of trying to articulate is where learning happens (Bjork's "desirable difficulty").

---

## Design Decision: One Gap per Turn

Multi-gap feedback is tempting — the AI can see several holes at once, why not fix them all?

**Cognitive Load Theory** (Sweller, 1988): working memory is ~4 items. Presenting 3+ corrections forces the learner to triage, and they'll pick the easiest to fix — usually the least important. Deep gaps get ignored under batched feedback.

**One gap per turn** forces attention on the single most important issue. It's slower in wall-clock time but faster in real learning.

---

## Design Decision: Priority Ordering

The category order (factual → jargon → causal → mechanism → boundary → analogy → edge) isn't arbitrary:

- **Factual errors** at the foundation make everything above them wrong. Can't reason correctly from a wrong premise.
- **Jargon dodges** create circular definitions — the learner can't make progress if core terms are self-referential.
- **Causal gaps** (the "why") provide motivation that anchors retention (Elaboration Theory, Reigeluth, 1983).
- **Mechanism** is where real understanding lives — step-by-step transparency prevents hand-waving.
- **Boundary** differentiation is how you know you've actually got the concept, not just a vague shape of it.
- **Analogies** need stress-testing but can survive minor flaws.
- **Edge cases** are the polish phase — important but only after the core is solid.

---

## Design Decision: 4-of-5 Mastery Threshold

- 5 of 5 is unreachable. Every concept has more edges than a session can cover.
- 3 of 5 accepts surface understanding.
- 4 of 5 requires breadth (multiple dimensions) without demanding completeness.

The missing criterion is tracked in the log, so the learner knows what they *didn't* cover. This is honest: mastery here means "you're solid enough to build on this," not "you know everything."

---

## Design Decision: Mastery Signals Prioritize Novel Output

The mastery criteria focus on what the learner *produces*, not what they recognize:

- Defining without the term (production, not recognition)
- Explaining the *why* (generation, not recall)
- Walking through mechanisms (construction, not selection)
- Differentiating from adjacent concepts (discrimination, not memorization)
- Handling edge cases (application, not rehearsal)

This aligns with **retrieval practice** research (Roediger & Karpicke, 2006): generation-based practice produces more durable learning than recognition-based practice.

---

## Design Decision: AI Never Gives the Answer

---

### Scaffold After Struggle, Not Before

The skill now permits a small explanatory scaffold, but only after a stuck signal. This borrows the useful part of ELI5 explanation without changing the core learning mechanism.

Allowed stuck signals include repeated same-gap failure, explicit requests like `hint` or `I don't know`, shadow-repeat of a previous answer, and vague hand-waving. The AI may then give one mini ELI5 and one concrete example.

The guardrail is the re-explanation gate: the learner must explain the point again in their own words. A scaffolded answer can show progress, but it is not mastery until the learner handles a fresh angle or stress test without copying the scaffold.

The most important anti-pattern.

If the AI reveals the answer when the learner is stuck, the skill collapses into supervised reading. The learner's job is to produce the explanation; if they can't, the right response is scaffolding, not substitution.

**Scaffolding ladder**:

1. Single keyword hint ("think about *caching*")
2. Everyday analogy prompt ("imagine a library")
3. Mini ELI5 explanation, capped at 60-100 words
4. One concrete example
5. Re-explanation gate in the learner's own words

The later steps are allowed only after struggle or explicit request. Scaffolding is support, not substitution: the learner must still produce the explanation.

---

## Design Decision: Language Mirroring

The AI matches the user's explanation language. Why:

- Cognitive load is already high during Feynman; adding translation load ruins the practice.
- The skill is used globally; forcing English excludes non-English speakers.
- Learning happens in the learner's strongest production language.

Trade-off: the AI must understand multiple languages. All major LLM providers handle this natively as of 2025.

---

## Design Decision: Session Logs as Markdown Files

Not a database, not a stateful service. Plain markdown files in a configurable directory.

- Learners can grep, edit, and share them
- They integrate with existing knowledge systems (Obsidian, Logseq, Zettelkasten, git repos)
- No server, no account, no sync complexity
- Resume is just "read the last round from the file"

---

## Design Decision: Refined Explanation Preserves User Phrasings

At exit, the AI composes a one-paragraph "refined explanation." This could be AI-authored from scratch, but it isn't. It's built from the user's own phrasings across rounds, de-duplicated and polished.

Why: the learner owns the output. Their voice, their concept map. The AI's job is editor, not ghostwriter.

---

## Trade-offs We Accepted

**Slower than passive reading**: a Feynman session can take 20+ minutes for one concept. This is the point — passive reading is fast and shallow; Feynman is slow and deep.

**Emotionally uncomfortable**: getting your explanation picked apart is not fun. We optimize for warmth ("there's a gap" not "you're wrong") but don't remove the discomfort.

**Requires motivated learners**: if the user isn't willing to struggle, the skill won't help. This is a tool for learners who want friction.

**Risk of over-correction**: the AI might nitpick. Mitigation: ONE gap per turn, priority ordering to ensure nitpicks don't surface until major gaps are cleared.

---

## References

- Benjamin, A. S., Bjork, R. A., & Schwartz, B. L. (1998). The mismeasure of memory: When retrieval fluency is misleading as a metamnemonic index.
- Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings.
- Chi, M. T. H. (2009). Active-constructive-interactive: A conceptual framework for differentiating learning activities.
- Dunning, D. (2011). The Dunning-Kruger effect: On being ignorant of one's own ignorance.
- Feynman, R. P. (1985). "Surely You're Joking, Mr. Feynman!"
- Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories.
- Reigeluth, C. M. (1983). Instructional-design theories and models.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning.
- Rozenblit, L., & Keil, F. (2002). The misunderstood limits of folk science: An illusion of explanatory depth.
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning.
- Young, S. (2019). Ultralearning.
