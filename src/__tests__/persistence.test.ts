import { describe, it, expect } from 'vitest';
import { getDemoPlans, createInitialPlan, DEMO_WEDDING_INTAKE } from '../data/demoPlans';
import { EventPlan } from '../types';

describe('Persistence and Plan Serialization', () => {
  it('serializes and deserializes event plans cleanly without losing nested state', () => {
    const originalPlan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const jsonString = JSON.stringify(originalPlan);
    const parsedPlan: EventPlan = JSON.parse(jsonString);

    expect(parsedPlan.id).toBe(originalPlan.id);
    expect(parsedPlan.intake.title).toBe(originalPlan.intake.title);
    expect(parsedPlan.budgetBreakdown.totalBudget).toBe(originalPlan.budgetBreakdown.totalBudget);
    expect(parsedPlan.timeline.length).toBe(originalPlan.timeline.length);
    expect(parsedPlan.vendors.length).toBe(originalPlan.vendors.length);
    expect(parsedPlan.ideas.dayOfSchedule.length).toBe(originalPlan.ideas.dayOfSchedule.length);
  });

  it('handles empty states and detects malformed plan JSON files gracefully', () => {
    const invalidJson1 = '{"randomKey": 123}';
    const parsed1 = JSON.parse(invalidJson1);
    const isPlanValid1 = Boolean(parsed1.intake && parsed1.intake.title && parsed1.intake.eventType);
    expect(isPlanValid1).toBe(false);

    const corruptJson = '{not-valid-json';
    let failedCleanly = false;
    try {
      JSON.parse(corruptJson);
    } catch {
      failedCleanly = true;
    }
    expect(failedCleanly).toBe(true);
  });

  it('loads all demo presets with fully formed sub-components', () => {
    const demoPlans = getDemoPlans();
    expect(demoPlans.length).toBe(3);

    const [wedding, birthday, community] = demoPlans;
    expect(wedding.intake.eventType).toBe('wedding');
    expect(birthday.intake.eventType).toBe('birthday');
    expect(community.intake.eventType).toBe('community');

    expect(wedding.vendors[0].quotes.length).toBeGreaterThan(0);
    expect(wedding.timeline.some(t => t.completed)).toBe(true);
  });
});
