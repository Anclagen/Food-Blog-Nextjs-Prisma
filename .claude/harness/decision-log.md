# Decision log

Significant decisions made on this project, with context, alternatives
considered, theory grounding, evidence, and confidence. Required
structured field: `why_not_alternatives` (per-alternative rejection
rationale, contrastive XAI).

Empty until the first decision is logged.

---

### Diamond Assessment — 2026-05-15

**Diamond**: L0-001 "Shopping Price Tracker (Norway)"
**Scale**: L0 Purpose | **Phase**: Discover | **Transition evaluated**: Discover → Define

#### Gates (Discover → Define requires: Evidence, Bias, Corrections)

| Gate | Status | Notes |
|------|--------|-------|
| Evidence | PASS | 5 external_human interviews + Kassal API spike + JTBD documented in purpose.yml |
| Bias | INSUFFICIENT EVIDENCE | No formal /bias-check run. Risk noted: all 5 interviews are close social network (homogeneous sample). Mitigation: reached beyond founder's own perspective. |
| Corrections | PASS | 0 corrections in memory — fresh project, nothing to repeat |

#### Confidence
- Current: 0.30 (Anecdotal)
- L0 base threshold (full diamond completion): 0.90
- project_type not set — defaulting to team_startup (multiplier: 1.0); effective threshold: 0.90
- Threshold applies to full completion, not to Discover→Define gate specifically

#### Evidence gaps
- Bias checklist not formally reviewed — run /mycelium:bias-check before progressing
- Social JTBD dimension empty in purpose.yml
- project_type and product_type not set in active.yml
- Workarounds unvalidated (internal_stakeholder only)

#### Trio coverage
- Product: Strong (JTBD, interviews, OST)
- Design: Weak (emotional JTBD present, but no UX experience vision)
- Engineering: Present (Kassal API spike, constraints documented)

#### Recommendation
Near-ready to progress Discover→Define. Run /mycelium:bias-check first, then /mycelium:diamond-progress.

---

### Bias Check — 2026-05-16

**Activity**: Pre-Discover→Define progression for L0-001
**Stage**: L0 Purpose

| Bias | Risk | Mitigation in place |
|------|------|---------------------|
| Confirmation bias / Social desirability | HIGH | Interviews did surface unprompted disagreement; plan wider sample before Define→Develop |
| WYSIATI | HIGH | Sample is homogeneous — document explicit evidence gaps |
| Anchoring | MEDIUM | OST captures deprioritised opps beyond initial frame |
| Optimism bias | MEDIUM | Constraints documented; pre-mortem pending |
| Bandwagon | LOW | Approach is API-specific, not trend-driven |
| Status quo | LOW | N/A — fresh project |

