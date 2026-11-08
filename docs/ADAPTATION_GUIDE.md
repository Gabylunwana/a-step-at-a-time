# Adaptation guide

The narrative design makes the programme easy to adapt: the skills stay the same; the story, names, examples and language change to fit the community.

## Process (recommended)

1. **Listen first.** Run a few small group discussions or interviews with people from the target community: how do they describe low mood and stress? What daily activities, sources of support and worries are common?
2. **Adapt** using the checklist below.
3. **Review** with a clinician and two or three community members.
4. **Test** with 5–10 people; watch them use it; fix confusing parts.
5. **Rebuild** the paper workbook (`node tools/build-print.js`).

## Checklist

| What | Where | Notes |
|---|---|---|
| Programme name, organisation | `config.js` | |
| Characters (names, look, short description) | `config.js → characters` | Offer choices (e.g. a woman and a man; different ages). Colours: `skin`, `hair`, `shirt`; `hairStyle`: `wrap`, `bun` or `short`. |
| Guide character & role | `config.js → guide` | Someone trusted locally: health worker, nurse, teacher, faith leader, counsellor. |
| Urgent-help contacts | `config.js → crisis` | **Required.** Verified numbers only. |
| Activity examples | `content.js` Session 1 checklist | Use locally common pleasant and useful activities. |
| Story details | `content.js` story slides | Keep problems general (stress, loss, money, work) so most readers relate. Avoid detailed trauma. |
| Idioms of distress | Signs-of-low-mood slide | Include local expressions people use (e.g. "thinking too much", body aches). |
| Support sources | Session 4 | Family, faith groups, cooperatives, associations, health services. |
| Language | All text in `content.js` | Translate meaning, not word-for-word. Back-translate to check. Keep reading level simple. |

## Translating

Copy `content.js` (e.g. `content.yo.js`), translate the text inside quotes and backticks only — keep `{P}`, `{G}`, the `id` values and the HTML tags (`<p>`, `<strong>` …) unchanged. Then change the script line in `index.html` to point at the new file. Translate the fixed interface words (buttons, check-in questions, urgent-help page) in `assets/js/app.js` — search for the English text.

## Special groups

- **Young people / students:** change settings (exams, family pressure), consider a peer as the guide. Under-18s need safeguarding arrangements and parental/guardian consent rules.
- **Displaced people / adversity:** acknowledge ongoing stressors; emphasise practical support; keep the story free of graphic detail.
- **Low literacy:** use the paper version read aloud by a helper, or record the story slides as audio.
