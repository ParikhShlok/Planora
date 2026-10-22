import { EventPlan, ChatMessage } from '../types';
import { processLocalPlannerQuery } from './localPlannerEngine';

export interface AIProviderOptions {
  customApiKey?: string;
}

export interface AIExecutionResult {
  message: string;
  modeUsed: 'gemini-live' | 'local-engine';
  actionTriggered?: ChatMessage['actionTriggered'];
  suggestedFollowUps?: string[];
}

/**
 * Unified AI Provider with automatic fallback to high-intelligence local engine.
 * Never leaks API keys, handles errors gracefully, and discloses operating mode.
 */
export async function getAIPlannerResponse(
  userQuery: string,
  plan: EventPlan,
  options?: AIProviderOptions
): Promise<AIExecutionResult> {
  const apiKey = options?.customApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  // If no API key is provided, use the deterministic local planning engine immediately
  if (!apiKey || !apiKey.trim() || apiKey.trim().startsWith('YOUR_')) {
    const localRes = processLocalPlannerQuery(userQuery, plan);
    return {
      message: localRes.message,
      modeUsed: 'local-engine',
      actionTriggered: localRes.actionTriggered,
      suggestedFollowUps: localRes.suggestedFollowUps,
    };
  }

  // Attempt live Gemini invocation
  try {
    const prompt = buildGeminiPrompt(userQuery, plan);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second bounded timeout

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      apiKey.trim()
    )}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Planora AI] Gemini API returned status ${response.status}. Falling back to local engine.`);
      const fallback = processLocalPlannerQuery(userQuery, plan);
      return {
        message: `${fallback.message}\n\n*(Note: Live AI service returned status ${response.status}. Planora safely reverted to its local planning engine).*`,
        modeUsed: 'local-engine',
        actionTriggered: fallback.actionTriggered,
        suggestedFollowUps: fallback.suggestedFollowUps,
      };
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response received from AI model');
    }

    // Check if the query implies an action that the local engine can also safely trigger
    const localActionCheck = processLocalPlannerQuery(userQuery, plan);

    return {
      message: rawText,
      modeUsed: 'gemini-live',
      actionTriggered: localActionCheck.actionTriggered,
      suggestedFollowUps: localActionCheck.suggestedFollowUps || [
        'How can we optimize our budget further?',
        'Review our day-of timeline',
      ],
    };
  } catch (err: any) {
    console.warn('[Planora AI] Live AI call failed or timed out. Falling back cleanly to local engine.', err?.message);
    const fallback = processLocalPlannerQuery(userQuery, plan);
    return {
      message: `${fallback.message}\n\n*(Note: Operating in resilient local planning mode).*`,
      modeUsed: 'local-engine',
      actionTriggered: fallback.actionTriggered,
      suggestedFollowUps: fallback.suggestedFollowUps,
    };
  }
}

function buildGeminiPrompt(userQuery: string, plan: EventPlan): string {
  return `You are Planora AI, an elite, practical event planning assistant.
The user is planning a ${plan.intake.eventType.toUpperCase()} titled "${plan.intake.title}".
Context:
- Target Date: ${plan.intake.date} (${plan.intake.isApproximateDate ? 'Approximate' : 'Confirmed'})
- City/Venue: ${plan.intake.city || 'TBD'} / ${plan.intake.venuePreference || 'TBD'}
- Budget: ${plan.intake.currency} ${plan.intake.budget.toLocaleString()}
- Guests: ${plan.intake.guestCount} (Est cost/guest: ${plan.intake.currency} ${plan.budgetBreakdown.costPerGuestEstimated})
- Style/Theme: ${plan.intake.styleTheme || 'Traditional & Elegant'}
- Indoor/Outdoor: ${plan.intake.isIndoorOutdoor}
- Priorities: ${plan.intake.priorities.join(', ') || 'General celebration'}
- Dietary Needs: ${plan.intake.dietaryRequirements.join(', ') || 'Universal'}
- Accessibility: ${plan.intake.accessibilityNeeds.join(', ') || 'Standard'}
- Budget Allocated: ${plan.budgetBreakdown.totalEstimated} | Remaining Balance: ${plan.budgetBreakdown.remainingEstimatedBalance}

USER QUESTION: "${userQuery}"

GUIDELINES:
1. Provide actionable, concise, tailored advice.
2. Distinguish User-provided Facts vs Planning Estimates vs Assumptions vs Suggestions.
3. If the user wants to adjust budget, date, or guests, clearly explain the cascading impact.
4. If a request is financially or logistically infeasible, explain why politely and propose 2 realistic alternatives.
5. NEVER fabricate real contact details or claim guaranteed vendor prices; label them as planning estimates.
6. Use markdown formatting with clear headings and bullet points.`;
}
