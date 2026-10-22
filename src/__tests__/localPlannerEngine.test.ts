import { describe, it, expect } from 'vitest';
import { processLocalPlannerQuery, parseAmount } from '../engine/localPlannerEngine';
import { createInitialPlan, DEMO_WEDDING_INTAKE } from '../data/demoPlans';

describe('Local Planning Engine', () => {
  it('parses diverse currency and Indian numbering notations accurately', () => {
    expect(parseAmount('5 lakhs')).toBe(500000);
    expect(parseAmount('12L')).toBe(1200000);
    expect(parseAmount('50k')).toBe(50000);
    expect(parseAmount('2.5 crore')).toBe(25000000);
    expect(parseAmount('₹7,50,000')).toBe(750000);
    expect(parseAmount('plain text')).toBeNull();
  });

  it('detects budget change requests and produces structured action triggers', () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const response = processLocalPlannerQuery('Please increase our budget to 25 lakhs', plan);

    expect(response.actionTriggered).toBeDefined();
    expect(response.actionTriggered?.type).toBe('UPDATE_BUDGET');
    expect(response.actionTriggered?.payload.budget).toBe(2500000);
    expect(response.message).toContain('Budget Adjusted to');
  });

  it('detects guest count changes and triggers guest update action', () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const response = processLocalPlannerQuery('We now have 180 guests attending', plan);

    expect(response.actionTriggered).toBeDefined();
    expect(response.actionTriggered?.type).toBe('UPDATE_GUESTS');
    expect(response.actionTriggered?.payload.guestCount).toBe(180);
    expect(response.message).toContain('Guest Count Updated to 180 Attendees');
  });

  it('detects date shift requests and produces SHIFT_DATE action', () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const response = processLocalPlannerQuery('Shift our date to 2026-12-20', plan);

    expect(response.actionTriggered).toBeDefined();
    expect(response.actionTriggered?.type).toBe('SHIFT_DATE');
    expect(response.actionTriggered?.payload.date).toBe('2026-12-20');
  });

  it('flags extreme financial infeasibility and proposes practical alternatives', () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const response = processLocalPlannerQuery('Can we plan for 500 guests with 10000 budget?', plan);

    expect(response.message).toContain('Feasibility Assessment & Financial Reality Check');
    expect(response.message).toContain('Practical Alternatives');
    expect(response.suggestedFollowUps?.length).toBeGreaterThan(0);
  });

  it('explains cost saving strategies with explicit trade-offs', () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const response = processLocalPlannerQuery('How can we cut costs and save money?', plan);

    expect(response.message).toContain('Trade-off');
    expect(response.message).toContain('Floral & Decor');
    expect(response.message).toContain('Digital Stationery');
  });
});
