import React from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  Printer,
  X,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Sparkles,
  Download,
} from 'lucide-react';

interface PrintableReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ isOpen, onClose }) => {
  const { activePlan, exportPlanJSON } = usePlanora();

  if (!isOpen) return null;

  const { intake, budgetBreakdown, timeline, vendors, ideas } = activePlan;
  const currencySymbol = intake.currency === 'INR' ? '₹' : intake.currency === 'USD' ? '$' : '€';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={modalBackdropStyle} className="no-print">
      <div style={modalContainerStyle}>
        {/* Modal Toolbar (hidden during print) */}
        <div style={toolbarStyle} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>
              Print & Export Event Master Brief
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} style={printActionButtonStyle}>
              <Printer size={14} /> Print / Save as PDF
            </button>
            <button onClick={exportPlanJSON} style={secondaryActionButtonStyle}>
              <Download size={14} /> Export JSON
            </button>
            <button onClick={onClose} style={iconCloseButtonStyle} aria-label="Close export dialog">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* The Printable Document Paper */}
        <div style={paperContainerStyle} id="printable-brief">
          {/* Header */}
          <div style={docHeaderStyle}>
            <div>
              <div style={brandTagStyle}>PLANORA AI • EVENT PLANNING MASTER BRIEF</div>
              <h1 style={docTitleStyle}>{intake.title}</h1>
              <div style={docMetaRowStyle}>
                <span><strong>Type:</strong> {intake.eventType.toUpperCase()}</span>
                <span>•</span>
                <span><strong>Date:</strong> {intake.date}</span>
                <span>•</span>
                <span><strong>Location:</strong> {intake.city || 'TBD'} ({intake.venuePreference || 'Venue TBD'})</span>
                <span>•</span>
                <span><strong>Guests:</strong> {intake.guestCount} pax</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={docDateBadgeStyle}>Generated: {new Date().toLocaleDateString()}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Setting: {intake.isIndoorOutdoor.toUpperCase()}
              </div>
            </div>
          </div>

          <hr style={dividerStyle} />

          {/* Section 1: Executive Financial Architecture */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>1. Executive Financial Summary</h2>
            <div style={kpiPrintRowStyle}>
              <div style={kpiPrintBoxStyle}>
                <div style={kpiPrintLabelStyle}>TOTAL BUDGET</div>
                <div style={kpiPrintValStyle}>{currencySymbol} {budgetBreakdown.totalBudget.toLocaleString()}</div>
              </div>
              <div style={kpiPrintBoxStyle}>
                <div style={kpiPrintLabelStyle}>ESTIMATED COMMITMENT</div>
                <div style={kpiPrintValStyle}>{currencySymbol} {budgetBreakdown.totalEstimated.toLocaleString()}</div>
              </div>
              <div style={kpiPrintBoxStyle}>
                <div style={kpiPrintLabelStyle}>REMAINING BALANCE</div>
                <div style={kpiPrintValStyle}>{currencySymbol} {budgetBreakdown.remainingEstimatedBalance.toLocaleString()}</div>
              </div>
              <div style={kpiPrintBoxStyle}>
                <div style={kpiPrintLabelStyle}>COST PER GUEST</div>
                <div style={kpiPrintValStyle}>{currencySymbol} {budgetBreakdown.costPerGuestEstimated.toLocaleString()}</div>
              </div>
              <div style={kpiPrintBoxStyle}>
                <div style={kpiPrintLabelStyle}>CONTINGENCY RESERVE</div>
                <div style={kpiPrintValStyle}>{currencySymbol} {budgetBreakdown.contingencyAmount.toLocaleString()} ({budgetBreakdown.contingencyPercent}%)</div>
              </div>
            </div>

            {/* Category breakdown table */}
            <table style={printTableStyle}>
              <thead>
                <tr>
                  <th style={printThStyle}>Category</th>
                  <th style={{ ...printThStyle, textAlign: 'right' }}>Target Allocation</th>
                  <th style={{ ...printThStyle, textAlign: 'right' }}>Estimated Spend</th>
                  <th style={{ ...printThStyle, textAlign: 'right' }}>Actual Logged</th>
                  <th style={{ ...printThStyle, textAlign: 'right' }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {budgetBreakdown.categories.map(c => {
                  const variance = c.allocatedBudget - c.estimatedSpent;
                  return (
                    <tr key={c.category} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={printTdStyle}><strong>{c.category}</strong> ({c.percentageOfBudget}%)</td>
                      <td style={{ ...printTdStyle, textAlign: 'right' }}>{currencySymbol} {c.allocatedBudget.toLocaleString()}</td>
                      <td style={{ ...printTdStyle, textAlign: 'right' }}>{currencySymbol} {c.estimatedSpent.toLocaleString()}</td>
                      <td style={{ ...printTdStyle, textAlign: 'right' }}>{currencySymbol} {c.actualSpent.toLocaleString()}</td>
                      <td style={{ ...printTdStyle, textAlign: 'right', color: variance < 0 ? '#b91c1c' : '#15803d' }}>
                        {variance < 0 ? `-${currencySymbol} ${Math.abs(variance).toLocaleString()}` : `+${currencySymbol} ${variance.toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* Section 2: Vendor Checklist & Status */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>2. Vendor Roster & Status</h2>
            <table style={printTableStyle}>
              <thead>
                <tr>
                  <th style={printThStyle}>Vendor Role</th>
                  <th style={printThStyle}>Category</th>
                  <th style={printThStyle}>Booking Status</th>
                  <th style={printThStyle}>Contracted Vendor</th>
                  <th style={{ ...printThStyle, textAlign: 'right' }}>Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={printTdStyle}><strong>{v.recommendedRole}</strong></td>
                    <td style={printTdStyle}>{v.category}</td>
                    <td style={printTdStyle}>{v.bookingStatus.toUpperCase()}</td>
                    <td style={printTdStyle}>{v.assignedVendorName || 'In negotiation'}</td>
                    <td style={{ ...printTdStyle, textAlign: 'right' }}>{currencySymbol} {v.estimatedCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 3: Event Day Master Schedule */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>3. Day-of Run-of-Show Master Schedule</h2>
            <table style={printTableStyle}>
              <thead>
                <tr>
                  <th style={{ ...printThStyle, width: '160px' }}>Time Slot</th>
                  <th style={printThStyle}>Activity / Program</th>
                  <th style={printThStyle}>Location</th>
                  <th style={printThStyle}>Operational Lead</th>
                </tr>
              </thead>
              <tbody>
                {ideas.dayOfSchedule.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ ...printTdStyle, fontWeight: 700 }}>{item.timeSlot}</td>
                    <td style={printTdStyle}>
                      <div>{item.activity}</div>
                      {item.notes && <div style={{ fontSize: '11px', color: '#64748b' }}>{item.notes}</div>}
                    </td>
                    <td style={printTdStyle}>{item.location}</td>
                    <td style={printTdStyle}>{item.responsibleParty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 4: Operational Safeguards */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>4. Weather, Dietary & Accessibility Directives</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={docBoxStyle}>
                <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  Weather Safeguard Plan
                </div>
                <p style={{ fontSize: '12px', color: '#334155' }}>
                  {ideas.weatherContingency.backupPlan}
                </p>
              </div>

              <div style={docBoxStyle}>
                <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  Dietary Accommodations
                </div>
                <p style={{ fontSize: '12px', color: '#334155' }}>
                  {ideas.foodAndMenu.dietaryAccommodations}
                </p>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <div style={docFooterStyle}>
            Document produced autonomously via Planora AI Planning Engine. Real vendor quotes must be verified directly with suppliers.
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  backdropFilter: 'blur(4px)',
};

const modalContainerStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  borderRadius: 'var(--radius-lg)',
  width: '100%',
  maxWidth: '960px',
  maxHeight: '92vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow-lg)',
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  backgroundColor: 'var(--bg-card)',
  borderBottom: '1px solid var(--border-color)',
  borderTopLeftRadius: 'var(--radius-lg)',
  borderTopRightRadius: 'var(--radius-lg)',
};

const printActionButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const secondaryActionButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const iconCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '4px',
};

const paperContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '40px',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  margin: '16px 24px 24px',
  borderRadius: 'var(--radius-md)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

const docHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const brandTagStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#4f46e5',
  textTransform: 'uppercase',
};

const docTitleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 800,
  color: '#0f172a',
  margin: '4px 0',
};

const docMetaRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  color: '#475569',
  marginTop: '4px',
};

const docDateBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '3px 8px',
  borderRadius: '4px',
  backgroundColor: '#f1f5f9',
  color: '#475569',
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '2px solid #e2e8f0',
  margin: '20px 0',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '28px',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 800,
  color: '#0f172a',
  marginBottom: '12px',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '4px',
};

const kpiPrintRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '12px',
  marginBottom: '16px',
};

const kpiPrintBoxStyle: React.CSSProperties = {
  padding: '10px 12px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
};

const kpiPrintLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
};

const kpiPrintValStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 800,
  color: '#0f172a',
  marginTop: '2px',
};

const printTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '12px',
};

const printThStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
};

const printTdStyle: React.CSSProperties = {
  padding: '8px 10px',
  verticalAlign: 'middle',
  color: '#1e293b',
};

const docBoxStyle: React.CSSProperties = {
  padding: '12px 14px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
};

const docFooterStyle: React.CSSProperties = {
  marginTop: '30px',
  paddingTop: '16px',
  borderTop: '1px solid #e2e8f0',
  textAlign: 'center',
  fontSize: '11px',
  color: '#94a3b8',
};
