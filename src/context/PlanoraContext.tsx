import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EventPlan,
  EventIntake,
  BudgetItem,
  TimelineTask,
  VendorQuote,
  BookingStatus,
  ChatMessage,
} from '../types';
import { getDemoPlans, createInitialPlan } from '../data/demoPlans';
import { recalculateBudget } from '../engine/budgetCalculator';
import { recalculateTimelineDates } from '../engine/timelineEngine';
import { getAIPlannerResponse } from '../engine/aiProvider';

const STORAGE_KEY = 'planora_ai_plans_v1';
const ACTIVE_ID_KEY = 'planora_ai_active_id_v1';
const API_KEY_STORAGE = 'planora_ai_custom_gemini_key';

export type NavigationTab = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'assistant' | 'settings';

interface PlanoraContextType {
  plans: EventPlan[];
  activePlan: EventPlan;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  setActivePlanId: (id: string) => void;
  createNewPlan: (intake: EventIntake) => void;
  deletePlan: (id: string) => void;
  resetToDemo: () => void;
  exportPlanJSON: () => void;
  importPlanJSON: (jsonData: string) => { success: boolean; error?: string };
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  isGeneratingAI: boolean;
  sendChatMessage: (content: string) => Promise<void>;
  updateBudgetAmount: (newBudget: number) => void;
  updateGuestCount: (newGuests: number) => void;
  shiftEventDate: (newDate: string) => void;
  updateContingencyPercent: (percent: number) => void;
  toggleTaskComplete: (taskId: string) => void;
  addCustomTask: (task: Omit<TimelineTask, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  updateVendorStatus: (vendorId: string, status: BookingStatus) => void;
  addVendorQuote: (vendorId: string, quote: Omit<VendorQuote, 'id'>) => void;
  setPreferredQuote: (vendorId: string, quoteId: string) => void;
  addCustomBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (itemId: string, patch: Partial<BudgetItem>) => void;
  deleteBudgetItem: (itemId: string) => void;
  applySavingRecommendation: (recommendationId: string) => void;
}

const PlanoraContext = createContext<PlanoraContextType | undefined>(undefined);

export const PlanoraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<EventPlan[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].intake) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored plans, loading defaults', e);
    }
    return getDemoPlans();
  });

  const [activePlanId, setActivePlanIdState] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (storedId) return storedId;
    } catch {}
    return plans[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [customApiKey, setCustomApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Sync plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (e) {
      console.error('LocalStorage write failed', e);
    }
  }, [plans]);

  // Sync activePlanId to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_ID_KEY, activePlanId);
    } catch {}
  }, [activePlanId]);

  const setCustomApiKey = (key: string) => {
    setCustomApiKeyState(key);
    try {
      localStorage.setItem(API_KEY_STORAGE, key);
    } catch {}
  };

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0] || getDemoPlans()[0];

  const updateActivePlan = (updater: (prev: EventPlan) => EventPlan) => {
    setPlans(prevPlans => {
      return prevPlans.map(p => {
        if (p.id === activePlan.id) {
          const updated = updater(p);
          return {
            ...updated,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
    });
  };

  const setActivePlanId = (id: string) => {
    const exists = plans.some(p => p.id === id);
    if (exists) {
      setActivePlanIdState(id);
    }
  };

  const createNewPlan = (intake: EventIntake) => {
    const newPlan = createInitialPlan(intake);
    setPlans(prev => [newPlan, ...prev]);
    setActivePlanIdState(newPlan.id);
    setActiveTab('overview');
  };

  const deletePlan = (id: string) => {
    if (plans.length <= 1) {
      alert('You must have at least one active plan. You can create a new plan or reset to demo.');
      return;
    }
    const remaining = plans.filter(p => p.id !== id);
    setPlans(remaining);
    if (activePlanId === id) {
      setActivePlanIdState(remaining[0].id);
    }
  };

  const resetToDemo = () => {
    const demo = getDemoPlans();
    setPlans(demo);
    setActivePlanIdState(demo[0].id);
    setActiveTab('overview');
  };

  const exportPlanJSON = () => {
    const blob = new Blob([JSON.stringify(activePlan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planora-${activePlan.intake.eventType}-${activePlan.intake.title.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importPlanJSON = (jsonData: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.intake || !parsed.intake.title || !parsed.intake.eventType) {
        return { success: false, error: 'Invalid plan schema: missing intake configuration.' };
      }
      const importedPlan: EventPlan = {
        ...parsed,
        id: `plan-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };
      setPlans(prev => [importedPlan, ...prev]);
      setActivePlanIdState(importedPlan.id);
      setActiveTab('overview');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Malformed JSON file.' };
    }
  };

  // Helper State Mutations
  const updateBudgetAmount = (newBudget: number) => {
    const safe = Math.max(0, newBudget);
    updateActivePlan(plan => {
      const currentItems = plan.budgetBreakdown.categories.flatMap(c => c.items);
      const newBreakdown = recalculateBudget(
        safe,
        currentItems,
        plan.intake.eventType,
        plan.intake.guestCount,
        plan.budgetBreakdown.contingencyPercent
      );
      return {
        ...plan,
        intake: { ...plan.intake, budget: safe },
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const updateGuestCount = (newGuests: number) => {
    const safe = Math.max(1, newGuests);
    updateActivePlan(plan => {
      const currentItems = plan.budgetBreakdown.categories.flatMap(c => c.items);
      const newBreakdown = recalculateBudget(
        plan.intake.budget,
        currentItems,
        plan.intake.eventType,
        safe,
        plan.budgetBreakdown.contingencyPercent
      );
      return {
        ...plan,
        intake: { ...plan.intake, guestCount: safe },
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const shiftEventDate = (newDate: string) => {
    updateActivePlan(plan => {
      const newTimeline = recalculateTimelineDates(plan.timeline, newDate);
      return {
        ...plan,
        intake: { ...plan.intake, date: newDate },
        timeline: newTimeline,
      };
    });
  };

  const updateContingencyPercent = (percent: number) => {
    updateActivePlan(plan => {
      const currentItems = plan.budgetBreakdown.categories.flatMap(c => c.items);
      const newBreakdown = recalculateBudget(
        plan.intake.budget,
        currentItems,
        plan.intake.eventType,
        plan.intake.guestCount,
        percent
      );
      return {
        ...plan,
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    updateActivePlan(plan => {
      const updatedTimeline = plan.timeline.map(t => {
        if (t.id === taskId) {
          return { ...t, completed: !t.completed, isOverdue: !t.completed ? false : t.isOverdue };
        }
        return t;
      });
      return {
        ...plan,
        timeline: updatedTimeline,
      };
    });
  };

  const addCustomTask = (taskData: Omit<TimelineTask, 'id'>) => {
    const newTask: TimelineTask = {
      ...taskData,
      id: `task-custom-${Date.now()}`,
      isCustom: true,
    };
    updateActivePlan(plan => ({
      ...plan,
      timeline: [...plan.timeline, newTask],
    }));
  };

  const deleteTask = (taskId: string) => {
    updateActivePlan(plan => ({
      ...plan,
      timeline: plan.timeline.filter(t => t.id !== taskId),
    }));
  };

  const updateVendorStatus = (vendorId: string, status: BookingStatus) => {
    updateActivePlan(plan => ({
      ...plan,
      vendors: plan.vendors.map(v => (v.id === vendorId ? { ...v, bookingStatus: status } : v)),
    }));
  };

  const addVendorQuote = (vendorId: string, quoteData: Omit<VendorQuote, 'id'>) => {
    const newQuote: VendorQuote = {
      ...quoteData,
      id: `q-${Date.now()}`,
    };
    updateActivePlan(plan => ({
      ...plan,
      vendors: plan.vendors.map(v => {
        if (v.id === vendorId) {
          const quotes = [...v.quotes, newQuote];
          return {
            ...v,
            quotes,
            assignedVendorName: v.assignedVendorName || newQuote.vendorName,
          };
        }
        return v;
      }),
    }));
  };

  const setPreferredQuote = (vendorId: string, quoteId: string) => {
    updateActivePlan(plan => ({
      ...plan,
      vendors: plan.vendors.map(v => {
        if (v.id === vendorId) {
          const targetQuote = v.quotes.find(q => q.id === quoteId);
          return {
            ...v,
            assignedVendorName: targetQuote?.vendorName || v.assignedVendorName,
            actualCost: targetQuote?.quotedAmount || v.actualCost,
            quotes: v.quotes.map(q => ({
              ...q,
              isPreferred: q.id === quoteId,
            })),
          };
        }
        return v;
      }),
    }));
  };

  const addCustomBudgetItem = (itemData: Omit<BudgetItem, 'id'>) => {
    updateActivePlan(plan => {
      const newItem: BudgetItem = {
        ...itemData,
        id: `b-item-custom-${Date.now()}`,
        isCustom: true,
      };
      const allItems = [...plan.budgetBreakdown.categories.flatMap(c => c.items), newItem];
      const newBreakdown = recalculateBudget(
        plan.intake.budget,
        allItems,
        plan.intake.eventType,
        plan.intake.guestCount,
        plan.budgetBreakdown.contingencyPercent
      );
      return {
        ...plan,
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const updateBudgetItem = (itemId: string, patch: Partial<BudgetItem>) => {
    updateActivePlan(plan => {
      const allItems = plan.budgetBreakdown.categories
        .flatMap(c => c.items)
        .map(i => (i.id === itemId ? { ...i, ...patch } : i));

      const newBreakdown = recalculateBudget(
        plan.intake.budget,
        allItems,
        plan.intake.eventType,
        plan.intake.guestCount,
        plan.budgetBreakdown.contingencyPercent
      );
      return {
        ...plan,
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const deleteBudgetItem = (itemId: string) => {
    updateActivePlan(plan => {
      const allItems = plan.budgetBreakdown.categories
        .flatMap(c => c.items)
        .filter(i => i.id !== itemId);

      const newBreakdown = recalculateBudget(
        plan.intake.budget,
        allItems,
        plan.intake.eventType,
        plan.intake.guestCount,
        plan.budgetBreakdown.contingencyPercent
      );
      return {
        ...plan,
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const applySavingRecommendation = (recommendationId: string) => {
    updateActivePlan(plan => {
      const rec = plan.budgetBreakdown.savingRecommendations.find(r => r.id === recommendationId);
      if (!rec || rec.applied) return plan;

      // Find an item matching the category and deduct savings
      let remainingSavingsToApply = rec.potentialSavings;
      const allItems = plan.budgetBreakdown.categories.flatMap(c => c.items).map(item => {
        if (item.category === rec.category && remainingSavingsToApply > 0 && item.estimatedCost > 5000) {
          const deduct = Math.min(item.estimatedCost - 2000, remainingSavingsToApply);
          remainingSavingsToApply -= deduct;
          return {
            ...item,
            estimatedCost: Math.max(0, item.estimatedCost - deduct),
            notes: (item.notes ? item.notes + ' | ' : '') + `Optimized: ${rec.title}`,
          };
        }
        return item;
      });

      const updatedRecs = plan.budgetBreakdown.savingRecommendations.map(r =>
        r.id === recommendationId ? { ...r, applied: true } : r
      );

      const newBreakdown = recalculateBudget(
        plan.intake.budget,
        allItems,
        plan.intake.eventType,
        plan.intake.guestCount,
        plan.budgetBreakdown.contingencyPercent
      );
      newBreakdown.savingRecommendations = updatedRecs;

      return {
        ...plan,
        budgetBreakdown: newBreakdown,
      };
    });
  };

  const sendChatMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: userText.trim(),
    };

    // Append user message immediately
    updateActivePlan(p => ({
      ...p,
      chatHistory: [...p.chatHistory, userMsg],
    }));

    setIsGeneratingAI(true);

    try {
      const response = await getAIPlannerResponse(userText, activePlan, { customApiKey });

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.message,
        modeUsed: response.modeUsed,
        actionTriggered: response.actionTriggered,
      };

      // Apply any triggered action
      if (response.actionTriggered) {
        const { type, payload } = response.actionTriggered;
        if (type === 'UPDATE_BUDGET' && payload?.budget) {
          updateBudgetAmount(payload.budget);
        } else if (type === 'UPDATE_GUESTS' && payload?.guestCount) {
          updateGuestCount(payload.guestCount);
        } else if (type === 'SHIFT_DATE' && payload?.date) {
          shiftEventDate(payload.date);
        }
      }

      updateActivePlan(p => ({
        ...p,
        chatHistory: [...p.chatHistory, assistantMsg],
      }));
    } catch (e: any) {
      console.error('Chat generation error', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <PlanoraContext.Provider
      value={{
        plans,
        activePlan,
        activeTab,
        setActiveTab,
        setActivePlanId,
        createNewPlan,
        deletePlan,
        resetToDemo,
        exportPlanJSON,
        importPlanJSON,
        customApiKey,
        setCustomApiKey,
        isGeneratingAI,
        sendChatMessage,
        updateBudgetAmount,
        updateGuestCount,
        shiftEventDate,
        updateContingencyPercent,
        toggleTaskComplete,
        addCustomTask,
        deleteTask,
        updateVendorStatus,
        addVendorQuote,
        setPreferredQuote,
        addCustomBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        applySavingRecommendation,
      }}
    >
      {children}
    </PlanoraContext.Provider>
  );
};

export const usePlanora = () => {
  const context = useContext(PlanoraContext);
  if (!context) {
    throw new Error('usePlanora must be used within a PlanoraProvider');
  }
  return context;
};
