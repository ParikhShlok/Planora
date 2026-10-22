import { PersonalizedIdeas, EventIntake, DayScheduleItem, ThemeConcept, EventType } from '../types';

export function generatePersonalizedIdeas(intake: EventIntake): PersonalizedIdeas {
  const { eventType, isIndoorOutdoor, priorities, dietaryRequirements, accessibilityNeeds, styleTheme, colorPalette } = intake;

  // 1. Themes & Decor Concepts
  const themesAndDecor: ThemeConcept[] = [];
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : ['#D4AF37', '#FFFDD0', '#2E4057'];

  if (eventType === 'wedding') {
    themesAndDecor.push({
      id: 'theme-1',
      title: styleTheme ? `Bespoke ${styleTheme} Elegance` : 'Timeless Royal Heritage & Modern Romance',
      description: 'Grand floral archways, warm ambient fairy lights, metallic brass accents, and flowing organza drapes that create depth and grandeur.',
      colorAccents: palette,
      costImpact: 'high',
      effort: 'professional',
    });
    themesAndDecor.push({
      id: 'theme-2',
      title: 'Botanical Garden & Sustainable Earth Tones',
      description: 'Potted palms, locally sourced seasonal marigolds/jasmine, terracotta accents, and zero-single-use plastic staging.',
      colorAccents: ['#2D5A27', '#E8D8C8', '#C48B71'],
      costImpact: 'moderate',
      effort: 'moderate',
    });
  } else if (eventType === 'birthday') {
    themesAndDecor.push({
      id: 'theme-1',
      title: styleTheme ? `${styleTheme} Celebration` : 'Retro Neon Glow & Chic Lounge',
      description: 'Custom neon birthday signage, reflective acrylic tables, balloon garlands with metallic orbs, and mood uplighting.',
      colorAccents: palette.length ? palette : ['#FF1493', '#00FFFF', '#1A1A24'],
      costImpact: 'moderate',
      effort: 'diy',
    });
    themesAndDecor.push({
      id: 'theme-2',
      title: 'Velvet Sunset Minimalist Luxe',
      description: 'Warm amber tones, pampas grass installations, personalized Polaroid memory clothesline, and velvet lounge cushions.',
      colorAccents: ['#D97443', '#E9B872', '#4B3832'],
      costImpact: 'low',
      effort: 'diy',
    });
  } else if (eventType === 'community') {
    themesAndDecor.push({
      id: 'theme-1',
      title: 'Vibrant Heritage & Cultural Tapestry',
      description: 'High-visibility festive fabric canopies, dynamic cultural motif arches, modular community art stalls, and solar festoon lights.',
      colorAccents: palette.length ? palette : ['#E63946', '#F4A261', '#2A9D8F'],
      costImpact: 'moderate',
      effort: 'moderate',
    });
    themesAndDecor.push({
      id: 'theme-2',
      title: 'Eco-Forward Green Neighborhood Fair',
      description: 'Upcycled wooden signage, potted sapling giveaways that double as aisle decor, and burlap table dressing.',
      colorAccents: ['#588157', '#A3B18A', '#344E41'],
      costImpact: 'low',
      effort: 'diy',
    });
  } else {
    themesAndDecor.push({
      id: 'theme-1',
      title: 'Contemporary Festivity & Golden Hour Warmth',
      description: 'Clean architectural lines, warm incandescent filament bulbs, elegant table runners, and personalized thank-you stationery.',
      colorAccents: palette,
      costImpact: 'moderate',
      effort: 'moderate',
    });
  }

  // 2. Food & Menu
  const dietaryNotice = dietaryRequirements && dietaryRequirements.length > 0
    ? `Dedicated stations with clear color-coded allergen & dietary labeling for: ${dietaryRequirements.join(', ')}.`
    : 'Comprehensive vegetarian, vegan, and gluten-sensitive choices clearly labeled with hygienic sneeze guards.';

  const foodConcept = {
    concept: eventType === 'wedding'
      ? 'Royal Multi-Regional Feast with Interactive Live Street Food Counters'
      : eventType === 'birthday'
      ? 'Gourmet Sliders, Live Wood-Fired Pizza, Craft Mocktails & Dessert Lab'
      : 'Community Food Alley with Local Artisanal Snacks & Chilled Beverage Stations',
    highlights: eventType === 'wedding'
      ? ['Signature Welcome Elixir Bar', 'Live Chaat & Dosa Theater', 'Slow-cooked Heritage Biryani & Dal', 'Artisanal Kulfi & Warm Jalebi Tower']
      : eventType === 'birthday'
      ? ['Smash Sliders & Truffle Fries', 'Custom Mocktail Chemistry Bar', 'Molten Lava Brownie Skillets', 'Gourmet Donut Wall']
      : ['Eco-friendly Paper Cone Street Snacks', 'Regional Chai & Fresh Coconut Water', 'Community Grain Bowls', 'Wholesome Fruit Skewers'],
    dietaryAccommodations: dietaryNotice,
    servingStyle: eventType === 'birthday' ? 'Roaming Small Plates & Live Stations' : 'Tiered Buffet with Live Interactive Cooking Counters',
  };

  // 3. Entertainment
  const entertainmentAndActivities = [];
  if (eventType === 'wedding') {
    entertainmentAndActivities.push({
      id: 'ent-1',
      title: 'Acoustic Sitar & Fusion Flute Welcome',
      description: 'Sets a serene, regal ambiance as guests arrive and mingle during the welcome reception.',
      targetAudience: 'All Guests & Family Elders',
    });
    entertainmentAndActivities.push({
      id: 'ent-2',
      title: 'High-Energy Sangeet / DJ Dance Floor with Sparkular Pyro Fountains',
      description: 'Cold-spark indoor-safe pyro machines firing during key choreographies and celebration peaks.',
      targetAudience: 'Youth & Party Enthusiasts',
    });
    entertainmentAndActivities.push({
      id: 'ent-3',
      title: '360° Slow-Motion Video Glam Booth',
      description: 'Guests step onto a rotating platform that captures instant shareable social clips.',
      targetAudience: 'Content Creators & Families',
    });
  } else if (eventType === 'birthday') {
    entertainmentAndActivities.push({
      id: 'ent-1',
      title: 'Interactive Roast & Toast Trivia Quiz',
      description: 'Smartphone-based live pub quiz about the birthday person with humorous prizes.',
      targetAudience: 'Close Friends & Family',
    });
    entertainmentAndActivities.push({
      id: 'ent-2',
      title: 'Silent Disco / Club DJ Set',
      description: 'Multi-channel wireless headphones allowing diverse music styles without noise violations.',
      targetAudience: 'Party Crowd',
    });
  } else {
    entertainmentAndActivities.push({
      id: 'ent-1',
      title: 'Live Local Bands & Folk Dance Performances',
      description: 'Showcasing local talent across rotating 30-minute high-energy sets.',
      targetAudience: 'Community Neighbors & Families',
    });
    entertainmentAndActivities.push({
      id: 'ent-2',
      title: 'Kids Creative Maker Corner & Face Painting',
      description: 'Engaging sensory crafts, giant Jenga, and community mural coloring.',
      targetAudience: 'Children & Parents',
    });
  }

  // 4. Weather & Contingency
  const weatherContingency = {
    primaryRisk: isIndoorOutdoor === 'outdoor' ? 'Sudden Rain Shower / High Afternoon UV Heat' : 'Air Conditioning Overload / Venue Power Interruption',
    backupPlan: isIndoorOutdoor === 'outdoor'
      ? 'Contract an on-call waterproof German hangar canopy or secure an adjacent banquet hall backup with 48-hour activation clause. Place mist fans for daytime heat.'
      : 'Verify venue has dual auto-switch silent diesel generator backup (DG set) and dedicated technical operator on standby.',
    timelineBufferMinutes: 30,
  };

  // 5. Accessibility & Sustainability
  const accessibilityAndInclusion = [
    'Zero-step step-free or ramp access to all stages, dining zones, and restrooms.',
    'Designated priority seating with unobstructed sightlines for seniors and guests using mobility aids.',
    'Clear, high-contrast bilingual signage with directional icons at eye level.',
  ];
  if (accessibilityNeeds && accessibilityNeeds.length > 0) {
    accessibilityAndInclusion.unshift(`Customized provisions tailored for: ${accessibilityNeeds.join(', ')}.`);
  }

  const sustainabilityTips = [
    'Eliminate single-use plastic water bottles: provide elegant glass carafes and filtered hydration stations.',
    'Donate surplus untouched catering to local verified food rescue charities (e.g. Robin Hood Army / Feeding India).',
    'Opt for digital invites and QR-code menu cards to eliminate 95% of paper waste.',
    'Rent living potted plants for stage greenery instead of cut flowers that end up in landfills.',
  ];

  // 6. Cultural Considerations
  const culturalConsiderations = priorities.includes('cultural')
    ? [
        'Honor sacred auspicious timings (muhurat / ceremonial hours) with a 20-minute operational buffer.',
        'Provide quiet prayer/meditation dressing suites for ceremonial elders.',
        'Curate traditional ritual items (puja samagri / symbolic tokens) in advance to prevent last-minute delays.',
      ]
    : [
        'Ensure welcoming, inclusive ambiance respectful of varied cultural backgrounds among attendees.',
        'Offer non-alcoholic festive signature beverages alongside any bar service.',
      ];

  // 7. Day-of Schedule
  const dayOfSchedule: DayScheduleItem[] = generateDayOfSchedule(eventType);

  return {
    themesAndDecor,
    foodAndMenu: foodConcept,
    entertainmentAndActivities,
    weatherContingency,
    accessibilityAndInclusion,
    sustainabilityTips,
    culturalConsiderations,
    dayOfSchedule,
  };
}

