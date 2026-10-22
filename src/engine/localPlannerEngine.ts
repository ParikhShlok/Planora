import { EventPlan, ChatMessage } from '../types';

export interface PlannerResponse {
  message: string;
  actionTriggered?: ChatMessage['actionTriggered'];
  suggestedFollowUps?: string[];
}

/**
 * Parses numeric currency strings including Indian notations (e.g., "5 lakhs", "10L", "50k", "5,00,000")
 */
export function parseAmount(input: string): number | null {
  const clean = input.toLowerCase().replace(/[,₹$€]/g, '').trim();

  // Handle "X lakh" or "X lakhs" or "XL"
  const lakhMatch = clean.match(/([\d.]+)\s*(?:lakh|lakhs|l|lac|lacs)/);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]);
    return isNaN(val) ? null : Math.round(val * 100000);
  }

  // Handle "X k"
  const kMatch = clean.match(/([\d.]+)\s*(?:k|thousand)/);
  if (kMatch) {
    const val = parseFloat(kMatch[1]);
    return isNaN(val) ? null : Math.round(val * 1000);
  }

  // Handle "X crore" or "X cr"
  const crMatch = clean.match(/([\d.]+)\s*(?:cr|crore|crores)/);
  if (crMatch) {
    const val = parseFloat(crMatch[1]);
    return isNaN(val) ? null : Math.round(val * 10000000);
  }

  // Plain number
  const numMatch = clean.match(/(\d+)/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    return isNaN(val) ? null : val;
  }

  return null;
}

/**
 * High-intelligence deterministic planning assistant engine.
 * Context-aware, explains tradeoffs, distinguishes facts vs estimates vs assumptions,
 * handles edge cases, infeasibility, and generates actionable mutations.
 */
