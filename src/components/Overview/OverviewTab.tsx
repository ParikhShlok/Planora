import React, { useState } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  Wallet,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { activePlan, setActiveTab, toggleTaskComplete, sendChatMessage } = usePlanora();
  const [quickQuery, setQuickQuery] = useState('');

  const { intake, budgetBreakdown, timeline, vendors } = activePlan;
  const currencySymbol = intake.currency === 'INR' ? '₹' : intake.currency === 'USD' ? '$' : '€';

  const completedTasks = timeline.filter(t => t.completed).length;
  const totalTasks = timeline.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const bookedVendors = vendors.filter(v => v.bookingStatus === 'booked').length;
  const totalVendors = vendors.length;

  const urgentTasks = timeline
    .filter(t => !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    sendChatMessage(quickQuery);
    setQuickQuery('');
    setActiveTab('assistant');
  };

  return (
    <div style={containerStyle}>
      {/* Event Banner */}
      <div style={bannerCardStyle}>
        <div style={{ flex: 1 }}>
          <div style={badgeRowStyle}>
            <span style={eventTypeBadgeStyle}>{intake.eventType.toUpperCase()}</span>
            <span style={statusBadgeStyle}>
              <Calendar size={13} />
              {intake.date} {intake.isApproximateDate ? '(Approx)' : '(Confirmed)'}
            </span>
            <span style={statusBadgeStyle}>
              <MapPin size={13} />
              {intake.city || 'Location Pending'} {intake.venuePreference ? `• ${intake.venuePreference}` : ''}
            </span>
          </div>

          <h1 style={eventTitleStyle}>{intake.title}</h1>

          <p style={eventNotesStyle}>
            {intake.notes || 'Customized celebration tailored with precision budgets, dynamic milestones & vendor tracking.'}
          </p>

          {/* Theme & Color Palette preview */}
          <div style={paletteRowStyle}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Theme:</span>
            <span style={themeChipStyle}>{intake.styleTheme || 'Classic Elegance'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
              {intake.colorPalette.map((color, i) => (
                <span
                  key={i}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Assistant Callout */}
        <div style={quickAssistantCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary)' }}>
              Ask Planora AI Assistant
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Change your budget, shift dates, or ask for cost-saving suggestions.
          </p>
          <form onSubmit={handleQuickSubmit} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="e.g. Cut 15% budget or What if it rains?"
              value={quickQuery}
              onChange={e => setQuickQuery(e.target.value)}
              style={quickInputStyle}
            />
            <button type="submit" style={quickSubmitButtonStyle} aria-label="Send question to assistant">
              <Send size={14} color="#ffffff" />
            </button>
          </form>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={kpiGridStyle}>
        {/* Budget KPI */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={kpiLabelStyle}>Total Budget</span>
            <div style={kpiIconWrapperStyle('var(--color-primary-light)')}>
              <Wallet size={18} color="var(--color-primary)" />
            </div>
          </div>
          <div style={kpiValueStyle}>
            {currencySymbol} {budgetBreakdown.totalBudget.toLocaleString()}
          </div>
          <div style={kpiSubtextStyle}>
            Est. Spend: {currencySymbol} {budgetBreakdown.totalEstimated.toLocaleString()} •{' '}
            <span
              style={{
                color: budgetBreakdown.remainingEstimatedBalance >= 0 ? 'var(--status-success)' : 'var(--status-danger)',
                fontWeight: 600,
              }}
            >
              {budgetBreakdown.remainingEstimatedBalance >= 0
                ? `${currencySymbol} ${budgetBreakdown.remainingEstimatedBalance.toLocaleString()} remaining`
                : `${currencySymbol} ${Math.abs(budgetBreakdown.remainingEstimatedBalance).toLocaleString()} over budget`}
            </span>
          </div>
        </div>

        {/* Per-Guest KPI */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={kpiLabelStyle}>Cost Per Guest</span>
            <div style={kpiIconWrapperStyle('var(--color-accent-light)')}>
              <Users size={18} color="var(--color-accent)" />
            </div>
          </div>
          <div style={kpiValueStyle}>
            {currencySymbol} {budgetBreakdown.costPerGuestEstimated.toLocaleString()}
          </div>
          <div style={kpiSubtextStyle}>
            Based on {intake.guestCount} guests • {intake.isIndoorOutdoor.toUpperCase()} setup
          </div>
        </div>

        {/* Timeline Progress KPI */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={kpiLabelStyle}>Tasks Progress</span>
            <div style={kpiIconWrapperStyle('var(--status-success-bg)')}>
              <CheckCircle2 size={18} color="var(--status-success)" />
            </div>
          </div>
          <div style={kpiValueStyle}>{progressPercent}% Done</div>
          <div style={{ marginTop: '8px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--status-success)',
                borderRadius: '3px',
              }}
            />
          </div>
          <div style={{ ...kpiSubtextStyle, marginTop: '6px' }}>
            {completedTasks} of {totalTasks} milestones completed
          </div>
        </div>

        {/* Vendor Pipeline KPI */}
        <div style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <span style={kpiLabelStyle}>Vendor Pipeline</span>
            <div style={kpiIconWrapperStyle('var(--status-info-bg)')}>
              <ShieldCheck size={18} color="var(--status-info)" />
            </div>
          </div>
          <div style={kpiValueStyle}>
            {bookedVendors} / {totalVendors} Booked
          </div>
          <div style={kpiSubtextStyle}>
            {vendors.filter(v => v.bookingStatus === 'contacted' || v.bookingStatus === 'shortlisted').length} in active evaluation
          </div>
        </div>
      </div>

      {/* Warnings & Alerts if any */}
      {budgetBreakdown.warnings.length > 0 && (
        <div style={warningBannerStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <AlertTriangle size={20} color="var(--status-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                Planning Attention Required ({budgetBreakdown.warnings.length})
              </div>
              <ul style={{ margin: '6px 0 0 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {budgetBreakdown.warnings.map((w, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={() => setActiveTab('budget')} style={reviewButtonStyle}>
            Resolve in Budget <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Two Column Layout: Urgent Next Actions & Quick Schedule Preview */}
      <div style={twoColGridStyle}>
        {/* Next Recommended Actions */}
        <div style={cardBoxStyle}>
          <div style={cardHeaderRowStyle}>
            <div>
              <h2 style={cardHeadingStyle}>Upcoming Critical Deadlines</h2>
              <p style={cardSubtextStyle}>Tasks requiring nearest attention based on your event date</p>
            </div>
            <button onClick={() => setActiveTab('timeline')} style={textLinkButtonStyle}>
              View All Tasks <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {urgentTasks.length === 0 ? (
              <div style={emptyTaskStyle}>🎉 All urgent tasks up to date! Great job planning ahead.</div>
            ) : (
              urgentTasks.map(task => (
                <div key={task.id} style={taskItemRowStyle}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    style={checkboxStyle}
                    aria-label={`Mark task ${task.title} complete`}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {task.title}
                      </span>
                      {task.isOverdue && (
                        <span style={overdueBadgeStyle}>Overdue</span>
                      )}
                      <span style={priorityBadgeStyle(task.priority)}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Due: {task.dueDate} • Assigned to: {task.owner}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Event Day Run-of-Show Preview */}
        <div style={cardBoxStyle}>
          <div style={cardHeaderRowStyle}>
            <div>
              <h2 style={cardHeadingStyle}>Day-of Run of Show</h2>
              <p style={cardSubtextStyle}>Synchronized schedule with responsible parties</p>
            </div>
            <button onClick={() => setActiveTab('ideas')} style={textLinkButtonStyle}>
              Full Schedule & Ideas <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            {activePlan.ideas.dayOfSchedule.slice(0, 5).map(item => (
              <div key={item.id} style={scheduleRowStyle}>
                <div style={scheduleTimeColStyle}>
                  <Clock size={12} color="var(--color-primary)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {item.timeSlot}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {item.activity}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.location} • Lead: {item.responsibleParty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '24px',
};

const bannerCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  alignItems: 'center',
  boxShadow: 'var(--shadow-sm)',
  marginBottom: '24px',
};

const badgeRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
  marginBottom: '8px',
};

const eventTypeBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
  letterSpacing: '0.04em',
};

const statusBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card-muted)',
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const eventTitleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  marginBottom: '6px',
  color: 'var(--text-primary)',
};

const eventNotesStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  maxWidth: '650px',
  marginBottom: '12px',
};

const paletteRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const themeChipStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: 'var(--bg-card-muted)',
  padding: '2px 8px',
  borderRadius: '4px',
};

const quickAssistantCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary-light)',
  border: '1px solid rgba(79, 70, 229, 0.2)',
  borderRadius: 'var(--radius-md)',
  padding: '16px',
  width: '320px',
  flexShrink: 0,
};

const quickInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  fontSize: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
};

const quickSubmitButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '0 12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const kpiGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
  marginBottom: '24px',
};

const kpiCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
};

const kpiHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const kpiIconWrapperStyle = (bgColor: string): React.CSSProperties => ({
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const kpiValueStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  marginBottom: '4px',
};

const kpiSubtextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
};

const warningBannerStyle: React.CSSProperties = {
  backgroundColor: 'var(--status-warning-bg)',
  border: '1px solid var(--status-warning)',
  borderRadius: 'var(--radius-md)',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '24px',
};

const reviewButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-primary)',
};

const twoColGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '24px',
};

const cardBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
};

const cardHeaderRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const cardHeadingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
};

const cardSubtextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginTop: '2px',
};

const textLinkButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  fontSize: '12px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
};

const taskItemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
};

const checkboxStyle: React.CSSProperties = {
  width: '18px',
  height: '18px',
  accentColor: 'var(--color-primary)',
  cursor: 'pointer',
};

const overdueBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '4px',
  backgroundColor: 'var(--status-danger-bg)',
  color: 'var(--status-danger)',
};

const priorityBadgeStyle = (priority: string): React.CSSProperties => {
  const isCrit = priority === 'critical';
  const isHigh = priority === 'high';
  return {
    fontSize: '10px',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: '4px',
    backgroundColor: isCrit ? 'var(--status-danger-bg)' : isHigh ? 'var(--status-warning-bg)' : 'var(--bg-card)',
    color: isCrit ? 'var(--status-danger)' : isHigh ? 'var(--status-warning)' : 'var(--text-muted)',
  };
};

const emptyTaskStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--status-success)',
  padding: '16px',
  textAlign: 'center',
  backgroundColor: 'var(--status-success-bg)',
  borderRadius: 'var(--radius-sm)',
};

const scheduleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '10px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
};

const scheduleTimeColStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  width: '120px',
  flexShrink: 0,
};
