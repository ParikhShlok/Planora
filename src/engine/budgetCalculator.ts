import {
  BudgetItem,
  BudgetBreakdown,
  CategoryAllocation,
  SavingRecommendation,
  EventType,
} from '../types';

/**
 * Standard baseline allocation percentages by event type.
 * These reflect realistic event industry distributions.
 */
export const DEFAULT_ALLOCATION_WEIGHTS: Record<EventType, Record<string, number>> = {
  wedding: {
    'Venue & Hospitality': 0.30,
    'Catering & Beverages': 0.25,
    'Decor & Styling': 0.15,
    'Photography & Cinematography': 0.10,
    'Attire, Hair & Makeup': 0.08,
    'Entertainment & Sound': 0.05,
    'Invitations & Favors': 0.03,
    'Permits & Logistics': 0.04,
  },
  birthday: {
    'Venue & Rentals': 0.25,
    'Food & Cake': 0.35,
    'Decor & Balloons': 0.15,
    'Entertainment & Games': 0.12,
    'Photography': 0.05,
    'Party Favors & Invites': 0.05,
    'Miscellaneous': 0.03,
  },
  community: {
    'Venue & Staging': 0.25,
    'Sound, Lights & AV': 0.20,
    'Permits, Security & EMT': 0.15,
    'Publicity & Signage': 0.12,
    'Refreshments & Water Stations': 0.13,
    'Sanitation & Waste Management': 0.08,
    'Contingency Buffer': 0.07,
  },
  celebration: {
    'Venue & Setup': 0.28,
    'Food & Beverage': 0.32,
    'Decor & Floral': 0.15,
    'Music & Lighting': 0.10,
    'Photo & Video': 0.08,
    'Stationery & Welcome Gifts': 0.04,
    'Logistics & Miscellaneous': 0.03,
  },
};

/**
 * Baseline default items per category by event type.
 */
export function generateDefaultBudgetItems(
  eventType: EventType,
  totalBudget: number,
  guestCount: number
): BudgetItem[] {
  const safeBudget = Math.max(0, totalBudget);
  const safeGuests = Math.max(1, guestCount);
  const weights = DEFAULT_ALLOCATION_WEIGHTS[eventType] || DEFAULT_ALLOCATION_WEIGHTS.celebration;

  const items: BudgetItem[] = [];
  let idCounter = 1;

  for (const [category, weight] of Object.entries(weights)) {
    const categoryAllocation = Math.round(safeBudget * weight);

    if (category.toLowerCase().includes('venue') || category.toLowerCase().includes('staging')) {
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Venue Rental & Security Deposit',
        estimatedCost: Math.round(categoryAllocation * 0.75),
        actualCost: 0,
        notes: 'Includes hall hire, baseline power backup & cleanup fee',
      });
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Furniture & Table Linen Rentals',
        estimatedCost: Math.round(categoryAllocation * 0.25),
        actualCost: 0,
      });
    } else if (category.toLowerCase().includes('cater') || category.toLowerCase().includes('food')) {
      const perGuestRate = Math.round((categoryAllocation * 0.85) / safeGuests);
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: `Primary Meal Service (~₹${perGuestRate}/guest for ${safeGuests} pax)`,
        estimatedCost: Math.round(categoryAllocation * 0.85),
        actualCost: 0,
        notes: 'Multi-course menu with dietary variations',
      });
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Beverage Bar & Welcome Drinks',
        estimatedCost: Math.round(categoryAllocation * 0.15),
        actualCost: 0,
      });
    } else if (category.toLowerCase().includes('decor')) {
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Stage / Main Focus Area Floral & Backdrop',
        estimatedCost: Math.round(categoryAllocation * 0.60),
        actualCost: 0,
      });
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Entrance Arch, Signage & Table Centerpieces',
        estimatedCost: Math.round(categoryAllocation * 0.40),
        actualCost: 0,
      });
    } else if (category.toLowerCase().includes('photo')) {
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Lead Candid Photographer & Portraitist',
        estimatedCost: Math.round(categoryAllocation * 0.65),
        actualCost: 0,
      });
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'Highlight Video Reel & Edited Gallery Album',
        estimatedCost: Math.round(categoryAllocation * 0.35),
        actualCost: 0,
      });
    } else if (category.toLowerCase().includes('sound') || category.toLowerCase().includes('entertainment') || category.toLowerCase().includes('music')) {
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'DJ, PA Sound System & Ambient Uplighting',
        estimatedCost: Math.round(categoryAllocation * 0.70),
        actualCost: 0,
      });
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: 'MC / Host / Performance Artist',
        estimatedCost: Math.round(categoryAllocation * 0.30),
        actualCost: 0,
      });
    } else {
      items.push({
        id: `b-item-${idCounter++}`,
        category,
        name: `${category} Baseline Provision`,
        estimatedCost: categoryAllocation,
        actualCost: 0,
        notes: 'Standard allocation estimate',
      });
    }
  }

  return items;
}

