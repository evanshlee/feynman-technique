# Mastery Criteria

The AI declares mastery when **4 of 5** criteria are satisfied during the session. This is a deliberate threshold: requiring all 5 is too strict (any concept has some edge the learner hasn't touched), while 3 of 5 is too lenient.

---

## The 5 Criteria

### 1. Term Independence

**Signal**: User can define the core term without using the term itself or any morphological variant.

**Test**: Ask "Explain this without using the word [term]."

**Fail example**:
> "Recursion is when a function calls itself recursively."

**Pass example**:
> "A function that breaks a problem into smaller versions of the same problem, solves the smallest case directly, and combines results on the way back up."

---

### 2. Causal Chain

**Signal**: User explains *why* the concept exists — the problem it solves.

**Test**: "What specifically breaks if this didn't exist?"

**Fail example**:
> "HTTPS encrypts web traffic."

**Pass example**:
> "Without HTTPS, anyone on the network path — your ISP, a coffee shop WiFi operator, a government — can read or modify your traffic. HTTPS exists to make that attack expensive by proving the server is who it claims to be and encrypting the payload."

---

### 3. Mechanism Transparency

**Signal**: User walks through the steps without black boxes or passive voice. Every "and then..." step names *who* does *what*.

**Test**: Force step-by-step: "Walk me through what happens, step by step, who does what."

**Fail example**:
> "The user logs in and gets authenticated."

**Pass example**:
> "The user submits email + password to the server. The server hashes the password, compares it against the stored hash for that email, and if they match, generates a signed JWT containing the user ID and expiry. The server returns the JWT. The client stores it in an HttpOnly cookie. On future requests, the client sends the cookie; the server verifies the signature and expiry before trusting the user ID claim."

---

### 4. Boundary Differentiation

**Signal**: User distinguishes the concept from at least one adjacent concept, unprompted or when asked.

**Test**: "How is this different from [adjacent concept]?"

**Fail example**:
> "Async/await makes code asynchronous."
> AI: "So do Promises. What's different?"
> User: "Um, async/await is newer?"

**Pass example**:
> "async/await is sugar over Promises — it lets you write async code in the shape of synchronous code, so error handling works with try/catch and control flow reads top-to-bottom. Promises still exist underneath; async/await just makes them readable for non-trivial flows."

---

### 5. Stress-Test Pass

**Signal**: User successfully handles at least one edge case, "what if" scenario, or non-happy-path input.

**Test**: Present a realistic edge case and ask what the concept predicts.

**Fail example**:
> Edge case: "What if the list is empty?"
> User: "Uh, it would crash I guess?"

**Pass example**:
> Edge case: "What if the JWT is expired?"
> User: "The server checks the `exp` claim during signature verification. If expired, the verification still passes cryptographically, but the server rejects the token and returns 401. The client should then use a refresh token to get a new JWT, or redirect to login if the refresh token is also expired."

---

## Tracking During a Session

The AI should internally track which criteria each turn has satisfied:

```
Round 1: User explained "DNS is a phone book"
  ✅ Criterion 2 (causal) — mentioned "humans can't remember IPs"
  ❌ Criterion 1, 3, 4, 5

Round 2: User explained the recursive resolution path
  ✅ Criterion 3 (mechanism) — walked through root → TLD → authoritative
  ❌ Criterion 1 (still using "DNS" to define DNS), 4, 5

Round 3: User distinguished DNS from other name systems
  ✅ Criterion 4 (boundary) — contrasted DNS vs hosts file vs service discovery
  Total: 2, 3, 4 satisfied. Need one more.

Round 4: User handled cache poisoning edge case
  ✅ Criterion 5 (stress-test)
  Total: 2, 3, 4, 5 = 4 of 5. MASTERY.
```

---

## Scaffold-adjacent Evidence

If the AI gave a mini ELI5 or concrete example, the learner's next answer is provisional evidence only.

Do not count that answer as mastery for the scaffolded criterion unless one of these happens:

1. The learner explains the same point from a fresh angle without reusing the AI phrasing.
2. The learner handles a new stress test correctly.
3. The learner distinguishes the concept from an adjacent concept not covered in the scaffold.

This prevents copied wording from being treated as understanding. The session log should still record the progress, but the mastery counter waits for independent production.

## Mastery Announcement

Once 4 of 5 are met, announce:

```
🎯 You've got it. [concept] is solid.

Evidence:
- ✅ [Term Independence]: [paraphrase user's definition]
- ✅ [Causal Chain]: [paraphrase the why they gave]
- ✅ [Mechanism Transparency]: [the step-by-step they walked through]
- ✅ [Stress-Test Pass]: [the edge case they handled]

Wrap up, or push deeper?
```

Wait for user confirmation. If "wrap up" → Exit protocol. If "deeper" → probe the missing criterion.

---

## Why 4 of 5?

- **5 of 5 is too strict**: any concept has infinite edges. Requiring all 5 makes mastery unreachable.
- **3 of 5 is too lenient**: allows "I kinda get it" to count as mastery.
- **4 of 5 forces depth**: requires the learner to demonstrate understanding on multiple dimensions, not just one lucky turn.

The missing criterion should be noted in the session log so the user knows what they skipped. It's not a failure, it's a honest map.

---

## Edge Cases

### User claims mastery before AI agrees

> User: "I'm done, I get it."
> AI: [has only 2 of 5 criteria met]

**Response**: Honest mirror, not blocking.

```
Two of the five criteria are solid: [X] and [Y]. Three are untested: [A], [B], [C].

Want to stress-test those, or wrap up here as partial coverage?
```

User is allowed to stop at any time — but the log should reflect what was vs wasn't covered.

### AI claims mastery but user disagrees

> AI: "Mastery detected."
> User: "Honestly I'm still confused about X."

**Response**: Respect user. Re-enter loop on X. Mastery was a read signal, user knows themselves best.

### Session has many rounds but user keeps stumbling

After ~10 rounds with no criteria being satisfied, suggest:

```
We've been in this loop for 10 rounds. The concept might need a different starting point. Options:
1. Read a short primer first, then come back
2. Break the concept into smaller pieces (e.g., start with [sub-concept])
3. Pause this session and resume later
```

This isn't giving up — it's recognizing when the Feynman loop isn't the right tool yet.
