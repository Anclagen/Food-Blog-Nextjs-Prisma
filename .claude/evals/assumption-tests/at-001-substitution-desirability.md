# Assumption Test: at-001
# Substitution feature desirability

## Target assumption
Users want the app to suggest cheaper equivalent products from other brands
when a better price exists — rather than just showing the cheapest price for
their exact item.

**Type:** Desirability
**Diamond:** L0-001 (Shopping Price Tracker)
**Status:** Designed — not yet run
**Designed:** 2026-05-15

## Hypothesis (Gothelf Lean UX)
We believe that offering product substitution suggestions for Norwegian
household shoppers will help them reduce their grocery bill without extra effort.
We will know we are right when at least 3 of 5 interviewed shoppers describe
past instances of brand-switching for commodity items AND say they'd welcome
an app prompt to do so — AND when fewer than 2 of 5 express concern about
the app overriding their specific preferences.

## Method
3–5 user interviews, ~15 minutes each.
Participants: Norwegian household shoppers (friends, family, colleagues).

## Interview guide
1. "Tell me about the last time you bought a different brand of something
   because it was cheaper — what was the product, and what happened?"
2. "Are there products on your shopping list where you genuinely don't care
   which brand you get, as long as the price is right?"
3. "If an app told you 'the own-brand version at Rema is 40% cheaper and
   nutritionally identical' — would you want to see that, or would you find
   it annoying?"

## Your prediction (fill in before running)
[ What do you expect to hear, and why? ]

## Success criteria
- 3+ of 5 describe past brand-switching for commodity items
- 3+ say they'd welcome an app substitution prompt
- <2 express concern about the app overriding specific preferences

## Failure / pivot signal
Most shoppers say they don't switch brands, OR feel suggestions would feel
intrusive. If so: drop substitutions from v1. Ship price-comparison for exact
items only. Revisit only if post-launch users request it.

## Results

**P1 (wife):** Substitutions welcome for raw/commodity items (eggs, milk, meat).
Not wanted for specific branded items. Wants per-item toggle to disable
substitutions when building cheapest-by-store lists.

**P2 + P3 (wife's sister and partner):** Same as P1. Added: need a
"no store brand" flag per item — finer-grained than just "no substitutions."

**P4 + P5 (friends/family):** Raised dietary needs / allergy filtering for
substitutions. Mentioned preferred brands and disliked brands. Also surfaced
unit price comparisons (price per 100g/ml) and bulk buy suggestions.

**Additional signals (unprompted, worth tracking as opportunities):**
- Per-item substitution toggle (commodity vs. specific)
- "No store brand" flag
- Preferred / disliked brand lists
- Dietary/allergy filters on substitutions
- Unit price (price per weight/volume) comparison
- Bulk buy suggestions

## Outcome
**validated** — with important nuance. Substitutions are wanted but per-item
control is essential. The feature is real; the design is "opt-out per item"
not "opt-in globally."

Confidence delta: +0.15 (5 external human participants, consistent signal)
New confidence: 0.30
Canvas updates: purpose.yml (JTBD emotional added, validated: true on functional),
               active.yml (confidence 0.15 → 0.30, source_class updated),
               at-001 (this file)