/**
 * Recomputes full budget breakdown from items and intake values.
 * Strictly separates estimates from actuals.
 */
export function recalculateBudget(
  totalBudget: number,
  items: BudgetItem[],
  eventType: EventType,
  guestCount: number,
  contingencyPercent: number = 10
): BudgetBreakdown {
  const safeTotalBudget = Math.max(0, Number(totalBudget) || 0);
  const safeGuestCount = Math.max(1, Number(guestCount) || 1);
  const safeContingencyPercent = Math.max(0, Math.min(30, Number(contingencyPercent) || 10));

  // Sanitize line items to prevent negative numbers
  const sanitizedItems = items.map(item => ({
    ...item,
    estimatedCost: Math.max(0, Number(item.estimatedCost) || 0),
    actualCost: Math.max(0, Number(item.actualCost) || 0),
  }));

  const contingencyAmount = Math.round((safeTotalBudget * safeContingencyPercent) / 100);

  // Group by category
  const weights = DEFAULT_ALLOCATION_WEIGHTS[eventType] || DEFAULT_ALLOCATION_WEIGHTS.celebration;
  const categoriesMap = new Map<string, BudgetItem[]>();

  // Ensure default categories exist
  for (const cat of Object.keys(weights)) {
    categoriesMap.set(cat, []);
  }

  sanitizedItems.forEach(item => {
    const list = categoriesMap.get(item.category) || [];
    list.push(item);
    categoriesMap.set(item.category, list);
  });

  const categories: CategoryAllocation[] = [];
  let totalEstimated = 0;
  let totalActual = 0;

  for (const [category, catItems] of categoriesMap.entries()) {
    const estimatedSpent = catItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);
    const actualSpent = catItems.reduce((acc, curr) => acc + curr.actualCost, 0);
    const weight = weights[category] || 0.05;
    const allocatedBudget = Math.round(safeTotalBudget * weight);
    const percentageOfBudget = safeTotalBudget > 0 ? (allocatedBudget / safeTotalBudget) * 100 : 0;

    categories.push({
      category,
      percentageOfBudget: Math.round(percentageOfBudget * 10) / 10,
      allocatedBudget,
      estimatedSpent,
      actualSpent,
      items: catItems,
    });

    totalEstimated += estimatedSpent;
    totalActual += actualSpent;
  }

  const effectiveBudget = safeTotalBudget;
  const remainingEstimatedBalance = effectiveBudget - totalEstimated;
  const remainingActualBalance = effectiveBudget - totalActual;

  const costPerGuestEstimated = Math.round(totalEstimated / safeGuestCount);
  const costPerGuestActual = Math.round(totalActual / safeGuestCount);

  // Warnings generation
  const warnings: string[] = [];

  if (totalEstimated > safeTotalBudget) {
    const overrun = totalEstimated - safeTotalBudget;
    warnings.push(
      `Estimated expenses exceed your total budget by ${overrun.toLocaleString()}! Consider reviewing high-cost categories or applying saving suggestions.`
    );
  }

  if (totalActual > safeTotalBudget) {
    const actualOverrun = totalActual - safeTotalBudget;
    warnings.push(
      `Actual logged expenses have exceeded your total budget by ${actualOverrun.toLocaleString()}!`
    );
  }

  // Category specific warnings
  categories.forEach(cat => {
    if (cat.allocatedBudget > 0 && cat.estimatedSpent > cat.allocatedBudget * 1.25) {
      warnings.push(
        `Category '${cat.category}' is estimated at ${cat.estimatedSpent.toLocaleString()}, which is 25%+ above its target allocation (${cat.allocatedBudget.toLocaleString()}).`
      );
    }
  });

  if (totalEstimated > safeTotalBudget - contingencyAmount && totalEstimated <= safeTotalBudget) {
    warnings.push(
      `Your estimates are tapping into your ${contingencyPercent}% contingency reserve buffer. Maintain a strict ceiling on optional add-ons.`
    );
  }

  // Saving Recommendations
  const savingRecommendations: SavingRecommendation[] = generateSavingRecommendations(
    eventType,
    safeTotalBudget,
    sanitizedItems
  );

  return {
    totalBudget: safeTotalBudget,
    contingencyPercent: safeContingencyPercent,
    contingencyAmount,
    totalEstimated,
    totalActual,
    remainingEstimatedBalance,
    remainingActualBalance,
    costPerGuestEstimated,
    costPerGuestActual,
    categories,
    warnings,
    savingRecommendations,
  };
}

