# One Step at a Time

A five-session guided self-help programme for adults with low mood and stress. It follows the structure of WHO's *Step-by-Step* model — an illustrated story of a person learning to cope, taught by a trusted helper character, with practice between sessions — but all text, illustrations and code here are original.

> ⚠️ **Before you give this to anyone:** fill in the urgent-help numbers in `assets/js/config.js` (see "Setup" below), and read `docs/SAFETY_PROTOCOL.md`.

## What's inside

```
one-step-at-a-time/
├── index.html                  ← open this to use the guide
├── assets/
│   ├── js/config.js            ← names, characters, helper, URGENT HELP numbers
│   ├── js/content.js           ← all session text and exercises
│   ├── js/app.js               ← the app (no changes needed)
│   ├── css/style.css
│   └── img/icon.svg
├── print/workbook.html         ← paper version — open and print / save as PDF
├── tools/build-print.js        ← regenerates the paper version after edits
└── docs/
    ├── PROGRAMME_OVERVIEW.md   ← session-by-session outline and rationale
    ├── HELPER_GUIDE.md         ← weekly 15-minute support call scripts
    ├── SAFETY_PROTOCOL.md      ← what to do when someone is at risk
    └── ADAPTATION_GUIDE.md     ← how to adapt language, culture, characters
```

## The programme

| | Session | Core skill |
|---|---|---|
| 0 | Getting started | Choose a companion, weekly check-in, name problems, notice strengths |
| 1 | Understanding how you feel | Low-mood cycle, behavioural activation, planning small activities |
| 2 | Managing stress and doing more | Reviewing the plan, breaking tasks down, slow breathing |
| 3 | Kinder thoughts and your strengths | Positive self-talk, past coping, personal mantra |
| 4 | Connecting with others | Types of support, one small step to reconnect |
| 5 | Staying well | Progress review, warning signs, staying-well plan |

Each session ≈ 30 minutes; one per week. Every session opens with a check-in (mood, daily functioning, stress, and a suicidal-thoughts question that triggers an urgent-help message).

## Features

- Works **offline** — no internet, no server, no accounts. Opens from a phone or computer.
- Answers save **only on the device** (browser storage). Readers can download or delete them (*About & your data*).
- Sessions unlock in order; *My toolbox* collects breathing timer, current plan, kinder thoughts, strengths and staying-well plan.
- *Workbook* page compiles everything the reader wrote — printable / save as PDF.
- Mobile-first, large touch targets, dark mode, reduced-motion support.
- Paper workbook for people without smartphones or for group use.

## Setup

1. Open `assets/js/config.js` in any text editor (Notepad works).
2. **Required:** fill in `crisis.emergencyNumber` and add at least one verified helpline to `crisis.lines`. Call each number yourself before release. Until you do, the app shows a generic "contact local emergency services" message.
3. Optional: set `organisation`, rename characters, turn on `helper.enabled` and add helper contact details.
4. If you edited content or config, rebuild the paper version: `node tools/build-print.js` (needs Node.js).
5. Test it: open `index.html`, go through Session 0 and the urgent-help page.

## Ways to deliver

- **Phone/laptop, offline:** copy the folder onto the device and open `index.html` in Chrome/Firefox/Safari.
- **Website:** upload the whole folder to any static host (Netlify, GitHub Pages, your own server). No backend needed.
- **Guided (recommended):** pair with a trained non-specialist helper for weekly 15-minute calls — see `docs/HELPER_GUIDE.md`. Research on this model shows guided delivery is more effective than unguided.
- **Paper / groups:** print `print/workbook.html`.

## Important

This is a self-help tool, not treatment, and has not itself been tested in a trial. It is designed for adults with mild-to-moderate low mood. It is **not** suitable as the only support for people at risk of suicide, with psychosis, severe depression, or trauma needing specialised care. If you deploy it as a service, have a mental-health professional supervise helpers and review the content for your setting.

Reference: Carswell K. et al. (2018). *Step-by-Step: a new WHO digital mental health intervention for depression.* mHealth 4:34. WHO's own Step-by-Step materials are available on request from WHO (psych_interventions@who.int).
