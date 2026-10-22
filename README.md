# Planora AI — GenAI Event Planning Assistant

[![Test Suite: 20/20 Passed](https://img.shields.io/badge/Tests-20%2F20%20Passed-emerald.svg)](#test-verification)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](#architecture--tech-stack)
[![Vite: 8.3+](https://img.shields.io/badge/Vite-8.3%2B-purple.svg)](#quick-start)
[![Dual-Engine AI: Cloud%2BLocal](https://img.shields.io/badge/GenAI-Dual--Engine%20(Local%20%2B%20Gemini)-indigo.svg)](#genai-architecture--dual-mode-resilience)

> **Planora AI** is an intelligent, context-aware GenAI event planning assistant engineered to help users organize weddings, milestone birthdays, community festivals, and celebrations. It turns high-level visions into actionable, financially rigorous event plans with dynamic budgets, backward-scheduled milestone timelines, vendor quote comparison engines, and personalized day-of run-of-show schedules.

---

## 1. Problem Statement & Target Audience

Planning significant life events—whether a 300-guest heritage wedding, a milestone 30th birthday lounge bash, or a 450-person community cultural fair—is notoriously stressful, fragmented, and vulnerable to budget blowouts. Planners struggle with:
1. **Financial Opacity**: Disjointed line items without clear cost-per-guest benchmarks, arbitrary allocations, and missing contingency buffers.
2. **Timeline Desynchronization**: Deadlines that drift when event dates shift, leading to last-minute vendor scrambles and premium overtime fees.
3. **Vendor Evaluation Paralysis**: Inability to compare competing proposals with explicit trade-offs and inclusions.
4. **Fragile AI Experiences**: Generic chatbot assistants that invent fabricated prices or fail completely when API keys or internet connections are missing.

### Target Users
- **Couples & Families**: Organizing multi-ceremony weddings requiring cultural sensitivity, dietary categorization, and detailed guest logistics.
- **Milestone Celebrators**: Individuals planning landmark birthdays, anniversaries, or reunions on focused budgets.
- **Civic & Community Organizers**: Neighborhood associations coordinating festivals, art fairs, and charity galas requiring accessibility, permits, and waste sustainability directives.

---

## 2. Key Features & Differentiators

| Core Capability | Implementation in Planora AI | Key Differentiator |
|---|---|---|
| **1. Personalized Intake Wizard** | 3-step smart onboarding capturing event type, target date/timeframe, location/venue, currency (INR default, USD, EUR, GBP), guest headcount, setting (indoor/outdoor/hybrid), theme palette, top priorities, dietary & accessibility needs. | Includes 1-click presets for **Royal Indian Wedding**, **30th Neon Birthday**, and **Greenwood Cultural Fair** for instant exploration. |
| **2. Context-Aware AI Assistant** | Conversational copilot with event state memory. Detects natural language mutations (e.g., *"Change budget to 20L"*, *"We now have 180 guests"*, *"Shift date to 2026-11-20"*) and immediately updates dashboards. | **Dual-Engine Design**: Functions 100% offline via a deterministic local rules engine, with optional live Google Gemini LLM integration. |
| **3. Intelligent Budget Planner** | Event-type category templates, line-item tracking, actual vs. estimated spending, cost-per-guest metrics, configurable contingency reserve (5–20% slider), and over-allocation warnings. | **AI Saving Recommendations with Trade-Offs**: Suggests tangible savings (e.g. seasonal florals, interactive live counters) with an instant *"Apply Saving"* action button. |
| **4. Dynamic Event Timeline** | Backward scheduling from target event date, grouping milestones into 7 chronological phases (6+ mo, 3–6 mo, 1–3 mo, 2–4 wk, week-of, day-of, post-event). | **Real-Time Date Shifter**: Changing the target event date instantly recomputes all upstream booking deadlines and updates overdue flags. |
| **5. Smart Vendor Checklist** | Industry-standard role recommendations, booking lifecycle pipeline (`Researching`, `Shortlisted`, `Contacted`, `Booked`, `Declined`), and target budget benchmarks. | **Quote Comparison Engine**: Compare multiple vendor quotes side-by-side with inclusions, pros, cons, and preferred quote tagging. |
| **6. Personalized Concepts & Run-of-Show** | Curated themes with color accents and effort ratings, catering architecture with dietary protocols, entertainment ideas, and weather safeguards. | **Master Run-of-Show**: Complete hourly event-day schedule with locations, activities, and operational lead assignees. |
| **7. Multi-Event Persistence & Export** | Isolated browser `localStorage` persistence, JSON plan backup import/export, and a print-optimized master brief. | Clean `@media print` stylesheet for generating PDF or paper executive summaries. |

---

## 3. GenAI Architecture & Dual-Mode Resilience

A core engineering priority of Planora AI is **reliable, production-grade autonomy**. It never leaves the user with an empty screen or broken API error:

```
                      ┌───────────────────────────────────────┐
                      │        User Query / Intake Plan       │
                      └──────────────────┬────────────────────┘
                                         │
                        Is Gemini API Key Configured?
                                         │
                         ┌───────────────┴───────────────┐
                     YES │                               │ NO / Unset
                         ▼                               ▼
      ┌────────────────────────────────────┐ ┌────────────────────────────────────┐
      │      Gemini 1.5/2.0 Flash Call     │ │  Deterministic Local Engine        │
      │   - Bounded 12s timeout            │ │  - Indian amount parser (lakhs/k) │
      │   - Strict error boundaries        │ │  - Financial feasibility checks   │
      │   - Structured prompt injection    │ │  - Trade-off & saving heuristics   │
      └──────────────────┬─────────────────┘ └─────────────────┬──────────────────┘
                         │ API error / timeout                 │
                         └──────────────► Fallback ────────────┤
                                                               ▼
                                             ┌────────────────────────────────────┐
                                             │  Structured Planora Response       │
                                             │  - Fact vs. Estimate vs. Suggestion│
                                             │  - Action Trigger (Budget/Date)    │
                                             │  - Transparent Mode Disclosure     │
                                             └────────────────────────────────────┘
```

### Fact vs. Estimate vs. Assumption Transparency
Planora strictly labels information types:
- **User Facts**: Confirmed dates, user-entered guest counts, and hard budget caps.
- **Estimates**: Calculated category allocations, benchmark quotes, and cost-per-guest metrics.
- **Assumptions**: Baseline vendor rates and standard backward-planning lead times.
- **Suggestions**: Menu flows, lighting adjustments, and cost-saving alternatives.

---

## 4. Architecture & Tech Stack

- **Frontend Core**: React 19 + TypeScript (Strict typing across all domain models)
- **Bundler & Dev Server**: Vite 8.3 (Sub-second HMR and production bundle optimization)
- **Styling**: Vanilla CSS Design System with accessible HSL/HEX color tokens, glassmorphic cards, fluid typography, dark mode support, and print media queries
- **Icons**: Lucide React
- **Testing**: Vitest 3.2 (Unit and integration suites covering domain calculations)
- **Persistence**: Browser LocalStorage with validation and schema guards

### Directory Layout
```
d:/work/c5/
├── src/
│   ├── __tests__/                     # Automated test suites
│   │   ├── aiProvider.test.ts         # Fallback & mode disclosure tests
│   │   ├── budgetCalculator.test.ts   # Line item math, overruns, savings
│   │   ├── localPlannerEngine.test.ts # Intent parser, amount parser, actions
│   │   ├── persistence.test.ts        # Schema validation, demo loader
│   │   └── timelineEngine.test.ts     # Date math, deadline shifts, overdue
│   ├── components/
│   │   ├── Assistant/AssistantTab.tsx # Conversational AI interface
│   │   ├── Budget/BudgetTab.tsx       # Interactive budget manager & line items
│   │   ├── Export/PrintableReport.tsx # Print & PDF master brief
│   │   ├── Header.tsx                 # Brand, plan switcher, demo menu, AI badge
│   │   ├── Ideas/IdeasTab.tsx         # Themes, menu, weather, run-of-show
│   │   ├── Intake/IntakeModal.tsx     # 3-step event creation wizard
│   │   ├── Navigation.tsx             # Semantic tab navigation
│   │   ├── Overview/OverviewTab.tsx   # Executive KPIs and action alerts
│   │   ├── Settings/SettingsModal.tsx # Multi-event manager & API config
│   │   ├── Timeline/TimelineTab.tsx   # Milestone tasks & date shifter
│   │   └── Vendors/VendorsTab.tsx     # Vendor pipeline & quote comparison
│   ├── context/
│   │   └── PlanoraContext.tsx         # Centralized immutable state manager
│   ├── data/
│   │   └── demoPlans.ts               # Factory presets (Wedding, Birthday, Community)
│   ├── engine/
│   │   ├── aiProvider.ts              # Unified Gemini + Local AI interface
│   │   ├── budgetCalculator.ts        # Pure calculation engine for budgets
│   │   ├── ideasEngine.ts             # Tailored concept & schedule generator
│   │   ├── localPlannerEngine.ts      # Deterministic heuristic planning engine
│   │   ├── timelineEngine.ts          # Backward scheduling & overdue logic
│   │   └── vendorEngine.ts            # Supplier pipeline generator
│   ├── types/
│   │   └── index.ts                   # Strict TypeScript domain interfaces
│   ├── App.tsx                        # Root layout coordinator
│   ├── index.css                      # Design system tokens and print rules
│   └── main.tsx                       # React DOM entry point
├── .env.example                       # Environment template
├── .gitignore                         # Strict exclusion rules (<10 MB repository)
├── index.html                         # Semantic HTML5 entry with metadata
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript root config
└── vite.config.ts                     # Vite build configuration
```

---

## 5. Quick Start & Setup

### Prerequisites
- Node.js `v18+` (Tested on `v24.14.0`)
- npm `v9+` (Tested on `v11.9.0`)

### Installation & Local Run
```bash
# 1. Clone or navigate to the repository
cd d:/work/c5

# 2. Install dependencies (minimal, under 100 packages)
npm install

# 3. Start development server
npm run dev
```
Open **`http://localhost:5173/`** in your browser. The application loads with pre-configured demo events ready for evaluation.

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. Environment Configuration

Planora AI functions out of the box with **zero configuration required**. 

If you wish to enable live cloud model generation with Google Gemini:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Set your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...
   ```
*(Alternatively, enter your key inside the app via the **Settings** modal; keys are kept exclusively in local browser storage and never logged).*

---

## 7. Test Verification

The application features comprehensive automated unit and integration tests executing under **Vitest**:

```bash
npm test
```

### Verified Test Results
```
 RUN  v3.2.7 D:/work/c5

 ✓ src/__tests__/timelineEngine.test.ts (4 tests)
   - generates milestone tasks based on event type and target date
   - correctly shifts all task due dates when the event date is updated
   - detects overdue tasks when deadline is in the past and task is incomplete
   - handles invalid or approximate dates safely without throwing errors

 ✓ src/__tests__/budgetCalculator.test.ts (5 tests)
   - correctly calculates budget totals, contingency, and remaining balances for weddings
   - handles negative inputs and invalid numeric data gracefully
   - flags over-budget warnings when estimated costs exceed total budget
   - generates event-specific actionable saving recommendations with trade-offs
   - separates estimated costs from actual costs independently

 ✓ src/__tests__/localPlannerEngine.test.ts (6 tests)
   - parses diverse currency and Indian numbering notations accurately (5L, 10 lakhs, 50k, 2.5cr)
   - detects budget change requests and produces structured action triggers
   - detects guest count changes and triggers guest update action
   - detects date shift requests and produces SHIFT_DATE action
   - flags extreme financial infeasibility and proposes practical alternatives
   - explains cost saving strategies with explicit trade-offs

 ✓ src/__tests__/aiProvider.test.ts (2 tests)
   - falls back seamlessly to local engine when no external API key is provided
   - correctly reports local engine mode and triggers state actions

 ✓ src/__tests__/persistence.test.ts (3 tests)
   - serializes and deserializes event plans cleanly without losing nested state
   - handles empty states and detects malformed plan JSON files gracefully
   - loads all demo presets with fully formed sub-components

 Test Files  5 passed (5)
      Tests  20 passed (20)
   Start at  22:27:14
   Duration  1.28s
```

---

## 8. Security, Privacy & Accessibility Compliance

### Security & Privacy
- **Zero Exposed Secrets**: No hardcoded API keys, private tokens, or credentials exist in source code or commits.
- **Local Browser Sandboxing**: All event data, custom notes, and optional API keys are persisted strictly inside the user's browser `localStorage`.
- **Bounded Requests**: External AI calls enforce a 12-second timeout via `AbortController`, preventing runaway resource locks.
- **Input Sanitization**: Number parsing strictly clamps values (preventing negative costs or NaN crashes) and handles Indian notation safely.

### Accessibility (WCAG 2.1 AA)
- **Semantic Markup**: Proper HTML5 elements (`<header>`, `<nav>`, `<main>`, `<table>`, `<section>`).
- **ARIA Standards**: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-expanded`, and descriptive `aria-label` attributes on interactive elements.
- **Color Contrast & Motion**: Contrast ratios meet WCAG AA standards; status is never communicated via color alone (paired with icons and labels); `@media (prefers-reduced-motion: reduce)` is respected.

---

## 9. Assumptions & Limitations

1. **Vendor Pricing**: Suggested vendor budget allocations are calibrated planning heuristics based on regional industry benchmarks (e.g., standard venue and catering ratios). They are clearly disclosed as planning estimates, not guaranteed commercial quotes.
2. **Offline-First Storage**: Multi-event state is stored in browser `localStorage`. For cross-device sync, users can utilize the built-in **Export JSON** and **Import JSON** features.
3. **Print Layout**: The master brief print engine relies on modern browser print rendering engines (e.g. Chrome / Edge / Safari PDF generators).
