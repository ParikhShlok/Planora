import React, { useState, useRef } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  X,
  Settings,
  Key,
  Cpu,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    plans,
    activePlan,
    setActivePlanId,
    deletePlan,
    resetToDemo,
    exportPlanJSON,
    importPlanJSON,
    customApiKey,
    setCustomApiKey,
  } = usePlanora();

  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(apiKeyInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      const res = importPlanJSON(text);
      if (res.success) {
        setImportError(null);
        onClose();
      } else {
        setImportError(res.error || 'Failed to import JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalContainerStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Planora AI Settings & Storage</h2>
          </div>
          <button onClick={onClose} style={iconCloseButtonStyle} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          {/* AI Provider Config */}
          <div style={cardBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Key size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>AI Provider & Intelligence Mode</h3>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Planora AI features a <strong>dual-engine architecture</strong>. By default, it operates on a high-intelligence, deterministic local planning engine that requires no API keys, runs with zero latency, and protects user privacy.
            </p>

            <form onSubmit={handleSaveApiKey} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Optional Google Gemini API Key:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  placeholder="AIzaSy... (Leave empty to use Local Engine)"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  style={formInputStyle}
                />
                <button type="submit" style={saveApiKeyButtonStyle}>
                  Save
                </button>
              </div>

              {saveSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontSize: '12px' }}>
                  <CheckCircle size={14} /> AI Configuration saved!
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <Shield size={12} color="var(--status-success)" />
                Keys are stored only in your local browser sandbox and never transmitted to any third-party server.
              </div>
            </form>
          </div>

          {/* Saved Events Manager */}
          <div style={cardBoxStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Layers size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Manage Saved Plans ({plans.length})</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plans.map(p => {
                const isActive = p.id === activePlan.id;
                return (
                  <div
                    key={p.id}
                    style={{
                      ...planItemRowStyle,
                      borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                      backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--bg-card-muted)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                          {p.intake.title}
                        </span>
                        {isActive && (
                          <span style={activeBadgeStyle}>Active</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {p.intake.eventType.toUpperCase()} • {p.intake.date} • {p.intake.guestCount} guests
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {!isActive && (
                        <button
                          onClick={() => setActivePlanId(p.id)}
                          style={switchPlanButtonStyle}
                        >
                          Switch To
                        </button>
                      )}
                      {plans.length > 1 && (
                        <button
                          onClick={() => deletePlan(p.id)}
                          style={deletePlanButtonStyle}
                          title="Delete plan"
                          aria-label={`Delete plan ${p.intake.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backup, Import & Export */}
          <div style={cardBoxStyle}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
              Backup, Import & Reset
            </h3>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={exportPlanJSON} style={actionButtonStyle}>
                <Download size={14} /> Export Active Plan JSON
              </button>

              <button onClick={() => fileInputRef.current?.click()} style={actionButtonStyle}>
                <Upload size={14} /> Import Plan JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <button
                onClick={() => {
                  if (confirm('Reset all plans to the factory demo presets? Any unsaved edits will be replaced.')) {
                    resetToDemo();
                    onClose();
                  }
                }}
                style={{ ...actionButtonStyle, color: 'var(--status-danger)' }}
              >
                <RefreshCw size={14} /> Reset to Demo Presets
              </button>
            </div>

            {importError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-danger)', fontSize: '12px', marginTop: '10px' }}>
                <AlertCircle size={14} /> {importError}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={onClose} style={closeButtonStyle}>
            Done
          </button>
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
  maxWidth: '580px',
  boxShadow: 'var(--shadow-lg)',
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
};

const iconCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};

const cardBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '16px',
};

const formInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  fontSize: '13px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
};

const saveApiKeyButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const planItemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
};

const activeBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '4px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
};

const switchPlanButtonStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  padding: '4px 8px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  cursor: 'pointer',
};

const deletePlanButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--status-danger)',
  cursor: 'pointer',
  padding: '4px',
};

const actionButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-card-muted)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '8px 20px',
  backgroundColor: 'var(--color-primary)',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};
