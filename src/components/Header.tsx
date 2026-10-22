import React, { useState } from 'react';
import { usePlanora } from '../context/PlanoraContext';
import {
  Sparkles,
  Calendar,
  PlusCircle,
  Download,
  Settings,
  Printer,
  ChevronDown,
  Layers,
  Cpu,
  Check,
} from 'lucide-react';

interface HeaderProps {
  onOpenIntake: () => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenIntake, onOpenSettings, onOpenPrint }) => {
  const {
    plans,
    activePlan,
    setActivePlanId,
    resetToDemo,
    customApiKey,
    exportPlanJSON,
  } = usePlanora();

  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const isLiveAI = Boolean(
    (customApiKey && customApiKey.trim().length > 10) ||
    (import.meta.env.VITE_GEMINI_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY.startsWith('YOUR_'))
  );

  return (
    <header className="no-print" style={headerStyle}>
      <div style={containerStyle}>
        {/* Brand */}
        <div style={brandGroupStyle}>
          <div style={logoIconStyle} aria-hidden="true">
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={brandTitleStyle}>Planora AI</span>
              <span style={pillBadgeStyle}>GenAI Planner</span>
            </div>
            <p style={subtitleStyle}>Precision budgets, dynamic timelines & context-aware ideas</p>
          </div>
        </div>

        {/* Center / Plan Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Active Plan Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPlanMenu(!showPlanMenu)}
              style={planSelectButtonStyle}
              aria-expanded={showPlanMenu}
              aria-label="Select active event plan"
            >
              <Calendar size={16} color="var(--color-primary)" />
              <div style={{ textAlign: 'left', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activePlan.intake.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {activePlan.intake.eventType.toUpperCase()} • {activePlan.intake.city || 'Location TBD'}
                </div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {showPlanMenu && (
              <div style={dropdownMenuStyle}>
                <div style={dropdownHeaderStyle}>Saved Event Plans ({plans.length})</div>
                {plans.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePlanId(p.id);
                      setShowPlanMenu(false);
                    }}
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: p.id === activePlan.id ? 'var(--color-primary-light)' : 'transparent',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {p.intake.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {p.intake.date} • {p.intake.guestCount} guests
                      </div>
                    </div>
                    {p.id === activePlan.id && <Check size={16} color="var(--color-primary)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Demo Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              style={secondaryButtonStyle}
              title="Load standard demo events"
            >
              <Layers size={15} />
              <span>Presets</span>
              <ChevronDown size={12} />
            </button>

            {showDemoMenu && (
              <div style={{ ...dropdownMenuStyle, right: 0, width: '220px' }}>
                <div style={dropdownHeaderStyle}>Demo Presets</div>
                {plans.slice(0, 3).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePlanId(p.id);
                      setShowDemoMenu(false);
                    }}
                    style={dropdownItemStyle}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px' }}>{p.intake.title}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {p.intake.eventType.toUpperCase()}
                      </div>
                    </div>
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                <button
                  onClick={() => {
                    resetToDemo();
                    setShowDemoMenu(false);
                  }}
                  style={{ ...dropdownItemStyle, color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  Reset All to Default Demos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div style={actionsGroupStyle}>
          {/* AI Mode indicator badge */}
          <div
            onClick={onOpenSettings}
            style={{
              ...aiBadgeStyle,
              backgroundColor: isLiveAI ? 'var(--status-success-bg)' : 'var(--color-primary-light)',
              borderColor: isLiveAI ? 'var(--status-success)' : 'var(--color-primary)',
              cursor: 'pointer',
            }}
            title={isLiveAI ? 'Connected to Gemini Live AI API' : 'Operating on Resilient Local Planning Engine (Click to config API key)'}
          >
            <Cpu size={14} color={isLiveAI ? 'var(--status-success)' : 'var(--color-primary)'} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLiveAI ? 'var(--status-success)' : 'var(--color-primary)' }}>
              {isLiveAI ? 'Gemini Live' : 'Local Engine'}
            </span>
          </div>

          {/* New Event Button */}
          <button onClick={onOpenIntake} style={primaryButtonStyle}>
            <PlusCircle size={15} />
            <span>New Plan</span>
          </button>

          {/* Print Brief */}
          <button onClick={onOpenPrint} style={iconButtonStyle} title="Print or Save PDF Brief" aria-label="Print Event Brief">
            <Printer size={16} color="var(--text-secondary)" />
          </button>

          {/* Export JSON */}
          <button onClick={exportPlanJSON} style={iconButtonStyle} title="Export Plan JSON Backup" aria-label="Export Plan JSON">
            <Download size={16} color="var(--text-secondary)" />
          </button>

          {/* Settings */}
          <button onClick={onOpenSettings} style={iconButtonStyle} title="Settings & AI Configuration" aria-label="Settings">
            <Settings size={16} color="var(--text-secondary)" />
          </button>
        </div>
      </div>
    </header>
  );
};

// Styles
const headerStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky',
  top: 0,
  zIndex: 40,
  boxShadow: 'var(--shadow-sm)',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
};

const brandGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const logoIconStyle: React.CSSProperties = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
};

const brandTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const pillBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
};

const planSelectButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '6px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-secondary)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
};

const iconButtonStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
};

const aiBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '20px',
  border: '1px solid transparent',
};

const actionsGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const dropdownMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  minWidth: '280px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 50,
  padding: '6px',
};

const dropdownHeaderStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  padding: '6px 10px',
};

const dropdownItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 10px',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  textAlign: 'left',
};
