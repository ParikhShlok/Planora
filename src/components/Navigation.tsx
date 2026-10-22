import React from 'react';
import { usePlanora, NavigationTab } from '../context/PlanoraContext';
import {
  LayoutDashboard,
  Wallet,
  CalendarDays,
  Store,
  Lightbulb,
  MessageSquareCode,
  BadgeAlert,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, activePlan } = usePlanora();

  const overdueCount = activePlan.timeline.filter(t => t.isOverdue && !t.completed).length;
  const warningsCount = activePlan.budgetBreakdown.warnings.length;

  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'budget',
      label: 'Budget Planner',
      icon: <Wallet size={18} />,
      badge: warningsCount > 0 ? warningsCount : undefined,
    },
    {
      id: 'timeline',
      label: 'Timeline & Deadlines',
      icon: <CalendarDays size={18} />,
      badge: overdueCount > 0 ? overdueCount : undefined,
    },
    {
      id: 'vendors',
      label: 'Vendor Checklist',
      icon: <Store size={18} />,
    },
    {
      id: 'ideas',
      label: 'Ideas & Day Schedule',
      icon: <Lightbulb size={18} />,
    },
    {
      id: 'assistant',
      label: 'AI Planning Assistant',
      icon: <MessageSquareCode size={18} />,
    },
  ];

  return (
    <nav className="no-print" style={navWrapperStyle} aria-label="Main Application Tabs">
      <div style={tabsContainerStyle} role="tablist">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...tabButtonStyle,
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                borderBottomColor: isActive ? 'var(--color-primary)' : 'transparent',
                backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span style={badgeStyle} title={`${tab.badge} alerts`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const navWrapperStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  borderBottom: '1px solid var(--border-color)',
};

const tabsContainerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  overflowX: 'auto',
  gap: '4px',
};

const tabButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 18px',
  border: 'none',
  borderBottom: '3px solid transparent',
  background: 'none',
  fontSize: '14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--status-danger)',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '10px',
  minWidth: '18px',
  textAlign: 'center',
};
