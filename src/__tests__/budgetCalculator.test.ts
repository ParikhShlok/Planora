import { describe, it, expect } from 'vitest';
import {
  recalculateBudget,
  generateDefaultBudgetItems,
  generateSavingRecommendations,
} from '../engine/budgetCalculator';
import { BudgetItem } from '../types';

describe('Budget Calculator Engine', () => {
  it('correctly calculates budget totals, contingency, and remaining balances for weddings', () => {
    const totalBudget = 1000000;
    const guestCount = 200;
    const items = generateDefaultBudgetItems('wedding', totalBudget, guestCount);

    const breakdown = recalculateBudget(totalBudget, items, 'wedding', guestCount, 10);

    expect(breakdown.totalBudget).toBe(1000000);
    expect(breakdown.contingencyPercent).toBe(10);
    expect(breakdown.contingencyAmount).toBe(100000);
    expect(breakdown.totalEstimated).toBeGreaterThan(0);
    expect(breakdown.costPerGuestEstimated).toBe(Math.round(breakdown.totalEstimated / 200));
    expect(breakdown.categories.length).toBeGreaterThan(4);
  });

  it('handles negative inputs and invalid numeric data gracefully', () => {
    const dirtyItems: BudgetItem[] = [
      { id: '1', category: 'Venue', name: 'Hall', estimatedCost: -5000, actualCost: -2000 },
      { id: '2', category: 'Catering', name: 'Food', estimatedCost: NaN as any, actualCost: 15000 },
    ];

    const breakdown = recalculateBudget(-100000, dirtyItems, 'wedding', -50, -5);

    // Should clamp negative budget to 0 and negative guestCount to 1, and negative items to 0
    expect(breakdown.totalBudget).toBe(0);
    expect(breakdown.contingencyPercent).toBe(0);
    expect(breakdown.contingencyAmount).toBe(0);
    expect(breakdown.costPerGuestEstimated).toBe(0);
    expect(breakdown.totalActual).toBe(15000);
  });

  it('flags over-budget warnings when estimated costs exceed total budget', () => {
    const totalBudget = 500000;
    const expensiveItems: BudgetItem[] = [
      { id: '1', category: 'Venue & Hospitality', name: 'Palace Hall', estimatedCost: 400000, actualCost: 0 },
      { id: '2', category: 'Catering & Beverages', name: 'Banquet', estimatedCost: 300000, actualCost: 0 },
    ];

    const breakdown = recalculateBudget(totalBudget, expensiveItems, 'wedding', 100, 10);

    expect(breakdown.totalEstimated).toBe(700000);
    expect(breakdown.remainingEstimatedBalance).toBe(-200000);
    expect(breakdown.warnings.length).toBeGreaterThan(0);
    expect(breakdown.warnings.some(w => w.includes('exceed your total budget'))).toBe(true);
  });

  it('generates event-specific actionable saving recommendations with trade-offs', () => {
    const items: BudgetItem[] = [
      { id: '1', category: 'Decor & Styling', name: 'Imported Flowers', estimatedCost: 80000, actualCost: 0 },
      { id: '2', category: 'Catering & Beverages', name: 'Buffet', estimatedCost: 150000, actualCost: 0 },
      { id: '3', category: 'Invitations & Favors', name: 'Boxed Invitations', estimatedCost: 20000, actualCost: 0 },
    ];

    const savings = generateSavingRecommendations('wedding', 500000, items);

    expect(savings.length).toBeGreaterThan(0);
    expect(savings.every(s => s.potentialSavings > 0)).toBe(true);
    expect(savings.every(s => typeof s.tradeoff === 'string' && s.tradeoff.length > 10)).toBe(true);
  });

  it('separates estimated costs from actual costs independently', () => {
    const items: BudgetItem[] = [
      { id: '1', category: 'Venue', name: 'Hall', estimatedCost: 200000, actualCost: 180000 },
      { id: '2', category: 'Catering', name: 'Dinner', estimatedCost: 150000, actualCost: 160000 },
    ];

    const breakdown = recalculateBudget(500000, items, 'celebration', 100, 10);

    expect(breakdown.totalEstimated).toBe(350000);
    expect(breakdown.totalActual).toBe(340000);
    expect(breakdown.remainingEstimatedBalance).toBe(150000);
    expect(breakdown.remainingActualBalance).toBe(160000);
  });
});