**Agent self-check**: Sycophancy CAUTION (mitigated by devil's advocate sections); others OK.

**Verdict**: Bias gate PASSES with caution. Proceed to Discover→Define. Before Define→Develop, widen interview sample beyond close social network.

**2026-05-16 update — scope clarification**: Target user narrowed to urban households with real store choice. Rural, elderly, and convenience-first shoppers are explicitly out of scope. This lowers confirmation bias from HIGH to MEDIUM — the close-network sample IS representative of the intended v1 audience. Residual open question: loyalty-card-first shoppers (REMA Æ, Coop Extrabonus) may be a second out-of-scope cohort if card savings override price comparison. Confirm boundary with one interview.

**project_type set**: solo_product (building for self + wife primarily; may grow). Effective L0 threshold lowered from 0.90 to 0.765.

---

### Phase Transition — 2026-05-16

**Diamond**: L0-001 | **Transition**: Discover → Define | **Result**: PROGRESSED

**Gate summary**:
| Gate | Result |
|------|--------|
| Evidence | PASS — 5 external interviews, JTBD, API spike |
| Bias | PASS — bias-check run; MEDIUM risks noted and mitigated |
| Corrections | PASS — 0 corrections, nothing to repeat |

**Confidence**: 0.30 → 0.35
Threshold adapted: base 0.90 → effective 0.765 (solo_product, multiplier 0.85). Gap to close: 0.43. Will build during Define and Develop phases.

**Key learnings from Discover**:
- Core pain confirmed 5/5: can't compare store totals without effort
- Substitution need validated: per-item control, not global toggle
- Target audience defined: urban households with real store choice
- Technical spike done: Kassal API bulk pricing endpoint solves rate limit problem
- Open question carried into Define: do loyalty-card-first shoppers fall out of scope?

**Trio perspective coverage at exit**:
- Product: Strong ✓
- Design: Weak (social JTBD empty, no UX experience vision) — address in Define
- Engineering: Present ✓

**Child diamonds**: None spawned yet. L1 Strategy optional for solo_product at this stage.

---

### Diamond Assessment — 2026-05-16 (Define phase)

**Diamond**: L0-001 | **Phase**: Define | **Transition evaluated**: Define → Develop

**Gates**:
| Gate | Status | Notes |
|------|--------|-------|
| Evidence | PASS | purpose.yml fully populated: JTBD (all 3 dimensions), UX vision, savings calibrated, loyalty card scoped |
| Cynefin | PASS | Classified Complicated (core) + Complex element (behavior change). at-001 probe run for complex element. Method match confirmed. |
| Bias | PASS | Ran this session. MEDIUM risks noted and mitigated. |
| Corrections | PASS | 0 entries. |

**Confidence**: 0.35 → 0.42 (Define phase evidence additions: social JTBD, UX vision, loyalty card scope, savings calibration)
Effective threshold: 0.765. Gap remaining: 0.325 — to close during Develop and Deliver phases.

**Anti-patterns checked**: None detected. Marginal solution-first risk noted (code written before Define closed) but grounded in OST evidence.

**Trio coverage**: Product ✓ | Design ✓ (UX vision now complete) | Engineering ✓

**Recommendation**: Ready to progress Define → Develop. Run `/mycelium:diamond-progress`.

---

### Phase Transition — 2026-05-16

**Diamond**: L0-001 | **Transition**: Define → Develop | **Result**: PROGRESSED

**Gates**:
| Gate | Status |
|------|--------|
| Evidence | PASS — purpose.yml fully populated, all JTBD dimensions, UX vision, savings, loyalty card scope |
| Cynefin | PASS — Complicated (core) + Complex element (behavior). Method matched. |
| Bias | PASS — ran this session |
| Corrections | PASS — 0 entries |

**Confidence**: 0.42 (unchanged — no new evidence added at transition)
Threshold adapted: base 0.90 → effective 0.765 (solo_product). Gap: 0.325.
Threshold would increase with: broader interview sample, real usage data, observed behavior change.

**Build-to-learn awareness**: Surfaced. App code already exists — Develop phase is about validating the purpose in real use, not building from scratch.

**Key Define learnings**:
- Scope narrowing early (urban + store choice) reduced bias risk and sharpened evidence validity
- Quantifying expected savings (320-800kr/month) gave the product a concrete success metric
- Social JTBD was a genuine gap — naming it explicitly surfaced it quickly
- Loyalty cards: in scope as users, out of scope as v1 calculation input; future opportunity identified

**Child diamonds**: None spawned. L1 Strategy remains optional for solo_product.

---

### Diamond Assessment — 2026-05-25

**Diamond**: L0-001 "Shopping Price Tracker (Norway)"
**Scale**: L0 Purpose | **Phase**: Develop | **Transition evaluated**: Develop → Deliver

#### Gates (Dev→Del requires: Evidence, Bias, Corrections — BVSSH is Del→Comp only)

| Gate | Status | Notes |
|------|--------|-------|
| Evidence | PASS | 5 external_human interviews (2026-05-15) + Kassal API spike + full JTBD in purpose.yml |
| Bias | PASS | Bias check run 2026-05-16; MEDIUM risks (social desirability, WYSIATI) documented and mitigated |
| Corrections | PASS | 0 entries in corrections.md |
| BVSSH | Pending | Required at Del→Comp only — not a blocker at this transition |

#### Confidence
- Current: 0.42 (Anecdotal)
- Effective L0 threshold (Del→Comp): 0.765 (base 0.9 × solo_product 0.85)
- Gap: 0.325 — next milestone is 0.5 (Data-supported), requires direct real-use testing

#### Evidence gaps
- No real-use validation evidence yet. Develop phase should generate this; broken search has blocked it.
- Engineering gap: Kassal API fuzzy matching constraint (documented in purpose.yml) not yet solved in implementation.
- Design gap: UX vision written but no usability testing of actual app.

#### Anti-patterns
- Process cliff detected: 9 days of unstructured implementation post Define→Develop with no framework check-in.
- Solution-first creep (marginal, previously noted): search implementation got ahead of working end-to-end loop.

#### Trio coverage
- Product: Strong (OST comprehensive — 10 opportunities, 9 solutions with Four Risks)
- Design: Moderate (UX vision present; no usability test of actual app)
- Engineering: Gap (search broken; known fix not implemented)

#### Human pre-assessment (cognitive forcing, recorded before gates run)
User said: "can't remember where I left off, search is broken, focus was narrow — one feature rather than a broader plan."
Assessment comparison: Plan (canvas) is broad; code is narrow — consistent with correct early-stage prioritisation. Broken search traces to documented constraint (no Kassal API fuzzy matching). Context decay after 9 days is real but canvas rebuilds it.

#### Recommendation
Stay in Develop. Fix search (Fuse.js client-side layer or empty-state fallback). Run first real-use session. Document as at-002. Then run /mycelium:bvssh-check before Dev→Deliver.

**Harness thickness (informational)**: 44 skills, 37 guardrails, 4 mandatory reads, 5 hook layers, 12 gates.

---

### Diamond Assessment — 2026-05-29

**Diamond**: L0-001 "Shopping Price Tracker (Norway)"
**Scale**: L0 Purpose | **Phase**: Develop | **Transition evaluated**: Develop → Deliver

#### Gates (Dev→Del requires: Evidence, Bias, Corrections — BVSSH is Del→Comp only)

| Gate | Status | Notes |
|------|--------|-------|
| Evidence | PASS | 5 external_human interviews (2026-05-15) + Kassal API spike + full JTBD in purpose.yml |
| Bias | PASS | Bias check run 2026-05-16; MEDIUM risks documented. No new bias check needed — evidence base unchanged. |
| Corrections | PASS | 0 entries |
| BVSSH | Pending | Del→Comp only — not a blocker here |

#### Confidence
- Current: 0.42 (Anecdotal) — unchanged since 2026-05-16
- Effective L0 threshold: 0.765 (base 0.9 × solo_product 0.85)
- Gap: 0.325 — no new evidence to raise it since last assessment
- What would raise it: one real-use session (at-002), actual savings measured, broader interview sample

#### What's been built (code state 2026-05-29)
- ProductSearch.tsx: text search with debounce + empty-state ("No results — try a shorter word or check your spelling") ✓
- BasketSummary.tsx: per-store basket totals ✓
- ListItem.tsx, lists page, login/register pages ✓
- Latest commit: "fix search, basket totals, and add per-item prices" (748cb85)

#### Critical gap identified
Basket total comparison silently breaks when a product is not available at all stores. If missing items are excluded from per-store totals, the cheapest-store recommendation can be actively wrong (store appears cheaper only because items weren't counted). This is a value proposition bug, not a UX polish item.

#### New scope ideas raised by user (not yet in OST)
- Preferred store selection — logical UX gap, not yet externally validated
- Split-store optimization — explicitly deprioritized in OST (sol-003: "no evidence in 5 interviews"). User now self-reports going to 1–3 stores — sample of 1 (founder). Needs interview round before reprioritizing.
- Scraping Kassal data for substitution training data — not in OST; Kassal ToS compatibility unknown; treat as opportunity to investigate, not a build direction
- Barcode scanner — sol-008, HIGH priority in OST, feasibility confirmed. Usability not tested. Fishfood test needed (scan 20 products in kitchen lighting) before building.

#### Human pre-assessment (cognitive forcing)
User said: "basic search + add to list working; basket total breaks when items missing from some stores; need store prefs, split lists, barcode, substitutions, maybe scraping."
Assessment comparison: Identify with OST — search (sol-009) ✓, basket totals (sol-002) ✓, missing-item gap is real and blocks core value. New scope items are solution-layer thinking; need at-002 first to know what actually blocks the job.

#### Anti-patterns
- Solution-first creep (recurring): user naming 5+ new features before running a single real-use session. Canvas says validate first.
- Process cliff (again): 4 days of implementation without a framework check-in.

#### Trio coverage
- Product: Strong (OST comprehensive, four risks per solution)
- Design: Moderate (UX vision present; actual app never usability tested)
- Engineering: Present (search fixed, basket totals working; missing-item handling unresolved)

#### Recommendation
Stay in Develop. Fix missing-item basket handling first. Then run at-002 (first real Sunday shop). Hold new features until real use tells you what actually blocks the job.

**Harness thickness (informational)**: 44 skills, 37 guardrails, 4 mandatory reads, 5 hook layers, 12 gates — unchanged.

---

### Diamond Assessment — 2026-05-29 (second assessment, same day)

**Diamond**: L0-001 "Shopping Price Tracker (Norway)"
**Scale**: L0 Purpose | **Phase**: Develop | **Transition evaluated**: Develop → Deliver

#### Gates (Dev→Del requires: Evidence, Bias, Corrections)

| Gate | Status | Notes |
|------|--------|-------|
| Evidence | PASS | Unchanged — 5 external_human interviews + Kassal spike + full JTBD |
| Bias | PASS | Unchanged — bias-check 2026-05-16 |
| Corrections | PASS | 0 entries |
| BVSSH | Pending | Del→Comp only |

#### Confidence
- Current: 0.42 (Anecdotal) — unchanged; building features does not move confidence
- Effective threshold: 0.765 (solo_product). Gap: 0.325
- What would raise it: at-002 (real-use session), second interview round

#### Progress since last assessment (same day)
All six L0 Develop items completed and committed:
- Quantity control (+/- UI, basket totals updated)
- Store filter (excluded model, localStorage — bug fixed: was included model, new stores defaulted to hidden)
- Clear checked items
- Silent exclusion warning (EAN-less items)
- Substitution toggles hidden on checked items
- Delete list confirmation

#### Human pre-assessment
User said: "store filtering working; items with no recent price data show nothing — does Kassal provide discontinued filtering?"
Kassal finding: no discontinued flag. Proxy: current_price: null. No API-side filter available. Client-side filter on search results (current_price !== null) is the lever.

#### Anti-patterns
- Solution-first creep flagged for the third time. Now a pattern. 13 days since interviews; zero real-use sessions. Each assess cycle adds a new edge case instead of running the shop.

#### Trio coverage
- Product: Strong
- Design: Moderate (UX vision exists; zero usability testing of actual app)
- Engineering: Strong (all six items done, filter bug fixed)

#### Recommendation
Optional: filter search results on current_price !== null (10-min fix). Then run at-002 — one real Sunday shop. No more features. At-002 is the only path to confidence increase.

**Harness thickness**: 44 skills, 37 guardrails, 4 mandatory reads, 5 hook layers, 12 gates — unchanged.