/**
 * Intelligent saving recommendations with explicit trade-offs.
 */
export function generateSavingRecommendations(
  _eventType: EventType,
  _totalBudget: number,
  items: BudgetItem[]
): SavingRecommendation[] {
  const recommendations: SavingRecommendation[] = [];

  const decorItem = items.find(i => i.category.toLowerCase().includes('decor'));
  if (decorItem && decorItem.estimatedCost > 20000) {
    recommendations.push({
      id: 'save-decor-florals',
      title: 'Embrace Seasonal & Local Florals with Ambient Candlelight',
      category: decorItem.category,
      potentialSavings: Math.round(decorItem.estimatedCost * 0.22),
      tradeoff: 'Replaces exotic imported blooms with in-season marigolds, foliage, and high-impact fairy light draping. Elegant aesthetic with 20%+ savings.',
    });
  }

  const caterItem = items.find(i => i.category.toLowerCase().includes('cater') || i.category.toLowerCase().includes('food'));
  if (caterItem && caterItem.estimatedCost > 30000) {
    recommendations.push({
      id: 'save-catering-style',
      title: 'Streamline Menu to Interactive Live Counters',
      category: caterItem.category,
      potentialSavings: Math.round(caterItem.estimatedCost * 0.15),
      tradeoff: 'Reduces food waste and catering staff overhead compared to an exhaustive 40-item banquet buffet, keeping guest experience lively and fresh.',
    });
  }

  const invitesItem = items.find(i => i.name.toLowerCase().includes('invite') || i.category.toLowerCase().includes('favor') || i.category.toLowerCase().includes('publicity'));
  if (invitesItem && invitesItem.estimatedCost > 5000) {
    recommendations.push({
      id: 'save-digital-invites',
      title: 'Eco-Friendly Animated Digital Invites & RSVP Micro-site',
      category: invitesItem.category,
      potentialSavings: Math.round(invitesItem.estimatedCost * 0.70),
      tradeoff: 'Eliminates paper printing, parcel shipping, and delayed physical RSVP tracking while enabling instantaneous guest headcount updates.',
    });
  }

  const photoItem = items.find(i => i.category.toLowerCase().includes('photo'));
  if (photoItem && photoItem.estimatedCost > 25000) {
    recommendations.push({
      id: 'save-photo-hours',
      title: 'Focused Coverage Window for Photo/Video Team',
      category: photoItem.category,
      potentialSavings: Math.round(photoItem.estimatedCost * 0.18),
      tradeoff: 'Contract for key high-energy ceremony hours (e.g. 6 hours rather than 12 full hours), focusing on authentic highlights.',
    });
  }

  return recommendations;
}
