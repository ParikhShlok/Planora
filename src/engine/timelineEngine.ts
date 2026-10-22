import { TimelineTask, EventType, MilestoneCategory, TaskPriority } from '../types';

interface TaskTemplate {
  title: string;
  category: string;
  offsetDays: number;
  priority: TaskPriority;
  owner: string;
  notes?: string;
  milestone: MilestoneCategory;
}

const WEDDING_TASK_TEMPLATES: TaskTemplate[] = [
  {
    title: 'Finalize Event Vision, Guest List Ceiling & Baseline Budget',
    category: 'Planning',
    offsetDays: -180,
    priority: 'critical',
    owner: 'Couple & Family',
    notes: 'Agree on the core priorities, guest headcount cap, and financial allocations.',
    milestone: '6_months_plus',
  },
  {
    title: 'Research & Lock Venue with Advance Deposit',
    category: 'Venue',
    offsetDays: -160,
    priority: 'critical',
    owner: 'Planner / Couple',
    notes: 'Verify catering guidelines, noise curfews, liquor licensing, and parking capacity.',
    milestone: '6_months_plus',
  },
  {
    title: 'Book Lead Photographer & Cinematographer',
    category: 'Photography',
    offsetDays: -140,
    priority: 'high',
    owner: 'Couple',
    notes: 'High-demand photographers book out 6+ months in advance. Request full raw & edited terms.',
    milestone: '3_to_6_months',
  },
  {
    title: 'Shortlist Caterer & Schedule Menu Tasting',
    category: 'Catering',
    offsetDays: -120,
    priority: 'high',
    owner: 'Couple & Families',
    notes: 'Test signature appetizers, live counters, and confirm allergy/dietary flexibility.',
    milestone: '3_to_6_months',
  },
  {
    title: 'Design Invitations & Distribute "Save The Date" Digital Notices',
    category: 'Stationery',
    offsetDays: -90,
    priority: 'high',
    owner: 'Couple',
    notes: 'Gives out-of-town guests ample time to book transit and accommodations.',
    milestone: '3_to_6_months',
  },
  {
    title: 'Finalize Stage Decor, Theme Palette & Florist Contracts',
    category: 'Decor',
    offsetDays: -60,
    priority: 'medium',
    owner: 'Decorator',
    notes: 'Inspect sample mockups for stage backdrop, floral arches, and centerpieces.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Send Formal Invitations & Launch RSVP Tracking Portal',
    category: 'Stationery',
    offsetDays: -45,
    priority: 'high',
    owner: 'Couple',
    notes: 'Include dietary preference checkboxes and travel guidance.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Order Bridal & Groom Outfits & Schedule Initial Fittings',
    category: 'Attire',
    offsetDays: -40,
    priority: 'medium',
    owner: 'Couple',
    notes: 'Allow 2-3 weeks buffer for alterations and footwear pairing.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Lock DJ, Sound & Master of Ceremonies (MC) Script',
    category: 'Entertainment',
    offsetDays: -25,
    priority: 'medium',
    owner: 'Entertainment Lead',
    notes: 'Provide curated playlist, must-play tracks, and blacklisted songs.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Confirm Final Headcount with Caterer & Finalize Seating',
    category: 'Catering',
    offsetDays: -14,
    priority: 'critical',
    owner: 'Couple / Lead Coordinator',
    notes: 'Reconcile RSVP drop-offs and lock plate count to avoid extra overcharge fees.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Conduct Venue Walkthrough & Confirm Vendor Load-In Schedule',
    category: 'Logistics',
    offsetDays: -7,
    priority: 'high',
    owner: 'Lead Coordinator',
    notes: 'Verify electrical load, generator backup, green rooms, and delivery timings.',
    milestone: 'week_of',
  },
  {
    title: 'Pack Emergency Kit & Distribute Day-Of Run-of-Show to Core Team',
    category: 'Coordination',
    offsetDays: -2,
    priority: 'high',
    owner: 'Best Man / Maid of Honor / Coordinator',
    notes: 'Safety pins, stain remover, mints, power banks, vendor phone directory.',
    milestone: 'week_of',
  },
  {
    title: 'Oversee Vendor Setup, Soundchecks & Welcome VIP Arrivals',
    category: 'Execution',
    offsetDays: 0,
    priority: 'critical',
    owner: 'Day-of Coordinator',
    notes: 'Keep the event flowing smoothly according to the hourly run-of-show schedule.',
    milestone: 'day_of',
  },
  {
    title: 'Settle Final Vendor Balances & Retrieve Security Deposits',
    category: 'Post-Event',
    offsetDays: 2,
    priority: 'medium',
    owner: 'Lead Coordinator',
    notes: 'Inspect venue condition and sign off on rental return inventories.',
    milestone: 'post_event',
  },
];