export function processLocalPlannerQuery(userQuery: string, plan: EventPlan): PlannerResponse {
  const query = userQuery.trim().toLowerCase();
  const currencySymbol = plan.intake.currency === 'INR' ? '₹' : plan.intake.currency === 'USD' ? '$' : '€';

  // 1. Detect Infeasibility / Extreme Mismatch
  if (
    (query.includes('500') || query.includes('300') || query.includes('1000')) &&
    (query.includes('50000') || query.includes('10000') || query.includes('cheap'))
  ) {
    return {
      message: `### ⚠️ Feasibility Assessment & Financial Reality Check

**Analysis:**
- **Fact:** Hosting 300+ guests on a micro-budget creates a severe per-guest constraint (< ${currencySymbol}150/guest).
- **Estimate:** In current market standards, decent catering alone requires ${currencySymbol}500–${currencySymbol}1,200/guest, excluding venue, seating, and sound.
- **Assumption:** You wish to provide a hospitable, memorable celebration without taking on unmanageable debt.

**Practical Alternatives:**
1. **Curate an Intimate Core Gathering:** Restrict guest list to 40–50 core loved ones to provide high-quality dining and ambiance within your budget.
2. **Community Potluck / BYO Fair:** Shift to a public park pavilion where guests bring signature family dishes, focusing funds on sound and shelter.
3. **Cocktail / High-Tea Reception:** Host a 2-hour afternoon dessert and mocktail reception instead of a full multi-course dinner banquet (saves ~55% of catering costs).`,
      suggestedFollowUps: [
        'How can we scale down our guest list gracefully?',
        'What are low-cost community venue alternatives?',
        'Can we switch to an afternoon tea menu?',
      ],
    };
  }

  // 2. Budget Updates (e.g. "update budget to 8 lakhs", "budget is 600000")
  if (query.includes('budget') && (query.includes('to') || query.includes('is') || query.includes('change') || query.includes('increase') || query.includes('decrease'))) {
    const newAmount = parseAmount(query);
    if (newAmount && newAmount > 0) {
      const perGuest = Math.round(newAmount / Math.max(1, plan.intake.guestCount));
      return {
        message: `### 💰 Budget Adjusted to ${currencySymbol}${newAmount.toLocaleString()}

**Contextual Impact Analysis:**
- **User Fact:** Total budget updated from ${currencySymbol}${plan.intake.budget.toLocaleString()} to **${currencySymbol}${newAmount.toLocaleString()}**.
- **Estimated Cost Per Guest:** Now **${currencySymbol}${perGuest.toLocaleString()}/guest** (based on ${plan.intake.guestCount} guests).
- **Assumed Contingency:** A 10% buffer (${currencySymbol}${Math.round(newAmount * 0.1).toLocaleString()}) is automatically reserved for unplanned logistics.
- **Recommendation:** I have rebalanced your line items and category allocations across Venue, Catering, Decor, and Photography to align with this revised ceiling.

*Action Applied: Budget refreshed throughout all dashboards and charts.*`,
        actionTriggered: {
          type: 'UPDATE_BUDGET',
          description: `Updated budget to ${currencySymbol}${newAmount.toLocaleString()}`,
          payload: { budget: newAmount },
        },
        suggestedFollowUps: [
          'Show me where we can trim costs further',
          'How does this change our catering allocation?',
          'What is our remaining balance now?',
        ],
      };
    }
  }

  // 3. Guest Count Updates (e.g. "guests changed to 180", "150 guests")
  if ((query.includes('guest') || query.includes('headcount') || query.includes('pax')) && (query.includes('to') || query.includes('is') || query.includes('have') || query.includes('now'))) {
    const guestMatch = query.match(/(\d+)\s*(?:guests?|people|pax)?/);
    if (guestMatch) {
      const count = parseInt(guestMatch[1], 10);
      if (count > 0 && count < 10000) {
        const perGuest = Math.round(plan.intake.budget / count);
        return {
          message: `### 👥 Guest Count Updated to ${count} Attendees

**Strategic Impact:**
- **Fact:** Guest count adjusted from ${plan.intake.guestCount} to **${count}**.
- **Per-Guest Spend Power:** Available budget allows **${currencySymbol}${perGuest.toLocaleString()} per attendee**.
- **Estimate:** Catering and rental line items have been scaled proportionally.
- **Critical Assumption:** Ensure your chosen venue has certified capacity and fire safety clearance for ${count} concurrent occupants.`,
          actionTriggered: {
            type: 'UPDATE_GUESTS',
            description: `Updated guest count to ${count}`,
            payload: { guestCount: count },
          },
          suggestedFollowUps: [
            'Does our venue still accommodate this headcount?',
            'What menu adjustments save per-plate cost?',
            'Recalculate our invitation task timeline',
          ],
        };
      }
    }
  }

  // 4. Date Shift / Postponement (e.g. "shift date to 2026-11-20", "change date to...")
  if (query.includes('date') && (query.includes('change') || query.includes('shift') || query.includes('move') || query.includes('postpone') || query.includes('to'))) {
    const dateMatch = query.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const newDate = dateMatch[1];
      return {
        message: `### 📅 Event Date Shifted to ${newDate}

**Timeline Synchronization:**
- **Fact:** Target date changed from ${plan.intake.date} to **${newDate}**.
- **Dynamic Recalculation:** All task deadlines (venue booking, menu tasting, invitations, final headcount) have been dynamically shifted relative to this new anchor date.
- **Suggestion:** Contact already-shortlisted vendors immediately to confirm their calendar availability for ${newDate}.`,
        actionTriggered: {
          type: 'SHIFT_DATE',
          description: `Shifted event date to ${newDate}`,
          payload: { date: newDate },
        },
        suggestedFollowUps: [
          'Which vendor deadlines are most urgent now?',
          'Are any tasks marked overdue after this shift?',
        ],
      };
    }
  }

  // 5. Saving Tips / Cost Reduction
  if (query.includes('save') || query.includes('cut cost') || query.includes('reduce') || query.includes('trim') || query.includes('budget high') || query.includes('expensive')) {
    return {
      message: `### 💡 High-Impact Cost Saving Strategies with Explicit Trade-offs

Based on your event type (**${plan.intake.eventType.toUpperCase()}**) and total budget of **${currencySymbol}${plan.intake.budget.toLocaleString()}**, here are tailored optimizations:

1. **Floral & Decor Optimization (~20-25% Decor Savings)**
   - *Action:* Focus dramatic floral styling exclusively on your primary photo backdrop (e.g., stage arch or cake table). Use ambient warm LED fairy drapes and pillar candles for secondary guest zones.
   - *Trade-off:* Less lavish peripheral florals, but zero compromise on official portrait quality.

2. **Catering Service Engineering (~15-18% Food Savings)**
   - *Action:* Opt for high-impact interactive live food counters (e.g., artisanal flatbreads, pasta theater, chaat) instead of an oversized 40-item static buffet where 30% of dishes get wasted.
   - *Trade-off:* Requires dedicated station chefs, but elevates guest delight and reduces food waste significantly.

3. **Digital Stationery & RSVP Micro-site (~75% Invitation Savings)**
   - *Action:* Distribute animated video save-the-dates and mobile WhatsApp invitations with automated RSVP tracking links.
   - *Trade-off:* Older traditional relatives may still desire a printed card (print a small batch of 20 physical cards only for elders).

4. **Daytime / Golden Hour Photography Scheduling (~15% Vendor Savings)**
   - *Action:* Schedule key ceremonies during natural afternoon golden hour to reduce reliance on heavy artificial strobe rigging and overtime crew fees.`,
      suggestedFollowUps: [
        'Apply these savings to our budget breakdown',
        'How can we negotiate quotes with caterers?',
        'Suggest low-waste eco-friendly alternatives',
      ],
    };
  }

  // 6. Food & Menu Planning
  if (query.includes('food') || query.includes('menu') || query.includes('catering') || query.includes('dietary') || query.includes('vegan') || query.includes('allergy')) {
    const dietaryList = plan.intake.dietaryRequirements.length > 0 ? plan.intake.dietaryRequirements.join(', ') : 'standard universal diets';
    return {
      message: `### 🍽️ Curated Menu Strategy & Dietary Architecture

**Contextual Alignment:**
- **Guest Count:** ${plan.intake.guestCount} attendees.
- **Specified Dietary Preferences:** ${dietaryList}.
- **Event Style:** ${plan.intake.styleTheme || 'Celebration'}.

**Menu Engineering Recommendations:**
1. **Welcome Refreshments:** Infused botanical coolers (cucumber-mint, hibiscus rose, or spiced ginger lemonade) served upon arrival to hydrate guests before formalities.
2. **Appetizer Pacing:** 3 vegetarian + 2 non-vegetarian (or all-veg if preferred) passed small plates during the first 60 minutes to prevent dining bottlenecks.
3. **Allergen & Cross-Contamination Guard:** Separate dedicated service tongs, clearly printed allergen icons (Gluten-Free, Nut-Free, Dairy-Free, Vegan, Jain), and sneeze-guard protection.
4. **Late-Night Snack Surprise:** Mini warm sliders, churros, or artisanal chai shots served 30 minutes before wrap-up to send guests home delighted.`,
      suggestedFollowUps: [
        'How many appetizers per person is recommended?',
        'What is a safe ratio of vegetarian to non-vegetarian items?',
        'Can we add a live dessert station?',
      ],
    };
  }

  // 7. Weather / Rain / Backup
  if (query.includes('weather') || query.includes('rain') || query.includes('heat') || query.includes('outdoor') || query.includes('storm')) {
    return {
      message: `### 🌦️ Comprehensive Weather & Environmental Contingency Plan

**Primary Risk Profile:** For an **${plan.intake.isIndoorOutdoor.toUpperCase()}** celebration in **${plan.intake.city || 'your area'}**:
- **Fact:** Weather disruptions can occur regardless of seasonal forecasts.
- **Estimate:** Emergency day-of tenting rentals cost up to 60% more when booked under 48 hours notice.

**Actionable 3-Tier Mitigation:**
1. **The 72-Hour Weather Clause:** Ensure your venue contract permits moving lawn proceedings into an indoor ballroom with at least 48 hours notice at no extra hall fee.
2. **Floor & Cable Protection:** If outdoors, ensure all audio/visual wiring is elevated in rubber speed-bump conduits, with GFCI weather-resistant power distribution.
3. **Guest Comfort Amenities:** Provide branded umbrellas at the valet, shaded canopy walkways, and mist fans or outdoor patio heaters depending on ambient temperature.`,
      suggestedFollowUps: [
        'What should our rain backup timeline look like?',
        'Add a weather inspection checklist task to the timeline',
      ],
    };
  }

  // 8. General / Fallback Context-Aware Assistant
  return {
    message: `### 📋 Planora Assistant Advisory: ${plan.intake.title}

I have analyzed your **${plan.intake.eventType.toUpperCase()}** plan for **${plan.intake.guestCount} guests** in **${plan.intake.city || 'your city'}** with a budget of **${currencySymbol}${plan.intake.budget.toLocaleString()}**.

**Current Health Check:**
- **Budget Status:** ${plan.budgetBreakdown.remainingEstimatedBalance >= 0 ? `Healthy balance with ${currencySymbol}${plan.budgetBreakdown.remainingEstimatedBalance.toLocaleString()} uncommitted.` : `⚠️ Overallocated by ${currencySymbol}${Math.abs(plan.budgetBreakdown.remainingEstimatedBalance).toLocaleString()}!` }
- **Contingency Reserve:** ${plan.budgetBreakdown.contingencyPercent}% (${currencySymbol}${plan.budgetBreakdown.contingencyAmount.toLocaleString()}) reserved for unexpected needs.
- **Upcoming Milestone:** Next key action is locking your core venue and confirming photographer availability.

**How can I assist you right now?**
- You can tell me: *"Increase budget to 12 lakhs"*, *"Change guests to 200"*, or *"Shift date to 2026-11-15"*.
- Or ask about: *Cost savings*, *Menu planning*, *Vendor negotiation tactics*, or *Day-of timeline flow*.`,
    suggestedFollowUps: [
      'Where can we trim 10% of our budget?',
      'Review our day-of event schedule',
      'What questions should we ask caterers before booking?',
    ],
  };
}
