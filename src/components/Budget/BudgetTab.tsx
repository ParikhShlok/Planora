import React, { useState } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  Wallet,
  PlusCircle,
  TrendingDown,
  AlertCircle,
  Shield,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { BudgetItem } from '../../types';

export const BudgetTab: React.FC = () => {
  const {
    activePlan,
    updateBudgetAmount,
    updateContingencyPercent,
    addCustomBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    applySavingRecommendation,
  } = usePlanora();

  const { intake, budgetBreakdown } = activePlan;
  const currencySymbol = intake.currency === 'INR' ? '₹' : intake.currency === 'USD' ? '$' : '€';

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInputValue, setBudgetInputValue] = useState(intake.budget.toString());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Add Item Modal state
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(
    budgetBreakdown.categories[0]?.category || 'Venue & Hospitality'
  );
  const [newItemEstimated, setNewItemEstimated] = useState('');
  const [newItemActual, setNewItemActual] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Inline editing state for line items
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editEstimated, setEditEstimated] = useState('');
  const [editActual, setEditActual] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleBudgetSave = () => {
    const parsed = Math.max(0, parseInt(budgetInputValue, 10) || 0);
    updateBudgetAmount(parsed);
    setIsEditingBudget(false);
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addCustomBudgetItem({
      name: newItemName.trim(),
      category: newItemCategory,
      estimatedCost: Math.max(0, parseInt(newItemEstimated, 10) || 0),
      actualCost: Math.max(0, parseInt(newItemActual, 10) || 0),
      notes: newItemNotes.trim() || undefined,
    });

    setNewItemName('');
    setNewItemEstimated('');
    setNewItemActual('');
    setNewItemNotes('');
    setShowAddItemModal(false);
  };

  const startEditingItem = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setEditEstimated(item.estimatedCost.toString());
    setEditActual(item.actualCost.toString());
    setEditNotes(item.notes || '');
  };

  const saveEditingItem = (itemId: string) => {
    updateBudgetItem(itemId, {
      estimatedCost: Math.max(0, parseInt(editEstimated, 10) || 0),
      actualCost: Math.max(0, parseInt(editActual, 10) || 0),
      notes: editNotes.trim() || undefined,
    });
    setEditingItemId(null);
  };

  // Filtered categories
  const displayedCategories =
    selectedCategoryFilter === 'all'
      ? budgetBreakdown.categories
      : budgetBreakdown.categories.filter(c => c.category === selectedCategoryFilter);

  const percentUsedEstimated =
    budgetBreakdown.totalBudget > 0
      ? Math.round((budgetBreakdown.totalEstimated / budgetBreakdown.totalBudget) * 100)
      : 0;

  const percentUsedActual =
    budgetBreakdown.totalBudget > 0
      ? Math.round((budgetBreakdown.totalActual / budgetBreakdown.totalBudget) * 100)
      : 0;

  return (
    <div style={containerStyle}>
      {/* Top Budget Header Card */}
      <div style={summaryCardStyle}>
        <div style={summaryRowStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={labelStyle}>Total Event Budget</span>
              {!isEditingBudget && (
                <button
                  onClick={() => {
                    setBudgetInputValue(intake.budget.toString());
                    setIsEditingBudget(true);
                  }}
                  style={iconEditButtonStyle}
                  title="Edit Total Budget"
                  aria-label="Edit Total Budget"
                >
                  <Edit2 size={13} />
                </button>
              )}
            </div>

            {isEditingBudget ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800 }}>{currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  value={budgetInputValue}
                  onChange={e => setBudgetInputValue(e.target.value)}
                  style={budgetInputStyle}
                  autoFocus
                />
                <button onClick={handleBudgetSave} style={saveSmallButtonStyle} aria-label="Save Budget">
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  style={cancelSmallButtonStyle}
                  aria-label="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div style={mainAmountStyle}>
                {currencySymbol} {budgetBreakdown.totalBudget.toLocaleString()}
              </div>
            )}
            <div style={subLabelStyle}>
              Estimated Cost / Guest: <strong>{currencySymbol} {budgetBreakdown.costPerGuestEstimated.toLocaleString()}</strong> ({intake.guestCount} guests)
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={metricsGroupStyle}>
            <div style={metricBoxStyle}>
              <div style={metricLabelStyle}>Estimated Spend</div>
              <div style={metricValueStyle}>
                {currencySymbol} {budgetBreakdown.totalEstimated.toLocaleString()}
              </div>
              <div style={metricPercentStyle}>
                {percentUsedEstimated}% of budget
              </div>
            </div>

            <div style={metricBoxStyle}>
              <div style={metricLabelStyle}>Actual Logged</div>
              <div style={metricValueStyle}>
                {currencySymbol} {budgetBreakdown.totalActual.toLocaleString()}
              </div>
              <div style={metricPercentStyle}>
                {percentUsedActual}% settled
              </div>
            </div>

            <div style={metricBoxStyle}>
              <div style={metricLabelStyle}>Remaining Balance</div>
              <div
                style={{
                  ...metricValueStyle,
                  color: budgetBreakdown.remainingEstimatedBalance >= 0 ? 'var(--status-success)' : 'var(--status-danger)',
                }}
              >
                {currencySymbol} {budgetBreakdown.remainingEstimatedBalance.toLocaleString()}
              </div>
              <div style={metricPercentStyle}>
                {budgetBreakdown.remainingEstimatedBalance >= 0 ? 'Surplus / Available' : '⚠️ Deficit Overrun'}
              </div>
            </div>
          </div>
        </div>

        {/* Contingency Reserve Control */}
        <div style={contingencyBarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Contingency Emergency Reserve:</span>
            <span style={contingencyAmountBadgeStyle}>
              {budgetBreakdown.contingencyPercent}% ({currencySymbol} {budgetBreakdown.contingencyAmount.toLocaleString()})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Buffer Ratio:</span>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={budgetBreakdown.contingencyPercent}
              onChange={e => updateContingencyPercent(parseInt(e.target.value, 10))}
              style={{ width: '120px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              aria-label="Adjust contingency percentage"
            />
            <span style={{ fontSize: '12px', fontWeight: 700, width: '35px' }}>
              {budgetBreakdown.contingencyPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Saving Recommendations Section */}
      {budgetBreakdown.savingRecommendations.length > 0 && (
        <div style={savingsCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="var(--color-accent)" />
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>
              AI-Powered Saving Recommendations with Trade-Offs
            </h2>
          </div>

          <div style={savingsGridStyle}>
            {budgetBreakdown.savingRecommendations.map(rec => (
              <div
                key={rec.id}
                style={{
                  ...savingItemStyle,
                  borderColor: rec.applied ? 'var(--status-success)' : 'var(--border-color)',
                  backgroundColor: rec.applied ? 'var(--status-success-bg)' : 'var(--bg-card)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {rec.title}
                    </span>
                    <span style={saveBadgeStyle}>
                      Save ~{currencySymbol} {rec.potentialSavings.toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <strong>Trade-off:</strong> {rec.tradeoff}
                  </p>
                </div>

                <button
                  disabled={rec.applied}
                  onClick={() => applySavingRecommendation(rec.id)}
                  style={{
                    ...applyButtonStyle,
                    backgroundColor: rec.applied ? 'var(--status-success)' : 'var(--color-primary)',
                    cursor: rec.applied ? 'default' : 'pointer',
                  }}
                >
                  {rec.applied ? (
                    <>
                      <Check size={13} /> Applied
                    </>
                  ) : (
                    'Apply Saving'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories & Line Items Table */}
      <div style={tableSectionCardStyle}>
        <div style={tableSectionHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Category Breakdown & Line Items</h2>
            {/* Category filter pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                style={{
                  ...filterChipStyle,
                  backgroundColor: selectedCategoryFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-card-muted)',
                  color: selectedCategoryFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                All Categories ({budgetBreakdown.categories.length})
              </button>
              {budgetBreakdown.categories.map(c => (
                <button
                  key={c.category}
                  onClick={() => setSelectedCategoryFilter(c.category)}
                  style={{
                    ...filterChipStyle,
                    backgroundColor: selectedCategoryFilter === c.category ? 'var(--color-primary)' : 'var(--bg-card-muted)',
                    color: selectedCategoryFilter === c.category ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {c.category}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setShowAddItemModal(true)} style={addExpenseButtonStyle}>
            <PlusCircle size={15} />
            <span>Add Line Item</span>
          </button>
        </div>

        {/* Categories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
          {displayedCategories.map(cat => {
            const catProgress =
              cat.allocatedBudget > 0 ? Math.round((cat.estimatedSpent / cat.allocatedBudget) * 100) : 0;
            const isOverAllocated = cat.allocatedBudget > 0 && cat.estimatedSpent > cat.allocatedBudget;

            return (
              <div key={cat.category} style={categoryGroupCardStyle}>
                {/* Category Header */}
                <div style={catHeaderStyle}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {cat.category}
                    </span>
                    <span style={targetAllocBadgeStyle}>
                      Target: {currencySymbol} {cat.allocatedBudget.toLocaleString()} ({cat.percentageOfBudget}%)
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isOverAllocated ? 'var(--status-danger)' : 'var(--text-primary)' }}>
                      Est: {currencySymbol} {cat.estimatedSpent.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                      Actual: {currencySymbol} {cat.actualSpent.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Allocation progress bar */}
                <div style={{ height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', margin: '8px 0 12px 0' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, catProgress)}%`,
                      backgroundColor: isOverAllocated ? 'var(--status-danger)' : 'var(--color-primary)',
                      borderRadius: '2px',
                    }}
                  />
                </div>

                {/* Items Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Line Item Description</th>
                        <th style={thStyle}>Notes / Context</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Estimated Cost</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Actual Spent</th>
                        <th style={{ ...thStyle, textAlign: 'center', width: '90px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)' }}>
                            No line items in this category yet. Click "Add Line Item" above.
                          </td>
                        </tr>
                      ) : (
                        cat.items.map(item => {
                          const isEditingThis = editingItemId === item.id;
                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={tdStyle}>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {item.name}
                                </div>
                                {item.isCustom && <span style={customBadgeStyle}>Custom</span>}
                              </td>

                              <td style={tdStyle}>
                                {isEditingThis ? (
                                  <input
                                    type="text"
                                    value={editNotes}
                                    onChange={e => setEditNotes(e.target.value)}
                                    style={inlineInputStyle}
                                    placeholder="Notes..."
                                  />
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    {item.notes || '—'}
                                  </span>
                                )}
                              </td>

                              <td style={{ ...tdStyle, textAlign: 'right' }}>
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    min="0"
                                    value={editEstimated}
                                    onChange={e => setEditEstimated(e.target.value)}
                                    style={{ ...inlineInputStyle, width: '100px', textAlign: 'right' }}
                                  />
                                ) : (
                                  <span style={{ fontWeight: 600 }}>
                                    {currencySymbol} {item.estimatedCost.toLocaleString()}
                                  </span>
                                )}
                              </td>

                              <td style={{ ...tdStyle, textAlign: 'right' }}>
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    min="0"
                                    value={editActual}
                                    onChange={e => setEditActual(e.target.value)}
                                    style={{ ...inlineInputStyle, width: '100px', textAlign: 'right' }}
                                  />
                                ) : (
                                  <span
                                    style={{
                                      color: item.actualCost > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                                      fontWeight: item.actualCost > 0 ? 600 : 400,
                                    }}
                                  >
                                    {currencySymbol} {item.actualCost.toLocaleString()}
                                  </span>
                                )}
                              </td>

                              <td style={{ ...tdStyle, textAlign: 'center' }}>
                                {isEditingThis ? (
                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                    <button
                                      onClick={() => saveEditingItem(item.id)}
                                      style={saveSmallButtonStyle}
                                      title="Save Item"
                                      aria-label="Save Item"
                                    >
                                      <Check size={13} />
                                    </button>
                                    <button
                                      onClick={() => setEditingItemId(null)}
                                      style={cancelSmallButtonStyle}
                                      title="Cancel"
                                      aria-label="Cancel"
                                    >
                                      <X size={13} />
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                    <button
                                      onClick={() => startEditingItem(item)}
                                      style={actionIconButtonStyle}
                                      title="Edit item"
                                      aria-label={`Edit ${item.name}`}
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      onClick={() => deleteBudgetItem(item.id)}
                                      style={{ ...actionIconButtonStyle, color: 'var(--status-danger)' }}
                                      title="Delete item"
                                      aria-label={`Delete ${item.name}`}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Line Item Modal */}
      {showAddItemModal && (
        <div style={modalBackdropStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add Budget Line Item</h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                style={iconCloseButtonStyle}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={formLabelStyle}>Item Name / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acoustic Guitarist for Sunset Cocktails"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={formLabelStyle}>Category *</label>
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  style={formInputStyle}
                >
                  {budgetBreakdown.categories.map(c => (
                    <option key={c.category} value={c.category}>
                      {c.category}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Estimated Cost ({currencySymbol}) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="25000"
                    value={newItemEstimated}
                    onChange={e => setNewItemEstimated(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
                <div>
                  <label style={formLabelStyle}>Actual Spent ({currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItemActual}
                    onChange={e => setNewItemActual(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Notes / Vendor Specifications</label>
                <input
                  type="text"
                  placeholder="Optional details, quotes, or inclusions..."
                  value={newItemNotes}
                  onChange={e => setNewItemNotes(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
                <button type="submit" style={submitButtonStyle}>
                  Add to Budget
                </button>
              </div>
            </form>
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

const summaryCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-sm)',
  marginBottom: '24px',
};

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '24px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)',
};

const iconEditButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '2px',
};

const mainAmountStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: 'var(--text-primary)',
  marginTop: '2px',
};

const subLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  marginTop: '4px',
};

const budgetInputStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  padding: '4px 8px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  width: '180px',
};

const saveSmallButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--status-success)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cancelSmallButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card-muted)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const metricsGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
};

const metricBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card-muted)',
  padding: '12px 18px',
  borderRadius: 'var(--radius-md)',
  minWidth: '150px',
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)',
  marginBottom: '4px',
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 800,
  color: 'var(--text-primary)',
};

const metricPercentStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  marginTop: '2px',
};

const contingencyBarStyle: React.CSSProperties = {
  marginTop: '20px',
  paddingTop: '16px',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
};

const contingencyAmountBadgeStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
  padding: '2px 8px',
  borderRadius: '4px',
};

const savingsCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  marginBottom: '24px',
  boxShadow: 'var(--shadow-sm)',
};

const savingsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '12px',
};

const savingItemStyle: React.CSSProperties = {
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
};

const saveBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  backgroundColor: 'var(--color-accent-light)',
  color: 'var(--color-accent)',
  padding: '2px 6px',
  borderRadius: '4px',
};

const applyButtonStyle: React.CSSProperties = {
  border: 'none',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 600,
  padding: '6px 12px',
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  whiteSpace: 'nowrap',
};

const tableSectionCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-sm)',
};

const tableSectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
};

const filterChipStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: '16px',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const addExpenseButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const categoryGroupCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '16px',
};

const catHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const targetAllocBadgeStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginLeft: '10px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  color: 'var(--text-muted)',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid var(--border-color)',
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
  verticalAlign: 'middle',
};

const inlineInputStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
};

const actionIconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  padding: '4px',
  cursor: 'pointer',
};

const customBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
  padding: '1px 5px',
  borderRadius: '3px',
  marginLeft: '6px',
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
  maxWidth: '480px',
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

const formLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};
