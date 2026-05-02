---
concept: Transformer attention mechanism
status: mastered
rounds: 5
language: en
started: 2026-03-22T14:00:00
updated: 2026-03-22T15:10:00
domain: science
---

# Example Session: Transformer Attention Mechanism

A harder concept, needing 5 rounds. Shows how `[broken-analogy]` and `[boundary-blur]` surface in scientific explanations.

---

## Round 1

**Explanation:**
> Attention in transformers is how the model decides which words to pay attention to. It's like how when you read a sentence, you focus on the important words. The model learns which words matter for each word.

**AI Response:**

```
✅ The "focusing on important words" framing captures the intuition.

🔍 [mechanism-blackbox] spot:
> "the model learns which words matter"

"Learns which matters" is doing all the work. Models don't have opinions — they do math.

💬 What is the actual mathematical operation that produces this "attention"?
```

---

## Round 2

**Explanation:**
> OK. Each word gets converted to three vectors: query, key, value. To compute attention for a word, you take its query, dot-product it with every other word's key, and that gives you scores. Then you softmax the scores to get weights, and use those weights to sum up the value vectors. That's the output for that word.

**AI Response:**

```
✅ That's the core computation — Q·K → softmax → weighted sum of V. Clean.

🔍 [causal-gap] spot:

Why THREE vectors? Why not just use the word embedding directly and dot-product word-with-word?

💬 What does separating query, key, and value buy you?
```

---

## Round 3

**Explanation:**
> Hmm. If you just did word-with-word, every word pair would have a fixed relationship. But Q/K/V are learned projections of the original embedding, so the model can learn different "views" of each word — what it's looking for (Q), what it advertises to others (K), and what information it contributes (V). A single word can look for different things than it offers.

**AI Response:**

```
✅ "Different views of the same word" — Q asks, K advertises, V contributes. That's it.

🔍 [broken-analogy] check:

Your earlier analogy was "focusing on important words like when you read." Stress-test it:

💬 When YOU read, your attention is unidirectional — you look at the word in front of you. In transformers, attention is computed for all pairs simultaneously. How does your analogy handle that parallelism?
```

---

## Round 4

**Explanation:**
> Right, the reading analogy breaks. A better framing: imagine you're in a meeting. Every person simultaneously has a question (Q), something they're willing to share (K/advertisement), and actual content (V). Everyone broadcasts their Q, checks it against everyone's K to decide who to listen to, and mixes the V values by those weights. It's parallel, not sequential. And unlike meetings, transformers have "multi-head attention" — multiple simultaneous meetings in parallel, each learning different relationship patterns.

**AI Response:**

```
✅ The meeting analogy is much better — it captures parallelism AND the Q/K/V roles.

🔍 [boundary-blur] probe:

You mentioned multi-head attention at the end. Stress-test:

💬 How is multi-head attention different from just making the Q/K/V vectors larger? Why split into heads?
```

---

## Round 5

**Explanation:**
> If you made Q/K/V larger, you'd still have one attention pattern per layer. With multi-head, you split the embedding dimension into H heads, compute attention independently in each head, then concatenate. Each head can specialize — one might track syntactic relationships, another semantic, another positional. It's a form of ensembling inside a single layer. Making vectors larger doesn't create independence between patterns; splitting into heads does.

**AI Response:**

```
🎯 You've got it. Transformer attention is solid.

Evidence:
- ✅ Term Independence: explained without circular "attention = focusing" definitions
- ✅ Causal Chain: Q/K/V exist to give each word "different views" (asker, advertiser, contributor)
- ✅ Mechanism Transparency: Q·K → softmax → weighted sum of V, walked through fully
- ✅ Boundary Differentiation: multi-head ≠ bigger vectors (independence vs size)
- ✅ Stress-Test: handled multi-head edge case correctly

All 5 criteria met.

Push into positional encoding next, or wrap up?
```

**User**: "Wrap up."

---

## Refined Explanation

Transformer attention is a parallel computation over all pairs of tokens in a sequence. Each token is projected into three vectors — query, key, and value — via learned linear maps of its embedding. To compute the attended representation for a token, you take its query, dot-product it with every token's key to produce scores, apply softmax to get a distribution of weights, and compute a weighted sum of the value vectors. The Q/K/V split lets a single token have different "views" of itself: what it's looking for (Q), what it advertises (K), and what information it contributes if chosen (V). Multi-head attention splits the embedding dimension into H independent heads; each head computes its own attention pattern and the results concatenate. This differs from simply using larger vectors because splitting into heads forces independence between the learned patterns — one head might track syntax, another semantics, another position.

## Gap History

1. `[mechanism-blackbox]`: "model learns which matters" hid the actual math
2. `[causal-gap]`: Q/K/V presented without explaining why three are needed
3. `[broken-analogy]`: reading analogy couldn't explain parallelism
4. `[boundary-blur]`: multi-head vs larger-vectors distinction surfaced

## Related Notes

- Positional encoding (necessary counterpart to attention)
- Self-attention vs cross-attention
- Scaled dot-product: why the `/sqrt(d_k)` scaling

## Next Concepts to Explore

- Positional encoding (attention alone is permutation-invariant)
- Why masked attention in decoder-only models
- FlashAttention (memory-efficient attention computation)