const BIRTHDAY_TASK_TEMPLATES: TaskTemplate[] = [
  {
    title: 'Decide Party Theme, Guest Count & Budget Ceiling',
    category: 'Planning',
    offsetDays: -45,
    priority: 'high',
    owner: 'Host',
    notes: 'Select retro, neon, tropical, or minimalist aesthetic.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Reserve Venue Hall or Backyard Setup',
    category: 'Venue',
    offsetDays: -35,
    priority: 'critical',
    owner: 'Host',
    notes: 'Confirm speaker sound allowance and setup window.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Send Digital Invitations with RSVP Deadline',
    category: 'Invites',
    offsetDays: -25,
    priority: 'high',
    owner: 'Host',
    notes: 'Collect dietary restrictions and favorite song requests.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Order Custom Themed Birthday Cake & Dessert Treats',
    category: 'Bakery',
    offsetDays: -18,
    priority: 'high',
    owner: 'Host',
    notes: 'Specify flavor, size/weight, and delivery time window.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Source Balloons, Photo Backdrop & Lighting Props',
    category: 'Decor',
    offsetDays: -12,
    priority: 'medium',
    owner: 'Decor Lead',
    notes: 'Neon signs, selfie props, table runners.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Curate Party Playlist or Confirm DJ / Game Host',
    category: 'Entertainment',
    offsetDays: -7,
    priority: 'medium',
    owner: 'Host / DJ',
    notes: 'Organize icebreakers, trivia, or dancing sets.',
    milestone: 'week_of',
  },
  {
    title: 'Finalize Food & Drinks Quantity based on RSVPs',
    category: 'Catering',
    offsetDays: -3,
    priority: 'critical',
    owner: 'Host',
    notes: 'Stock ice, non-alcoholic beverages, finger foods, and disposables.',
    milestone: 'week_of',
  },
  {
    title: 'Setup Decor, Test Music Sound & Chill Drinks',
    category: 'Execution',
    offsetDays: 0,
    priority: 'critical',
    owner: 'Host / Friends',
    notes: 'Welcome guests and kick off party schedule!',
    milestone: 'day_of',
  },
];

