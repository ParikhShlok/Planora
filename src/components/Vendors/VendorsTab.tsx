import React, { useState } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  Store,
  PlusCircle,
  FileText,
  CheckCircle2,
  Info,
  X,
  Star,
} from 'lucide-react';
import { BookingStatus, VendorItem, VendorPriority } from '../../types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string }> = {
  researching: { label: 'Researching', bg: 'var(--bg-card-muted)', color: 'var(--text-muted)' },
  shortlisted: { label: 'Shortlisted', bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  contacted: { label: 'Contacted', bg: 'var(--status-info-bg)', color: 'var(--status-info)' },
  booked: { label: 'Booked & Locked', bg: 'var(--status-success-bg)', color: 'var(--status-success)' },
  declined: { label: 'Declined / Passed', bg: 'var(--status-danger-bg)', color: 'var(--status-danger)' },
};

export const VendorsTab: React.FC = () => {
  const {
    activePlan,
    updateVendorStatus,
    addVendorQuote,
    setPreferredQuote,
  } = usePlanora();

  const { intake, vendors } = activePlan;
  const currencySymbol = intake.currency === 'INR' ? '₹' : intake.currency === 'USD' ? '$' : '€';

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Quotes Modal state
  const [activeVendorForQuotes, setActiveVendorForQuotes] = useState<VendorItem | null>(null);
  const [showAddQuoteForm, setShowAddQuoteForm] = useState(false);
  const [quoteVendorName, setQuoteVendorName] = useState('');
  const [quoteContactPerson, setQuoteContactPerson] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteInclusions, setQuoteInclusions] = useState('');
  const [quotePros, setQuotePros] = useState('');
  const [quoteCons, setQuoteCons] = useState('');

  const handleAddQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVendorForQuotes || !quoteVendorName.trim()) return;

    addVendorQuote(activeVendorForQuotes.id, {
      vendorName: quoteVendorName.trim(),
      contactPerson: quoteContactPerson.trim() || undefined,
      quotedAmount: Math.max(0, parseInt(quoteAmount, 10) || 0),
      inclusions: quoteInclusions.trim(),
      pros: quotePros.trim(),
      cons: quoteCons.trim(),
    });

    setQuoteVendorName('');
    setQuoteContactPerson('');
    setQuoteAmount('');
    setQuoteInclusions('');
    setQuotePros('');
    setQuoteCons('');
    setShowAddQuoteForm(false);

    // Refresh active vendor reference
    const updated = vendors.find(v => v.id === activeVendorForQuotes.id);
    if (updated) setActiveVendorForQuotes(updated);
  };

  const categories = Array.from(new Set(vendors.map(v => v.category)));

  const filteredVendors = vendors.filter(v => {
    if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && v.bookingStatus !== statusFilter) return false;
    return true;
  });

  const bookedCount = vendors.filter(v => v.bookingStatus === 'booked').length;
  const inProgressCount = vendors.filter(
    v => v.bookingStatus === 'shortlisted' || v.bookingStatus === 'contacted'
  ).length;

  return (
    <div style={containerStyle}>
      {/* Header Banner */}
      <div style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={22} color="var(--color-primary)" />
              <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Smart Vendor Checklist & Quote Comparison</h1>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '700px' }}>
              Track provider evaluations, manage quotes with transparent trade-offs, and lock contracts without overspending.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={metricChipStyle}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ fontWeight: 800, fontSize: '13px' }}>
                {bookedCount} of {vendors.length} Booked ({inProgressCount} in talks)
              </span>
            </div>
          </div>
        </div>

        {/* Responsible Disclaimer Alert */}
        <div style={disclaimerAlertStyle}>
          <Info size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Planning Suggestion Disclosure:</strong> Recommended vendor roles and cost allocations are calculated estimates based on your event scale ({intake.guestCount} guests, {currencySymbol}{intake.budget.toLocaleString()} budget) and regional benchmarks. Planora does not fabricate private vendor phonebooks or guarantee commercial pricing. Enter and compare real supplier quotes as you receive them.
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={filterToolbarStyle}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginRight: '6px' }}>
              Category:
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              style={{
                ...filterBtnStyle,
                backgroundColor: categoryFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-card-muted)',
                color: categoryFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              All Roles
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  ...filterBtnStyle,
                  backgroundColor: categoryFilter === cat ? 'var(--color-primary)' : 'var(--bg-card-muted)',
                  color: categoryFilter === cat ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={selectDropdownStyle}
              aria-label="Filter vendors by booking status"
            >
              <option value="all">All Statuses</option>
              <option value="researching">Researching</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="contacted">Contacted</option>
              <option value="booked">Booked</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div style={vendorGridStyle}>
        {filteredVendors.map(vendor => {
          const statusMeta = STATUS_CONFIG[vendor.bookingStatus];
          const preferredQuote = vendor.quotes?.find(q => q.isPreferred);

          return (
            <div key={vendor.id} style={vendorCardStyle}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <span style={categoryChipStyle}>{vendor.category}</span>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {vendor.recommendedRole}
                  </h2>
                </div>

                <span style={priorityBadgeStyle(vendor.priority)}>
                  {vendor.priority.toUpperCase()}
                </span>
              </div>

              {/* Rationale & Tradeoffs */}
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '10px 0' }}>
                <strong>Strategic Value:</strong> {vendor.tradeoffsExplanation}
              </p>

              {/* Cost Benchmark */}
              <div style={costBenchmarkRowStyle}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Allocation:</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {currencySymbol} {vendor.estimatedCost.toLocaleString()}
                  </div>
                </div>

                {preferredQuote && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Locked / Preferred:</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--status-success)' }}>
                      {currencySymbol} {preferredQuote.quotedAmount.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Assigned Vendor Name if any */}
              {vendor.assignedVendorName && (
                <div style={assignedVendorBannerStyle}>
                  <CheckCircle2 size={14} color="var(--status-success)" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    Selected: {vendor.assignedVendorName}
                  </span>
                </div>
              )}

              {/* Card Footer: Status Selector & Quote Comparator Button */}
              <div style={cardFooterStyle}>
                <select
                  value={vendor.bookingStatus}
                  onChange={e => updateVendorStatus(vendor.id, e.target.value as BookingStatus)}
                  style={{
                    ...statusSelectStyle,
                    backgroundColor: statusMeta.bg,
                    color: statusMeta.color,
                  }}
                  aria-label={`Update booking status for ${vendor.recommendedRole}`}
                >
                  <option value="researching">Researching</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked & Locked</option>
                  <option value="declined">Declined</option>
                </select>

                <button
                  onClick={() => {
                    setActiveVendorForQuotes(vendor);
                    setShowAddQuoteForm(false);
                  }}
                  style={quoteButtonStyle}
                  title="Compare or add vendor proposals"
                >
                  <FileText size={13} />
                  <span>Quotes ({vendor.quotes?.length || 0})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote Comparison Modal */}
      {activeVendorForQuotes && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '680px' }}>
            <div style={modalHeaderStyle}>
              <div>
                <span style={categoryChipStyle}>{activeVendorForQuotes.category}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
                  Quotes for: {activeVendorForQuotes.recommendedRole}
                </h3>
              </div>
              <button
                onClick={() => setActiveVendorForQuotes(null)}
                style={iconCloseButtonStyle}
                aria-label="Close quote modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target benchmark banner */}
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', margin: '14px 0', fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>
              Target Allocation Benchmark: {currencySymbol} {activeVendorForQuotes.estimatedCost.toLocaleString()}
            </div>

            {/* Existing Quotes Comparison List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
              {activeVendorForQuotes.quotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No quotes logged yet for this category. Log proposals to compare pricing, inclusions, and pros/cons.
                </div>
              ) : (
                activeVendorForQuotes.quotes.map(quote => (
                  <div
                    key={quote.id}
                    style={{
                      ...quoteCardStyle,
                      borderColor: quote.isPreferred ? 'var(--status-success)' : 'var(--border-color)',
                      backgroundColor: quote.isPreferred ? 'var(--status-success-bg)' : 'var(--bg-card-muted)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                            {quote.vendorName}
                          </span>
                          {quote.isPreferred && (
                            <span style={preferredBadgeStyle}>
                              <Star size={11} /> Preferred Quote
                            </span>
                          )}
                        </div>
                        {quote.contactPerson && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {quote.contactPerson}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {currencySymbol} {quote.quotedAmount.toLocaleString()}
                        </div>
                        {!quote.isPreferred && (
                          <button
                            onClick={() => {
                              setPreferredQuote(activeVendorForQuotes.id, quote.id);
                              // Refresh
                              const updated = vendors.find(v => v.id === activeVendorForQuotes.id);
                              if (updated) setActiveVendorForQuotes(updated);
                            }}
                            style={makePreferredButtonStyle}
                          >
                            Mark Preferred
                          </button>
                        )}
                      </div>
                    </div>

                    {quote.inclusions && (
                      <div style={{ fontSize: '12px', marginTop: '8px' }}>
                        <strong>Inclusions:</strong> {quote.inclusions}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '12px' }}>
                      {quote.pros && (
                        <div style={{ color: 'var(--status-success)' }}>
                          <strong>Pros:</strong> {quote.pros}
                        </div>
                      )}
                      {quote.cons && (
                        <div style={{ color: 'var(--status-danger)' }}>
                          <strong>Cons / Risks:</strong> {quote.cons}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Toggle Add Quote Form */}
            {!showAddQuoteForm ? (
              <button
                onClick={() => setShowAddQuoteForm(true)}
                style={addQuoteToggleButtonStyle}
              >
                <PlusCircle size={14} />
                <span>Log New Quote for Comparison</span>
              </button>
            ) : (
              <form onSubmit={handleAddQuoteSubmit} style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Enter Proposal Details</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={formLabelStyle}>Vendor / Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Decorators Ltd."
                      value={quoteVendorName}
                      onChange={e => setQuoteVendorName(e.target.value)}
                      style={formInputStyle}
                    />
                  </div>
                  <div>
                    <label style={formLabelStyle}>Quoted Price ({currencySymbol}) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="120000"
                      value={quoteAmount}
                      onChange={e => setQuoteAmount(e.target.value)}
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={formLabelStyle}>Contact Person / Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul (+91 98111XXXXX)"
                    value={quoteContactPerson}
                    onChange={e => setQuoteContactPerson(e.target.value)}
                    style={formInputStyle}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Package Inclusions & Deliverables</label>
                  <input
                    type="text"
                    placeholder="e.g. Stage backdrop, 10 guest tables floral runners, ambient lighting"
                    value={quoteInclusions}
                    onChange={e => setQuoteInclusions(e.target.value)}
                    style={formInputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={formLabelStyle}>Key Advantage / Pro</label>
                    <input
                      type="text"
                      placeholder="e.g. Highest rated portfolio, prompt delivery"
                      value={quotePros}
                      onChange={e => setQuotePros(e.target.value)}
                      style={formInputStyle}
                    />
                  </div>
                  <div>
                    <label style={formLabelStyle}>Constraint / Con</label>
                    <input
                      type="text"
                      placeholder="e.g. Requires 50% non-refundable advance"
                      value={quoteCons}
                      onChange={e => setQuoteCons(e.target.value)}
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddQuoteForm(false)}
                    style={cancelButtonStyle}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={submitButtonStyle}>
                    Save Quote
                  </button>
                </div>
              </form>
            )}
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

const metricChipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
};

const disclaimerAlertStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '12px 16px',
  backgroundColor: 'var(--color-primary-light)',
  borderRadius: 'var(--radius-md)',
  margin: '16px 0',
};

const filterToolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
  paddingTop: '16px',
  borderTop: '1px solid var(--border-color)',
};

const filterBtnStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: '16px',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const selectDropdownStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
};

const vendorGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
  gap: '20px',
};

const vendorCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: 'var(--shadow-sm)',
};

const categoryChipStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--color-primary)',
};

const priorityBadgeStyle = (priority: VendorPriority): React.CSSProperties => {
  const isEssential = priority === 'essential';
  const isRec = priority === 'recommended';
  return {
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: isEssential ? 'var(--status-danger-bg)' : isRec ? 'var(--status-warning-bg)' : 'var(--bg-card-muted)',
    color: isEssential ? 'var(--status-danger)' : isRec ? 'var(--status-warning)' : 'var(--text-muted)',
  };
};

const costBenchmarkRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  borderRadius: 'var(--radius-sm)',
  margin: '8px 0',
};

const assignedVendorBannerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  backgroundColor: 'var(--status-success-bg)',
  color: 'var(--status-success)',
  borderRadius: 'var(--radius-sm)',
  margin: '6px 0',
};

const cardFooterStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid var(--border-color)',
};

const statusSelectStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: 600,
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer',
};

const quoteButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '6px 12px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

// Modal styles
const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  backdropFilter: 'blur(3px)',
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  width: '100%',
  boxShadow: 'var(--shadow-lg)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const iconCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const quoteCardStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
};

const preferredBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  fontSize: '10px',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: 'var(--status-success)',
  color: '#ffffff',
};

const makePreferredButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline',
};

const addQuoteToggleButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  width: '100%',
  padding: '10px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px dashed var(--border-color)',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-primary)',
  cursor: 'pointer',
  marginTop: '12px',
};

const formLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '4px',
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  fontSize: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '6px 14px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};
