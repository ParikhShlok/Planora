export type EventType = 'wedding' | 'birthday' | 'community' | 'celebration';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type Priority =
  | 'food'
  | 'photography'
  | 'decoration'
  | 'entertainment'
  | 'accessibility'
  | 'sustainability'
  | 'cultural';

export type IndoorOutdoor = 'indoor' | 'outdoor' | 'hybrid';

export interface EventIntake {
  title: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  isApproximateDate: boolean;
  timeframeDescription?: string;
  city: string;
  venuePreference: string;
  budget: number;
  currency: Currency;
  guestCount: number;
  styleTheme: string;
  colorPalette: string[];
  isIndoorOutdoor: IndoorOutdoor;
  priorities: Priority[];
  dietaryRequirements: string[];
  accessibilityNeeds: string[];
  notes: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  notes?: string;
  isCustom?: boolean;
}

export interface CategoryAllocation {
  category: string;
  percentageOfBudget: number;
  allocatedBudget: number;
  estimatedSpent: number;
  actualSpent: number;
  items: BudgetItem[];
}

export interface SavingRecommendation {
  id: string;
  title: string;
  category: string;
  potentialSavings: number;
  tradeoff: string;
  applied?: boolean;
}

export interface BudgetBreakdown {
  totalBudget: number;
  contingencyPercent: number; // e.g. 10
  contingencyAmount: number;
  totalEstimated: number;
  totalActual: number;
  remainingEstimatedBalance: number;
  remainingActualBalance: number;
  costPerGuestEstimated: number;
  costPerGuestActual: number;
  categories: CategoryAllocation[];
  warnings: string[];
  savingRecommendations: SavingRecommendation[];
}

export type MilestoneCategory =
  | '6_months_plus'
  | '3_to_6_months'
  | '1_to_3_months'
  | '2_to_4_weeks'
  | 'week_of'
  | 'day_of'
  | 'post_event';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TimelineTask {
  id: string;
  title: string;
  category: string;
  milestone: MilestoneCategory;
  dueDate: string; // YYYY-MM-DD
  relativeOffsetDays: number; // e.g. -180, -90, -30, -7, 0, +1
  priority: TaskPriority;
  owner: string;
  completed: boolean;
  notes?: string;
  dependencies?: string[];
  isOverdue?: boolean;
  isCustom?: boolean;
}

export type BookingStatus = 'researching' | 'shortlisted' | 'contacted' | 'booked' | 'declined';
export type VendorPriority = 'essential' | 'recommended' | 'optional';

export interface VendorQuote {
  id: string;
  vendorName: string;
  contactPerson?: string;
  contactInfo?: string;
  quotedAmount: number;
  inclusions: string;
  pros: string;
  cons: string;
  isPreferred?: boolean;
}

export interface VendorItem {
  id: string;
  category: string;
  recommendedRole: string;
  bookingStatus: BookingStatus;
  priority: VendorPriority;
  estimatedCost: number;
  actualCost?: number;
  assignedVendorName?: string;
  contactNotes?: string;
  quotes: VendorQuote[];
  tradeoffsExplanation: string;
  isCustom?: boolean;
}

export interface DayScheduleItem {
  id: string;
  timeSlot: string; // e.g. "09:00 AM - 10:30 AM"
  activity: string;
  location: string;
  responsibleParty: string;
  notes: string;
}

export interface ThemeConcept {
  id: string;
  title: string;
  description: string;
  colorAccents: string[];
  costImpact: 'low' | 'moderate' | 'high';
  effort: 'diy' | 'moderate' | 'professional';
}

export interface FoodConcept {
  concept: string;
  highlights: string[];
  dietaryAccommodations: string;
  servingStyle: string;
}

export interface EntertainmentConcept {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
}

export interface WeatherContingency {
  primaryRisk: string;
  backupPlan: string;
  timelineBufferMinutes: number;
}

export interface PersonalizedIdeas {
  themesAndDecor: ThemeConcept[];
  foodAndMenu: FoodConcept;
  entertainmentAndActivities: EntertainmentConcept[];
  weatherContingency: WeatherContingency;
  accessibilityAndInclusion: string[];
  sustainabilityTips: string[];
  culturalConsiderations: string[];
  dayOfSchedule: DayScheduleItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  content: string;
  actionTriggered?: {
    type: 'UPDATE_BUDGET' | 'SHIFT_DATE' | 'ADD_TASK' | 'ADD_VENDOR' | 'RECALCULATE' | 'UPDATE_GUESTS';
    description: string;
    payload?: any;
  };
  modeUsed?: 'gemini-live' | 'local-engine';
}

export interface EventPlan {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  intake: EventIntake;
  budgetBreakdown: BudgetBreakdown;
  timeline: TimelineTask[];
  vendors: VendorItem[];
  ideas: PersonalizedIdeas;
  chatHistory: ChatMessage[];
  version: number;
}