const COMMUNITY_TASK_TEMPLATES: TaskTemplate[] = [
  {
    title: 'Draft Community Event Charter, Committee Roles & Funding Goal',
    category: 'Governance',
    offsetDays: -90,
    priority: 'critical',
    owner: 'Organizing Committee',
    notes: 'Establish clear objectives, permits needed, and safety protocols.',
    milestone: '3_to_6_months',
  },
  {
    title: 'Submit City / Municipal Park Permits & Police Clearances',
    category: 'Permits',
    offsetDays: -70,
    priority: 'critical',
    owner: 'Liaison Lead',
    notes: 'Public assembly, loudspeaker licenses, fire safety clearance.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Procure Stage, Sound AV & Power Generator Rental Quotes',
    category: 'Infrastructure',
    offsetDays: -50,
    priority: 'high',
    owner: 'Technical Coordinator',
    notes: 'Calculate total wattage needed for sound, lighting, and food stalls.',
    milestone: '1_to_3_months',
  },
  {
    title: 'Launch Call for Volunteers, Exhibitors & Community Performers',
    category: 'Publicity',
    offsetDays: -35,
    priority: 'high',
    owner: 'Outreach Lead',
    notes: 'Promote through local social groups, flyers, and neighborhood bulletins.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Design Event Map with Accessible Ramps, Restrooms & First-Aid',
    category: 'Accessibility',
    offsetDays: -20,
    priority: 'critical',
    owner: 'Safety Coordinator',
    notes: 'Ensure ADA / universal accessibility, wheelchair paths, and clear wayfinding.',
    milestone: '2_to_4_weeks',
  },
  {
    title: 'Brief Volunteers & Rehearse Emergency Response Protocols',
    category: 'Operations',
    offsetDays: -7,
    priority: 'high',
    owner: 'Volunteer Lead',
    notes: 'Assign shifts for entry gates, trash collection, and lost child booth.',
    milestone: 'week_of',
  },
  {
    title: 'Site Load-In, Rigging & Municipal Inspection Walkthrough',
    category: 'Execution',
    offsetDays: -1,
    priority: 'critical',
    owner: 'Committee Head',
    notes: 'Final safety check on barricades, cables, and fire extinguishers.',
    milestone: 'week_of',
  },
  {
    title: 'Event Day Management, Live Announcements & Crowd Safety',
    category: 'Execution',
    offsetDays: 0,
    priority: 'critical',
    owner: 'Committee & Volunteers',
    notes: 'Run stage performances, monitor hydration stations, ensure community warmth.',
    milestone: 'day_of',
  },
  {
    title: 'Site Teardown, Eco-Friendly Waste Sorting & Green Site Handover',
    category: 'Post-Event',
    offsetDays: 1,
    priority: 'high',
    owner: 'Clean-up Crew',
    notes: 'Compost organic waste, recycle plastic, and return venue spotless.',
    milestone: 'post_event',
  },
];

/**
 * Calculates YYYY-MM-DD shifted by offsetDays from baseDateString.
 */
export function calculateOffsetDate(baseDateString: string, offsetDays: number): string {
  const base = new Date(baseDateString);
  if (isNaN(base.getTime())) {
    // If date is invalid or approximate, use today as relative anchor
    const today = new Date();
    today.setDate(today.getDate() + Math.max(0, 30 + offsetDays));
    return today.toISOString().split('T')[0];
  }

  const result = new Date(base.getTime());
  result.setDate(result.getDate() + offsetDays);
  return result.toISOString().split('T')[0];
}

/**
 * Checks if a task is overdue based on current date.
 */
export function isTaskOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  return dueDate < todayStr;
}

/**
 * Generates initial timeline tasks based on event type and target date.
 */
export function generateTimelineTasks(eventType: EventType, eventDate: string): TimelineTask[] {
  let templates = WEDDING_TASK_TEMPLATES;
  if (eventType === 'birthday') {
    templates = BIRTHDAY_TASK_TEMPLATES;
  } else if (eventType === 'community') {
    templates = COMMUNITY_TASK_TEMPLATES;
  } else if (eventType === 'celebration') {
    templates = WEDDING_TASK_TEMPLATES.slice(0, 10);
  }

  return templates.map((tmpl, index) => {
    const dueDate = calculateOffsetDate(eventDate, tmpl.offsetDays);
    const overdue = isTaskOverdue(dueDate, false);

    return {
      id: `task-${index + 1}`,
      title: tmpl.title,
      category: tmpl.category,
      milestone: tmpl.milestone,
      dueDate,
      relativeOffsetDays: tmpl.offsetDays,
      priority: tmpl.priority,
      owner: tmpl.owner,
      completed: false,
      notes: tmpl.notes,
      isOverdue: overdue,
    };
  });
}

/**
 * Recalculates due dates of all tasks when the event date is updated.
 * Preserves custom tasks and completed statuses.
 */
export function recalculateTimelineDates(tasks: TimelineTask[], newEventDate: string): TimelineTask[] {
  return tasks.map(task => {
    const newDueDate = calculateOffsetDate(newEventDate, task.relativeOffsetDays);
    const overdue = isTaskOverdue(newDueDate, task.completed);
    return {
      ...task,
      dueDate: newDueDate,
      isOverdue: overdue,
    };
  });
}
