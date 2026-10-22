import { describe, it, expect } from 'vitest';
import { getAIPlannerResponse } from '../engine/aiProvider';
import { createInitialPlan, DEMO_WEDDING_INTAKE } from '../data/demoPlans';

describe('AI Provider Interface', () => {
  it('falls back seamlessly to local engine when no external API key is provided', async () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const result = await getAIPlannerResponse('What should we do about weather contingency?', plan);

    expect(result.modeUsed).toBe('local-engine');
    expect(result.message).toContain('Weather');
    expect(result.message.length).toBeGreaterThan(100);
  });

  it('correctly reports local engine mode and triggers state actions', async () => {
    const plan = createInitialPlan(DEMO_WEDDING_INTAKE);
    const result = await getAIPlannerResponse('Change budget to 2000000', plan);

    expect(result.modeUsed).toBe('local-engine');
    expect(result.actionTriggered?.type).toBe('UPDATE_BUDGET');
    expect(result.actionTriggered?.payload.budget).toBe(2000000);
  });
});
