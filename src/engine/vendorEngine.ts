import { VendorItem, EventIntake, VendorPriority } from '../types';

interface VendorTemplate {
  category: string;
  recommendedRole: string;
  priority: VendorPriority;
  costRatioOfBudget: number;
  tradeoffsExplanation: string;
}

const WEDDING_VENDORS: VendorTemplate[] = [
  {
    category: 'Venue & Hospitality',
    recommendedRole: 'Banquet Hall / Heritage Resort / Farmhouse Venue',
    priority: 'essential',
    costRatioOfBudget: 0.28,
    tradeoffsExplanation: 'Locking venue early dictates your date, capacity ceiling, catering policies, and setup restrictions.',
  },
  {
    category: 'Catering & Beverages',
    recommendedRole: 'Full-Service Event Catering Team & Live Bar Station',
    priority: 'essential',
    costRatioOfBudget: 0.25,
    tradeoffsExplanation: 'Directly impacts guest satisfaction. Live interactive food counters elevate the vibe over static buffets.',
  },
  {
    category: 'Photography & Cinematography',
    recommendedRole: 'Candid Wedding Photographer & Cinematic Drone Videographer',
    priority: 'essential',
    costRatioOfBudget: 0.10,
    tradeoffsExplanation: 'Preserves the memories of your lifetime. Look for consistent natural lighting style and verified turnaround guarantees.',
  },
  {
    category: 'Decor & Styling',
    recommendedRole: 'Stage Scenographer, Floral Designer & Mandap Decorator',
    priority: 'essential',
    costRatioOfBudget: 0.15,
    tradeoffsExplanation: 'A strong thematic focal point transforms photographs. Balancing fresh florals with silk florals can yield 30% savings.',
  },
  {
    category: 'Entertainment & Music',
    recommendedRole: 'Live Acoustic Ensemble / Celebrity DJ with LED Wall Console',
    priority: 'recommended',
    costRatioOfBudget: 0.06,
    tradeoffsExplanation: 'Maintains energy during transitions. Ensure sound permits comply with local city curfews (typically 10:00 PM).',
  },
  {
    category: 'Attire & Beauty',
    recommendedRole: 'Bridal & Groom Couture Stylist + Makeup Artist (HMUA)',
    priority: 'recommended',
    costRatioOfBudget: 0.08,
    tradeoffsExplanation: 'Book trials 4-6 weeks prior to finalize look under ceremony lighting conditions.',
  },
  {
    category: 'Invitations & Favors',
    recommendedRole: 'Custom Digital Stationery Designer & Artisanal Gift Curator',
    priority: 'optional',
    costRatioOfBudget: 0.03,
    tradeoffsExplanation: 'Eco-friendly digital invites save cost and paper while providing live RSVP headcounts.',
  },
  {
    category: 'Logistics & Coordination',
    recommendedRole: 'Day-of Event Shadow Coordinator & Guest Transit Fleet',
    priority: 'recommended',
    costRatioOfBudget: 0.05,
    tradeoffsExplanation: 'Takes logistical firefighting off the family so you can be fully present during the celebration.',
  },
];

const BIRTHDAY_VENDORS: VendorTemplate[] = [
  {
    category: 'Venue & Space',
    recommendedRole: 'Party Lounge, Cafe Terrace, or Banquet Hall',
    priority: 'essential',
    costRatioOfBudget: 0.25,
    tradeoffsExplanation: 'Ensures dedicated seating, sound insulation, and clean facilities.',
  },
  {
    category: 'Food & Cake',
    recommendedRole: 'Artisanal Fondant Cake Designer & Finger-Food Caterer',
    priority: 'essential',
    costRatioOfBudget: 0.35,
    tradeoffsExplanation: 'The centerpiece of every birthday. Verify custom flavor profiles and dietary labeling.',
  },
  {
    category: 'Decor & Ambience',
    recommendedRole: 'Organic Balloon Arch & Custom LED Neon Signage Specialist',
    priority: 'essential',
    costRatioOfBudget: 0.15,
    tradeoffsExplanation: 'Creates a vibrant photo-worthy backdrop for selfies and group portraits.',
  },
  {
    category: 'Entertainment & Games',
    recommendedRole: 'Party Emcee, Magician, DJ, or VR Gaming Host',
    priority: 'recommended',
    costRatioOfBudget: 0.15,
    tradeoffsExplanation: 'Keeps guests engaged and breaks the ice for cross-group interaction.',
  },
  {
    category: 'Photography',
    recommendedRole: 'Event Event Portraitist & Instant Photo-Booth Booth',
    priority: 'recommended',
    costRatioOfBudget: 0.07,
    tradeoffsExplanation: 'Instant print souvenirs provide delightful physical keepsakes for attendees.',
  },
  {
    category: 'Party Favors',
    recommendedRole: 'Personalized Hampers or Curated Gift Bag Supplier',
    priority: 'optional',
    costRatioOfBudget: 0.03,
    tradeoffsExplanation: 'Thoughtful token of appreciation for attending.',
  },
];

