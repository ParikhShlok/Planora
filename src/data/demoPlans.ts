import { EventPlan, EventIntake } from '../types';
import { recalculateBudget, generateDefaultBudgetItems } from '../engine/budgetCalculator';
import { generateTimelineTasks } from '../engine/timelineEngine';
import { generateVendorChecklist } from '../engine/vendorEngine';
import { generatePersonalizedIdeas } from '../engine/ideasEngine';

export function createInitialPlan(intake: EventIntake): EventPlan {
  const budgetItems = generateDefaultBudgetItems(intake.eventType, intake.budget, intake.guestCount);
  const budgetBreakdown = recalculateBudget(intake.budget, budgetItems, intake.eventType, intake.guestCount, 10);
  const timeline = generateTimelineTasks(intake.eventType, intake.date);
  const vendors = generateVendorChecklist(intake);
  const ideas = generatePersonalizedIdeas(intake);

  const welcomeMessage = {
    id: 'msg-welcome',
    sender: 'assistant' as const,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    content: `👋 Welcome to your **Planora AI** planning workspace for **${intake.title}**!

I have structured your custom plan:
- **Event:** ${intake.eventType.toUpperCase()} in ${intake.city || 'your city'}
- **Date:** ${intake.date} (${intake.isApproximateDate ? 'Target timeframe' : 'Confirmed date'})
- **Total Budget:** ${intake.currency === 'INR' ? '₹' : intake.currency} ${intake.budget.toLocaleString()} (${Math.round(intake.budget / Math.max(1, intake.guestCount)).toLocaleString()} / guest for ${intake.guestCount} guests)
- **Contingency Reserve:** 10% (${intake.currency === 'INR' ? '₹' : intake.currency} ${budgetBreakdown.contingencyAmount.toLocaleString()}) reserved for unexpected needs.

You can adjust numbers in the **Budget Planner**, track deadlines in the **Timeline**, compare quotes in **Vendors**, or ask me anything right here!`,
    modeUsed: 'local-engine' as const,
  };

  return {
    id: `plan-${Date.now()}`,
    title: intake.title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    intake,
    budgetBreakdown,
    timeline,
    vendors,
    ideas,
    chatHistory: [welcomeMessage],
    version: 1,
  };
}

export const DEMO_WEDDING_INTAKE: EventIntake = {
  title: 'Ananya & Kabir’s Royal Palace Wedding',
  eventType: 'wedding',
  date: '2026-11-28',
  isApproximateDate: false,
  city: 'Udaipur, Rajasthan',
  venuePreference: 'Heritage Lakeside Palace & Courtyard',
  budget: 1800000,
  currency: 'INR',
  guestCount: 250,
  styleTheme: 'Regal Rajputana Elegance & Marigold Sunset',
  colorPalette: ['#990000', '#D4AF37', '#FFF8DC', '#004225'],
  isIndoorOutdoor: 'hybrid',
  priorities: ['food', 'photography', 'decoration', 'cultural'],
  dietaryRequirements: ['Pure Vegetarian', 'Jain Options Available', 'Nut-Free Signage'],
  accessibilityNeeds: ['Wheelchair Ramps to Mandap & Dining', 'Golf Cart Shuttle from Valet'],
  notes: 'Sangeet night on Day 1, Auspicious Wedding Ceremony on Day 2 followed by Royal Banquet.',
};

export const DEMO_BIRTHDAY_INTAKE: EventIntake = {
  title: 'Rohan’s 30th Retro Neon Arcade Bash',
  eventType: 'birthday',
  date: '2026-10-15',
  isApproximateDate: false,
  city: 'Mumbai, Maharashtra',
  venuePreference: 'Rooftop Lounge & Bar in Bandra',
  budget: 180000,
  currency: 'INR',
  guestCount: 65,
  styleTheme: 'Cyberpunk Neon Glow & 80s Synthwave',
  colorPalette: ['#FF007F', '#00F0FF', '#7B2CBF', '#121212'],
  isIndoorOutdoor: 'indoor',
  priorities: ['entertainment', 'food', 'photography'],
  dietaryRequirements: ['Vegan Finger Foods', 'Gluten-Free Sliders'],
  accessibilityNeeds: ['Elevator Access to Rooftop'],
  notes: 'Custom mocktail bar, retro arcade games corner, and silent disco after 10 PM.',
};

export const DEMO_COMMUNITY_INTAKE: EventIntake = {
  title: 'Koramangala Green Neighborhood Cultural Fair',
  eventType: 'community',
  date: '2026-12-05',
  isApproximateDate: false,
  city: 'Bengaluru, Karnataka',
  venuePreference: 'Civic Park Grounds & Amphitheater',
  budget: 450000,
  currency: 'INR',
  guestCount: 450,
  styleTheme: 'Eco-Forward Sustainable Karnataka Heritage',
  colorPalette: ['#2D6A4F', '#D8F3DC', '#B7E4C7', '#74C69D'],
  isIndoorOutdoor: 'outdoor',
  priorities: ['sustainability', 'accessibility', 'entertainment', 'food'],
  dietaryRequirements: ['All Organic Local Farm Ingredients', 'Dairy-Free Options'],
  accessibilityNeeds: ['Tactile Paving Paths', 'Sign Language Interpreter on Main Stage', 'Wheelchair Restrooms'],
  notes: 'Zero single-use plastic, composting stalls, local artisan handicraft exhibits, and folk dance.',
};

export function getDemoPlans(): EventPlan[] {
  const weddingPlan = createInitialPlan(DEMO_WEDDING_INTAKE);
  // Add some realistic quote comparisons to demonstrate full vendor quote functionality
  if (weddingPlan.vendors.length > 0) {
    weddingPlan.vendors[0].quotes = [
      {
        id: 'q-1',
        vendorName: 'Fatehgarh Palace Courtyard',
        contactPerson: 'Mr. Vikram Singh (+91 98290XXXXX)',
        quotedAmount: 520000,
        inclusions: 'Lawn + Banquet Hall hire for 2 days, 15 guest suites, power backup',
        pros: 'Stunning lake view, in-house heritage kitchen, royal courtyard ambiance',
        cons: 'Strict 10 PM outdoor music curfew, valet parking limited to 80 cars',
        isPreferred: true,
      },
      {
        id: 'q-2',
        vendorName: 'Lake Pichola Resort & Spa',
        contactPerson: 'Ms. Neha Sharma (+91 99821XXXXX)',
        quotedAmount: 610000,
        inclusions: 'Full property buyout for 24 hours, breakfast for 60 guests',
        pros: 'Complete privacy, boat transfers for VIP guests',
        cons: 'Exceeds target venue allocation by ₹90,000',
        isPreferred: false,
      },
    ];
    weddingPlan.vendors[0].assignedVendorName = 'Fatehgarh Palace Courtyard';
    weddingPlan.vendors[0].bookingStatus = 'contacted';
  }

  // Mark first 2 tasks as complete in demo to demonstrate progress tracking
  if (weddingPlan.timeline.length > 1) {
    weddingPlan.timeline[0].completed = true;
    weddingPlan.timeline[1].completed = true;
  }

  const birthdayPlan = createInitialPlan(DEMO_BIRTHDAY_INTAKE);
  const communityPlan = createInitialPlan(DEMO_COMMUNITY_INTAKE);

  return [weddingPlan, birthdayPlan, communityPlan];
}
