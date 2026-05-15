---
name: product-journal
description: Running product learning log — what changed, what we learned, what surprised us at each phase transition
metadata:
  type: project
---

# Product Journal — Shopping Price Tracker (Norway)

---

## 2026-05-16 — L0 Discover complete, entering Define

**What we know now that we didn't at the start:**

The core job is clearer than expected: the real pain is the *decision* of which store to visit, not just the per-item price lookup. People already know roughly which store is cheaper — they just can't get a basket-level total without effort. The app's primary value is removing that friction, not educating them about prices they already sense.

Substitution was the biggest open question at the start. 5/5 interviews confirmed it's wanted, but the shape of the answer surprised us: it's not a global on/off, it's per-item. "Allow any brand of eggs but this specific yoghurt brand only." That's why we built the three-state toggle rather than a checkbox.

**Scope clarification that happened mid-session:**
The intended v1 audience narrowed to urban households with multiple store options nearby. Rural and elderly users are out of scope — not because they don't have the pain, but because the comparison is less actionable for them (fewer choices). This made the interview sample less concerning from a bias perspective.

**The social JTBD dimension is still blank.** Nobody was explicitly asked "is there a shared/social aspect to this?" Worth one question next time.

**Social JTBD and UX vision filled in (2026-05-16):**

Social dimension: shared household list — both partners see and contribute, check off in-store in real time, no doubling up. The "which store this week?" answer becomes jointly visible rather than whoever thought about it hardest.

UX vision: Sunday planning → scan/search → basket summary shows cheapest store → share list with partner → shop together or separately with shared real-time checkoff → come home having spent what you expected, no prices held in memory.

Confirmed by user. Clarifications:
- Real-time sync (live simultaneous updates) is v2, not v1. Shared list both can read/update is sufficient for v1.
- Savings calibration: 80-200kr per weekly shop (40-50 items, no offers), 320-800kr/month. This is a meaningful household outcome and should drive the success metric definition.

**Define gaps — all resolved 2026-05-16:**
1. Social JTBD ✓ — shared list, both partners contribute and check off, real-time sync deferred to v2
2. UX experience vision ✓ — Sunday planning → cheapest store confirmed → shared list → shop → 320-800kr/month saved
3. Loyalty card scope ✓ — IN scope (cards don't override store choice, just add perks). V1 excludes loyalty point calculation; v2 opportunity to add "effective price after loyalty return."

**Define is complete. Progressed to Develop 2026-05-16.**

**What Define produced that Discover didn't:**
- A concrete success metric: 320-800kr/month household savings
- A UX vision grounded in a real scenario, not just a functional statement
- A complete JTBD including the social dimension (shared list, shared decision)
- A scope boundary that holds up: urban, multi-store, not loyalty-card-locked, not price-insensitive
- A v1 vs v2 split on real-time sync — keeps v1 buildable

**Develop focus**: Use the app. Observe whether the purpose holds in practice. The biggest unknown is behavior change — will seeing the basket summary actually cause you to choose a different store than you would have by habit?

---
