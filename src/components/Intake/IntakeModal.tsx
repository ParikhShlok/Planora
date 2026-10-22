import React, { useState } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  EventType,
  Currency,
  IndoorOutdoor,
  Priority,
  EventIntake,
} from '../../types';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import {
  DEMO_WEDDING_INTAKE,
  DEMO_BIRTHDAY_INTAKE,
  DEMO_COMMUNITY_INTAKE,
} from '../../data/demoPlans';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntakeModal: React.FC<IntakeModalProps> = ({ isOpen, onClose }) => {
  const { createNewPlan } = usePlanora();

  // Wizard Step State
  const [step, setStep] = useState<number>(1);

  // Form State
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });
  const [isApproximateDate, setIsApproximateDate] = useState(false);
  const [city, setCity] = useState('');
  const [venuePreference, setVenuePreference] = useState('');
  const [budget, setBudget] = useState('1500000');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [guestCount, setGuestCount] = useState('200');
  const [styleTheme, setStyleTheme] = useState('');
  const [color1, setColor1] = useState('#4F46E5');
  const [color2, setColor2] = useState('#F59E0B');
  const [isIndoorOutdoor, setIsIndoorOutdoor] = useState<IndoorOutdoor>('hybrid');
  const [priorities, setPriorities] = useState<Priority[]>(['food', 'photography', 'decoration']);
  const [dietaryInput, setDietaryInput] = useState('');
  const [accessibilityInput, setAccessibilityInput] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const loadPreset = (preset: EventIntake) => {
    setEventType(preset.eventType);
    setTitle(preset.title);
    setDate(preset.date);
    setIsApproximateDate(preset.isApproximateDate);
    setCity(preset.city);
    setVenuePreference(preset.venuePreference);
    setBudget(preset.budget.toString());
    setCurrency(preset.currency);
    setGuestCount(preset.guestCount.toString());
    setStyleTheme(preset.styleTheme);
    if (preset.colorPalette[0]) setColor1(preset.colorPalette[0]);
    if (preset.colorPalette[1]) setColor2(preset.colorPalette[1]);
    setIsIndoorOutdoor(preset.isIndoorOutdoor);
    setPriorities(preset.priorities);
    setDietaryInput(preset.dietaryRequirements.join(', '));
    setAccessibilityInput(preset.accessibilityNeeds.join(', '));
    setNotes(preset.notes);
  };

  const togglePriority = (p: Priority) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter(item => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = title.trim() || `${city || 'Grand'} ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Celebration`;
    const numericBudget = Math.max(1000, parseInt(budget, 10) || 500000);
    const numericGuests = Math.max(1, parseInt(guestCount, 10) || 100);

    const dietaryRequirements = dietaryInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const accessibilityNeeds = accessibilityInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const intake: EventIntake = {
      title: finalTitle,
      eventType,
      date,
      isApproximateDate,
      city: city.trim() || 'TBD',
      venuePreference: venuePreference.trim(),
      budget: numericBudget,
      currency,
      guestCount: numericGuests,
      styleTheme: styleTheme.trim() || 'Timeless & Elegant',
      colorPalette: [color1, color2],
      isIndoorOutdoor,
      priorities,
      dietaryRequirements,
      accessibilityNeeds,
      notes: notes.trim(),
    };

    createNewPlan(intake);
    onClose();
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContainerStyle}>
        {/* Header */}
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Create New Event Plan</h2>
          </div>
          <button onClick={onClose} style={iconCloseButtonStyle} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div style={presetsBarStyle}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Quick Start Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_WEDDING_INTAKE)}
            style={presetChipStyle}
          >
            💍 Royal Wedding
          </button>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_BIRTHDAY_INTAKE)}
            style={presetChipStyle}
          >
            🎂 30th Birthday
          </button>
          <button
            type="button"
            onClick={() => loadPreset(DEMO_COMMUNITY_INTAKE)}
            style={presetChipStyle}
          >
            🎪 Community Fair
          </button>
        </div>

        {/* Step Indicator */}
        <div style={stepIndicatorStyle}>
          <div style={{ ...stepDotStyle, backgroundColor: step >= 1 ? 'var(--color-primary)' : 'var(--border-color)', color: '#ffffff' }}>
            1
          </div>
          <span style={{ fontSize: '12px', fontWeight: step === 1 ? 700 : 500 }}>Basics & Scale</span>
          <div style={{ flex: 1, height: '2px', backgroundColor: step >= 2 ? 'var(--color-primary)' : 'var(--border-color)' }} />
          <div style={{ ...stepDotStyle, backgroundColor: step >= 2 ? 'var(--color-primary)' : 'var(--border-color)', color: '#ffffff' }}>
            2
          </div>
          <span style={{ fontSize: '12px', fontWeight: step === 2 ? 700 : 500 }}>Vibe & Priorities</span>
          <div style={{ flex: 1, height: '2px', backgroundColor: step >= 3 ? 'var(--color-primary)' : 'var(--border-color)' }} />
          <div style={{ ...stepDotStyle, backgroundColor: step >= 3 ? 'var(--color-primary)' : 'var(--border-color)', color: '#ffffff' }}>
            3
          </div>
          <span style={{ fontSize: '12px', fontWeight: step === 3 ? 700 : 500 }}>Special Needs</span>
        </div>

        <form onSubmit={step === 3 ? handleFinalSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          {/* STEP 1: Basics & Scale */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={formLabelStyle}>Event Type *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {(['wedding', 'birthday', 'community', 'celebration'] as EventType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      style={{
                        ...typeSelectButtonStyle,
                        borderColor: eventType === type ? 'var(--color-primary)' : 'var(--border-color)',
                        backgroundColor: eventType === type ? 'var(--color-primary-light)' : 'var(--bg-card)',
                        color: eventType === type ? 'var(--color-primary)' : 'var(--text-secondary)',
                        fontWeight: eventType === type ? 700 : 500,
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diya & Arjun’s Sangeet & Wedding"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Event Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={formInputStyle}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isApproximateDate}
                      onChange={e => setIsApproximateDate(e.target.checked)}
                    />
                    Approximate timeframe (date pending confirmation)
                  </label>
                </div>

                <div>
                  <label style={formLabelStyle}>Expected Guests *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="150"
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Estimated Total Budget *</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={currency}
                      onChange={e => setCurrency(e.target.value as Currency)}
                      style={{ ...formInputStyle, width: '90px' }}
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="GBP">£ GBP</option>
                    </select>
                    <input
                      type="number"
                      min="1000"
                      required
                      placeholder="1500000"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={formLabelStyle}>City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Vibe & Priorities */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={formLabelStyle}>Venue Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Heritage Palace Lawn, Rooftop Lounge, Municipal Park"
                  value={venuePreference}
                  onChange={e => setVenuePreference(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Setting Type</label>
                  <select
                    value={isIndoorOutdoor}
                    onChange={e => setIsIndoorOutdoor(e.target.value as IndoorOutdoor)}
                    style={formInputStyle}
                  >
                    <option value="indoor">Indoor (Ballroom / Banquet)</option>
                    <option value="outdoor">Outdoor (Lawn / Beach / Open Air)</option>
                    <option value="hybrid">Hybrid (Courtyard + Indoor Backup)</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Style / Theme Concept</label>
                  <input
                    type="text"
                    placeholder="e.g. Regal Rajputana, Retro Neon, Modern Boho"
                    value={styleTheme}
                    onChange={e => setStyleTheme(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Color Palette Accent</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={color1}
                      onChange={e => setColor1(e.target.value)}
                      style={colorPickerStyle}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Primary</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={color2}
                      onChange={e => setColor2(e.target.value)}
                      style={colorPickerStyle}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Secondary</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Top Planning Priorities</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { id: 'food', label: 'Catering & Food' },
                    { id: 'photography', label: 'Photography & Reel' },
                    { id: 'decoration', label: 'Floral & Decor' },
                    { id: 'entertainment', label: 'Live DJ & Music' },
                    { id: 'cultural', label: 'Cultural Traditions' },
                    { id: 'accessibility', label: 'Accessibility & Comfort' },
                    { id: 'sustainability', label: 'Eco-Friendly / Zero Waste' },
                  ].map(p => {
                    const isSelected = priorities.includes(p.id as Priority);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePriority(p.id as Priority)}
                        style={{
                          ...prioritySelectButtonStyle,
                          borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                          backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-card)',
                          color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                          fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Special Needs & Finalization */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={formLabelStyle}>Dietary Requirements & Food Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Vegetarian, Jain options, Gluten-Free, Halal, Nut Allergies"
                  value={dietaryInput}
                  onChange={e => setDietaryInput(e.target.value)}
                  style={formInputStyle}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                  Separate multiple requirements with commas.
                </span>
              </div>

              <div>
                <label style={formLabelStyle}>Accessibility & Senior Guest Provisions</label>
                <input
                  type="text"
                  placeholder="e.g. Wheelchair ramp, Golf cart shuttle, Priority seating for elders"
                  value={accessibilityInput}
                  onChange={e => setAccessibilityInput(e.target.value)}
                  style={formInputStyle}
                />
              </div>

              <div>
                <label style={formLabelStyle}>Additional Planning Notes / Special Wishes</label>
                <textarea
                  rows={3}
                  placeholder="Any ceremonies, guest preferences, music genres, or specific constraints..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ ...formInputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={planSummaryCardStyle}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Ready to Generate Plan:
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {eventType.toUpperCase()} in {city || 'TBD'} • {guestCount} guests • {currency} {parseInt(budget || '0', 10).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div style={modalFooterStyle}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={backButtonStyle}
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} style={cancelButtonStyle}>
                Cancel
              </button>

              {step < 3 ? (
                <button
                  type="submit"
                  style={nextButtonStyle}
                >
                  Next Step <ArrowRight size={14} />
                </button>
              ) : (
                <button type="submit" style={createButtonStyle}>
                  <Sparkles size={14} /> Generate Complete Plan
                </button>
              )}
            </div>
          </div>
        </form>
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
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  backdropFilter: 'blur(4px)',
};

const modalContainerStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  width: '100%',
  maxWidth: '620px',
  boxShadow: 'var(--shadow-lg)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const iconCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const presetsBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  borderRadius: 'var(--radius-md)',
  marginBottom: '16px',
};

const presetChipStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  padding: '3px 8px',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
};

const stepIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px',
};

const stepDotStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 800,
};

const formLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
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

const typeSelectButtonStyle: React.CSSProperties = {
  padding: '10px 8px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer',
  fontSize: '12px',
  textAlign: 'center',
};

const prioritySelectButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  borderRadius: '16px',
  border: '1px solid var(--border-color)',
  fontSize: '12px',
  cursor: 'pointer',
};

const colorPickerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: 0,
};

const planSummaryCardStyle: React.CSSProperties = {
  padding: '12px 16px',
  backgroundColor: 'var(--color-primary-light)',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(79, 70, 229, 0.2)',
};

const modalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  paddingTop: '16px',
  borderTop: '1px solid var(--border-color)',
};

const backButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 14px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
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

const nextButtonStyle: React.CSSProperties = {
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

const createButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 20px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
};