const COMMUNITY_VENDORS: VendorTemplate[] = [
  {
    category: 'Venue & Grounds',
    recommendedRole: 'Municipal Grounds, Community Center, or Park Pavilion',
    priority: 'essential',
    costRatioOfBudget: 0.22,
    tradeoffsExplanation: 'Requires municipal coordination, parking accessibility, and clear pedestrian thoroughfares.',
  },
  {
    category: 'Audio-Visual & Staging',
    recommendedRole: 'Stage Rigging, Truss Lighting & Outdoor PA Sound Company',
    priority: 'essential',
    costRatioOfBudget: 0.22,
    tradeoffsExplanation: 'Critical for audience visibility, clear speech audibility, and weather-safe electrical connections.',
  },
  {
    category: 'Safety & Emergency',
    recommendedRole: 'Licensed Security Personnel, First-Aid EMT & Fire Marshal',
    priority: 'essential',
    costRatioOfBudget: 0.16,
    tradeoffsExplanation: 'Mandatory civic compliance for public gatherings to ensure crowd safety.',
  },
  {
    category: 'Sanitation & Cleanliness',
    recommendedRole: 'Mobile Restrooms & Eco Waste Management / Recycling Crew',
    priority: 'essential',
    costRatioOfBudget: 0.12,
    tradeoffsExplanation: 'Leaving the public grounds pristine avoids municipal penalties and builds civic goodwill.',
  },
  {
    category: 'Refreshments & Stalls',
    recommendedRole: 'Community Food Truck Collective & Water Hydration Stations',
    priority: 'recommended',
    costRatioOfBudget: 0.15,
    tradeoffsExplanation: 'Provides diverse nourishment while potentially generating stall fee revenue for the event.',
  },
  {
    category: 'Publicity & Signage',
    recommendedRole: 'Wayfinding Banners, Entry Gates & Volunteer T-Shirt Printer',
    priority: 'recommended',
    costRatioOfBudget: 0.08,
    tradeoffsExplanation: 'Clear visual direction prevents bottlenecks and promotes event sponsor recognition.',
  },
  {
    category: 'Performers & Speakers',
    recommendedRole: 'Local Cultural Troupes, Civic Leaders & Guest Performers',
    priority: 'recommended',
    costRatioOfBudget: 0.05,
    tradeoffsExplanation: 'The heartbeat of community pride and engagement.',
  },
];

/**
 * Generates smart vendor recommendations based on event intake context.
 */
export function generateVendorChecklist(intake: EventIntake): VendorItem[] {
  let templates = WEDDING_VENDORS;
  if (intake.eventType === 'birthday') {
    templates = BIRTHDAY_VENDORS;
  } else if (intake.eventType === 'community') {
    templates = COMMUNITY_VENDORS;
  } else if (intake.eventType === 'celebration') {
    templates = WEDDING_VENDORS.slice(0, 6);
  }

  const safeBudget = Math.max(0, intake.budget);

  return templates.map((tmpl, idx) => {
    const estimatedCost = Math.round(safeBudget * tmpl.costRatioOfBudget);

    return {
      id: `vendor-${idx + 1}`,
      category: tmpl.category,
      recommendedRole: tmpl.recommendedRole,
      bookingStatus: 'researching',
      priority: tmpl.priority,
      estimatedCost,
      actualCost: 0,
      assignedVendorName: '',
      contactNotes: '',
      quotes: [],
      tradeoffsExplanation: tmpl.tradeoffsExplanation,
    };
  });
}
