import React, { useState } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  Palette,
  Utensils,
  Music,
  CloudRain,
  Leaf,
  Clock,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

export const IdeasTab: React.FC = () => {
  const { activePlan } = usePlanora();
  const { intake, ideas } = activePlan;

  const [activeSubTab, setActiveSubTab] = useState<'themes' | 'food' | 'entertainment' | 'schedule' | 'contingency'>('themes');

  return (
    <div style={containerStyle}>
      {/* Top Banner */}
      <div style={headerCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="var(--color-primary)" />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Personalized Event Concepts & Run-of-Show</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Tailored aesthetics, dietary-conscious catering, weather safeguards, and hour-by-hour execution schedule for {intake.title}.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div style={subTabsBarStyle}>
          <button
            onClick={() => setActiveSubTab('themes')}
            style={{
              ...subTabButtonStyle,
              borderBottomColor: activeSubTab === 'themes' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'themes' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'themes' ? 700 : 500,
            }}
          >
            <Palette size={15} />
            <span>Themes & Decor</span>
          </button>

          <button
            onClick={() => setActiveSubTab('food')}
            style={{
              ...subTabButtonStyle,
              borderBottomColor: activeSubTab === 'food' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'food' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'food' ? 700 : 500,
            }}
          >
            <Utensils size={15} />
            <span>Menu & Dietary</span>
          </button>

          <button
            onClick={() => setActiveSubTab('entertainment')}
            style={{
              ...subTabButtonStyle,
              borderBottomColor: activeSubTab === 'entertainment' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'entertainment' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'entertainment' ? 700 : 500,
            }}
          >
            <Music size={15} />
            <span>Entertainment & Guest Vibe</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            style={{
              ...subTabButtonStyle,
              borderBottomColor: activeSubTab === 'schedule' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'schedule' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'schedule' ? 700 : 500,
            }}
          >
            <Clock size={15} />
            <span>Day-of Schedule ({ideas.dayOfSchedule.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contingency')}
            style={{
              ...subTabButtonStyle,
              borderBottomColor: activeSubTab === 'contingency' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'contingency' ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontWeight: activeSubTab === 'contingency' ? 700 : 500,
            }}
          >
            <CloudRain size={15} />
            <span>Weather & Sustainability</span>
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeSubTab === 'themes' && (
        <div style={gridStyle}>
          {ideas.themesAndDecor.map(theme => (
            <div key={theme.id} style={cardBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {theme.title}
                </h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={impactBadgeStyle(theme.costImpact)}>
                    Cost: {theme.costImpact.toUpperCase()}
                  </span>
                  <span style={effortBadgeStyle}>
                    Effort: {theme.effort.toUpperCase()}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '12px 0' }}>
                {theme.description}
              </p>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  CURATED COLOR ACCENTS:
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {theme.colorAccents.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          backgroundColor: c,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'food' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={cardBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Utensils size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{ideas.foodAndMenu.concept}</h3>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Service Architecture: <strong>{ideas.foodAndMenu.servingStyle}</strong>
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Signature Menu Highlights
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {ideas.foodAndMenu.highlights.map((dish, i) => (
                <div key={i} style={highlightDishStyle}>
                  ✨ {dish}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', padding: '14px', backgroundColor: 'var(--status-info-bg)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-info)', marginBottom: '4px' }}>
                Allergen & Dietary Protocol
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {ideas.foodAndMenu.dietaryAccommodations}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'entertainment' && (
        <div style={gridStyle}>
          {ideas.entertainmentAndActivities.map(ent => (
            <div key={ent.id} style={cardBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {ent.title}
                </h3>
                <span style={audienceBadgeStyle}>For: {ent.targetAudience}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {ent.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'schedule' && (
        <div style={cardBoxStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Event Day Master Run-of-Show</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Coordinated schedule ensuring vendors and hospitality staff operate in perfect harmony.
              </p>
            </div>
            <span style={pillBadgeStyle}>{ideas.dayOfSchedule.length} Chronological Blocks</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ideas.dayOfSchedule.map(item => (
              <div key={item.id} style={scheduleCardRowStyle}>
                <div style={timeSlotBadgeStyle}>
                  <Clock size={13} color="var(--color-primary)" />
                  <span>{item.timeSlot}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {item.activity}
                    </span>
                    <span style={locationBadgeStyle}>{item.location}</span>
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {item.notes}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Operational Lead: <strong>{item.responsibleParty}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'contingency' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Weather Card */}
          <div style={cardBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CloudRain size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Weather & Environmental Safeguards</h3>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <strong>Identified Vulnerability:</strong> {ideas.weatherContingency.primaryRisk}
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                Operational Backup Plan
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {ideas.weatherContingency.backupPlan}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '6px', fontWeight: 600 }}>
                Includes {ideas.weatherContingency.timelineBufferMinutes} minutes schedule buffer for seamless guest movement.
              </div>
            </div>
          </div>

          {/* Accessibility & Sustainability Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={cardBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <HeartHandshake size={18} color="var(--status-success)" />
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Inclusivity & Accessibility</h3>
              </div>
              <ul style={{ margin: '0 0 0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {ideas.accessibilityAndInclusion.map((item, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={cardBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Leaf size={18} color="var(--status-success)" />
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Eco-Friendly & Sustainability</h3>
              </div>
              <ul style={{ margin: '0 0 0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {ideas.sustainabilityTips.map((tip, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '24px',
};

const headerCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-sm)',
  marginBottom: '24px',
};

const subTabsBarStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  marginTop: '20px',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '12px',
};

const subTabButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  border: 'none',
  borderBottom: '3px solid transparent',
  background: 'none',
  fontSize: '13px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
  gap: '20px',
};

const cardBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-sm)',
};

const impactBadgeStyle = (impact: string): React.CSSProperties => {
  const isHigh = impact === 'high';
  return {
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: isHigh ? 'var(--status-danger-bg)' : 'var(--bg-card-muted)',
    color: isHigh ? 'var(--status-danger)' : 'var(--text-secondary)',
  };
};

const effortBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: 'var(--bg-card-muted)',
  color: 'var(--text-secondary)',
};

const audienceBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: '4px',
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
};

const highlightDishStyle: React.CSSProperties = {
  padding: '10px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const pillBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '12px',
  backgroundColor: 'var(--bg-card-muted)',
  color: 'var(--text-secondary)',
};

const scheduleCardRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '12px 16px',
  backgroundColor: 'var(--bg-card-muted)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const timeSlotBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 10px',
  backgroundColor: 'var(--bg-card)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--color-primary)',
  width: '160px',
  flexShrink: 0,
};

const locationBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: '4px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-muted)',
};
