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