function generateDayOfSchedule(eventType: EventType): DayScheduleItem[] {
  if (eventType === 'wedding') {
    return [
      { id: 'sch-1', timeSlot: '07:00 AM - 09:30 AM', activity: 'Vendor Load-In & Stage Florals Setup', location: 'Main Banquet & Lawn', responsibleParty: 'Decor Lead & Event Coordinator', notes: 'Verify power points and floral freshness' },
      { id: 'sch-2', timeSlot: '09:30 AM - 11:30 AM', activity: 'Hair, Makeup & Couple Portrait Session', location: 'Bridal Suite & Gardens', responsibleParty: 'Lead HMUA & Photographer', notes: 'Keep emergency garment steaming kit handy' },
      { id: 'sch-3', timeSlot: '11:30 AM - 12:30 PM', activity: 'Guest Welcome & Welcome Drinks Reception', location: 'Entrance Foyer', responsibleParty: 'Hospitality Team', notes: 'Live instrumental fusion playing' },
      { id: 'sch-4', timeSlot: '12:30 PM - 02:00 PM', activity: 'Main Auspicious Ceremony / Vows Exchange', location: 'Mandap / Main Stage', responsibleParty: 'Officiant & Core Family', notes: 'Photographer captures key ritual moments' },
      { id: 'sch-5', timeSlot: '02:00 PM - 03:45 PM', activity: 'Grand Royal Banquet Lunch Service', location: 'Dining Pavilion', responsibleParty: 'Catering Lead', notes: 'Live counters active; VIP tables serviced' },
      { id: 'sch-6', timeSlot: '04:00 PM - 06:00 PM', activity: 'High-Tea, Photos with Couple & Sweet Departures', location: 'Lawn Pavilion', responsibleParty: 'Hospitality Host', notes: 'Guest favors and Polaroid takeaways distributed' },
      { id: 'sch-7', timeSlot: '06:00 PM - 08:00 PM', activity: 'Teardown, Inventory Sign-off & Balances', location: 'All Zones', responsibleParty: 'Lead Coordinator', notes: 'Retrieve security deposit and check rentals' },
    ];
  } else if (eventType === 'birthday') {
    return [
      { id: 'sch-1', timeSlot: '03:00 PM - 05:00 PM', activity: 'Venue Access, Balloon Arch Setup & Soundcheck', location: 'Party Lounge', responsibleParty: 'Host & Decorator', notes: 'Test playlist and neon lighting' },
      { id: 'sch-2', timeSlot: '05:30 PM - 06:30 PM', activity: 'Guests Arrive, Welcome Cocktails & Photo Booth', location: 'Lounge Bar', responsibleParty: 'Bartender & Photographer', notes: 'Polaroid guestbook signing' },
      { id: 'sch-3', timeSlot: '06:30 PM - 07:30 PM', activity: 'Icebreaker Games, Trivia Roast & Dancing', location: 'Dance Floor', responsibleParty: 'Party Emcee / Host', notes: 'Music tempo turns upbeat' },
      { id: 'sch-4', timeSlot: '07:30 PM - 08:00 PM', activity: 'Cake Cutting Ceremony & Speeches / Toast', location: 'Central Stage', responsibleParty: 'Birthday VIP & Best Friends', notes: 'Sparkler candle moment and group photo' },
      { id: 'sch-5', timeSlot: '08:00 PM - 10:00 PM', activity: 'Dinner Buffet, Live Sliders & Open Dance Floor', location: 'Dining & Dance Area', responsibleParty: 'Caterer & DJ', notes: 'Continuous upbeat music' },
      { id: 'sch-6', timeSlot: '10:00 PM - 10:30 PM', activity: 'Party Favors Distribution & Wrap Up', location: 'Exit Foyer', responsibleParty: 'Host', notes: 'Venue handover and payment settlement' },
    ];
  } else {
    return [
      { id: 'sch-1', timeSlot: '08:00 AM - 10:00 AM', activity: 'Site Staging, Sound AV Rigging & EMT Station Setup', location: 'Community Grounds', responsibleParty: 'Committee & Tech Crew', notes: 'Safety and barricade inspection' },
      { id: 'sch-2', timeSlot: '10:00 AM - 10:30 AM', activity: 'Inauguration Ceremony & Opening Civic Address', location: 'Central Stage', responsibleParty: 'Committee President & Dignitaries', notes: 'National anthem / traditional lamp lighting' },
      { id: 'sch-3', timeSlot: '10:30 AM - 01:00 PM', activity: 'Cultural Performances, Exhibitions & Kids Corner', location: 'All Zones', responsibleParty: 'Stage Manager & Volunteers', notes: 'Announcements every 30 minutes' },
      { id: 'sch-4', timeSlot: '01:00 PM - 02:30 PM', activity: 'Community Lunch & Food Truck Fair', location: 'Food Court', responsibleParty: 'Food Vendors & Waste Volunteers', notes: 'Keep hydration barrels refilled' },
      { id: 'sch-5', timeSlot: '02:30 PM - 05:00 PM', activity: 'Sports Finals, Talent Contests & Award Ceremony', location: 'Main Grounds', responsibleParty: 'Emcee & Judges', notes: 'Trophies and volunteer felicitations' },
      { id: 'sch-6', timeSlot: '05:00 PM - 06:30 PM', activity: 'Eco Teardown, Waste Segregation & Site Handover', location: 'All Grounds', responsibleParty: 'Volunteer Clean Crew', notes: 'Leave public grounds spotless' },
    ];
  }
}
