---
concept: JWT signature verification
status: mastered
rounds: 4
language: en
started: 2026-03-20T10:00:00
updated: 2026-03-20T10:38:00
domain: coding
---

# Example Session: JWT Signature Verification

A real-style session showing the loop from confused first explanation to mastery across 4 rounds.

---

## Round 1

**Explanation:**
> A JWT is a token the server gives you when you log in. It's signed so nobody can fake it. The server checks the signature to make sure it's valid.

**AI Response:**

```
✅ You nailed the high-level role: "token after login, signed, server checks it."

🔍 [mechanism-blackbox] spot:
> "it's signed so nobody can fake it"

That's the claim, not the mechanism. What actually prevents faking?

💬 Walk me through what the server does with the signature when a request comes in.
```

**Gap:** `[mechanism-blackbox]` – "signed" does no work; the cryptographic step is hidden.

---

## Round 2

**Explanation:**
> OK so the server has a secret key. When it creates the JWT, it uses the secret to generate the signature. When a request comes back, the server re-generates the signature using the same secret and compares. If they match, the token is valid.

**AI Response:**

```
✅ That's the right shape — "regenerate and compare" is the core idea.

🔍 [causal-gap] spot:
> "uses the secret to generate the signature"

What's in the signature? If the server just generates a signature from a secret, it would be the same every time for every user. That can't be right.

💬 What data, besides the secret, goes into the signature computation?
```

**Gap:** `[causal-gap]` – the signature has to bind to the payload, but user didn't say that.

---

## Round 3

**Explanation:**
> Oh right. The signature is over the header and the payload. So the server takes (header + payload + secret), runs HMAC, and that's the signature. When verifying, it does the same computation from the incoming header+payload using its secret, and compares. If anyone changes the payload, the signature won't match.

**AI Response:**

```
✅ That's it — signature binds to the exact payload. Tampering breaks the match.

🔍 [edge-case-blind] probe:

Good mechanism. Now stress-test it.

💬 What if the JWT is valid but expired? Does the signature check catch that?
```

**Gap:** AI probes `[edge-case-blind]` to trigger mastery criterion 5.

---

## Round 4

**Explanation:**
> No, the signature still matches for an expired token — the `exp` claim is inside the signed payload, so it's signature-valid, but the server needs a separate check: verify signature passes, THEN check `exp` against current time. If expired, reject with 401 even though cryptographically it's fine. The client then uses the refresh token to get a new JWT.

**AI Response:**

```
🎯 You've got it. JWT signature verification is solid.

Evidence:
- ✅ Term Independence: explained JWT without circular "token" definitions
- ✅ Causal Chain: signature exists to bind payload to server's secret
- ✅ Mechanism Transparency: HMAC over (header + payload) using secret, regenerate to verify
- ✅ Boundary Differentiation: signature check ≠ expiry check (two separate steps)
- ✅ Stress-Test: handled expired token edge case correctly

All 5 criteria met.

Wrap up, or push into refresh tokens next?
```

**User**: "Let's wrap up."

---

## Refined Explanation

A JWT is a signed token the server issues after authentication. The signature is an HMAC (or RSA/ECDSA signature) computed over the token's header and payload using a secret only the server knows. When the client sends the JWT on future requests, the server re-computes the signature from the received header and payload using its secret; if it matches the attached signature, the payload hasn't been tampered with. Signature verification alone isn't enough — the server must separately check the `exp` claim inside the payload against the current time, because a cryptographically-valid token can still be expired. If expired, the server rejects with 401, and the client uses a refresh token to obtain a new JWT.

## Gap History

1. `[mechanism-blackbox]`: "signed" used as a claim instead of a mechanism
2. `[causal-gap]`: signature described without the payload it binds to
3. `[edge-case-blind]`: triggered to verify mastery criterion 5

## Related Notes

- [HMAC vs RSA for JWT signatures](#) – signature algorithm trade-offs
- [Refresh token rotation](#) – the natural follow-up topic
- [JWT vs session cookies](#) – `[boundary-blur]` worth exploring next

## Next Concepts to Explore

- Refresh token rotation and revocation
- JWT vs opaque tokens (trade-offs)
- HMAC vs RSA for signatures (symmetric vs asymmetric trust models)
