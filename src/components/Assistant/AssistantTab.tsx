import React, { useState, useRef, useEffect } from 'react';
import { usePlanora } from '../../context/PlanoraContext';
import {
  Sparkles,
  Send,
  Cpu,
  CheckCircle,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'How can we cut 15% from our budget without compromising guest experience?',
  'Change our total budget to 22 lakhs',
  'We now have 180 guests attending',
  'What should our weather rain contingency plan be?',
  'Can we host 400 guests on a 50k budget?',
  'Recommend interactive food counter ideas',
];

export const AssistantTab: React.FC = () => {
  const {
    activePlan,
    sendChatMessage,
    isGeneratingAI,
    customApiKey,
  } = usePlanora();

  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isLiveAI = Boolean(
    (customApiKey && customApiKey.trim().length > 10) ||
    (import.meta.env.VITE_GEMINI_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY.startsWith('YOUR_'))
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activePlan.chatHistory, isGeneratingAI]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGeneratingAI) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleSuggestedClick = (text: string) => {
    if (isGeneratingAI) return;
    sendChatMessage(text);
  };

  return (
    <div style={containerStyle}>
      {/* Header Info Banner */}
      <div style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--color-primary)" />
              <h1 style={{ fontSize: '18px', fontWeight: 800 }}>Planora AI Planning Assistant</h1>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Conversational planning co-pilot synchronized with your active budget, dates, and vendor checklists.
            </p>
          </div>

          <div style={engineDisclosureBadgeStyle(isLiveAI)}>
            <Cpu size={14} color={isLiveAI ? 'var(--status-success)' : 'var(--color-primary)'} />
            <div>
              <span style={{ fontWeight: 700, fontSize: '11px', display: 'block' }}>
                {isLiveAI ? 'Gemini Live Cloud Model' : 'Local Deterministic Planner'}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {isLiveAI ? 'Connected via API Key' : '100% Offline & Private Logic Engine'}
              </span>
            </div>
          </div>
        </div>

        {/* Fact vs Suggestion Key */}
        <div style={legendRowStyle}>
          <span style={legendChipStyle}>
            <strong>Facts:</strong> Confirmed headcounts, locked dates, hard budget caps
          </span>
          <span style={legendChipStyle}>
            <strong>Estimates:</strong> Benchmark allocations & suggested quotes
          </span>
          <span style={legendChipStyle}>
            <strong>Suggestions:</strong> Trade-off optimizations & menu flows
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div style={chatLogContainerStyle}>
        {activePlan.chatHistory.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  ...messageBubbleStyle,
                  backgroundColor: isUser ? 'var(--color-primary)' : 'var(--bg-card)',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  borderColor: isUser ? 'transparent' : 'var(--border-color)',
                  borderTopRightRadius: isUser ? '2px' : 'var(--radius-lg)',
                  borderTopLeftRadius: !isUser ? '2px' : 'var(--radius-lg)',
                }}
              >
                {/* Sender & Timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85 }}>
                    {isUser ? 'You' : 'Planora AI Assistant'}
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Message Body with Markdown formatting */}
                <div style={markdownContentStyle}>
                  {formatMarkdownSimple(msg.content)}
                </div>

                {/* Action Trigger Confirmation if any */}
                {msg.actionTriggered && (
                  <div
                    style={{
                      ...actionCardStyle,
                      backgroundColor: isUser ? 'rgba(255,255,255,0.15)' : 'var(--status-success-bg)',
                      borderColor: isUser ? 'rgba(255,255,255,0.3)' : 'var(--status-success)',
                    }}
                  >
                    <CheckCircle size={14} color={isUser ? '#ffffff' : 'var(--status-success)'} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: isUser ? '#ffffff' : 'var(--status-success)' }}>
                      Action Applied: {msg.actionTriggered.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGeneratingAI && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{ ...messageBubbleStyle, backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}>
                <Sparkles size={16} className="spin" />
                <span>Planora is analyzing your constraints and calculating recommendations...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div style={suggestedBarWrapperStyle}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
          Suggested Prompts:
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(q)}
              disabled={isGeneratingAI}
              style={suggestedChipButtonStyle}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} style={inputFormStyle}>
        <input
          type="text"
          placeholder="Ask about budget cuts, menu options, weather risks, or type 'increase budget to 20L'..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          disabled={isGeneratingAI}
          style={chatInputFieldStyle}
          aria-label="Ask Planora assistant"
        />
        <button
          type="submit"
          disabled={isGeneratingAI || !inputMessage.trim()}
          style={{
            ...sendButtonStyle,
            opacity: !inputMessage.trim() || isGeneratingAI ? 0.6 : 1,
            cursor: !inputMessage.trim() || isGeneratingAI ? 'not-allowed' : 'pointer',
          }}
          aria-label="Send message"
        >
          <Send size={16} color="#ffffff" />
        </button>
      </form>
    </div>
  );
};

/**
 * Clean markdown helper for assistant responses (handles headings, bullets, bolding, line breaks).
 */
function formatMarkdownSimple(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Heading 3
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} style={{ fontSize: '14px', fontWeight: 800, margin: '8px 0 4px 0', color: 'inherit' }}>
          {line.replace('### ', '')}
        </h4>
      );
    }
    // Bullet point
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const cleanLine = line.trim().replace(/^[-*]\s*/, '');
      return (
        <div key={idx} style={{ display: 'flex', gap: '6px', margin: '3px 0 3px 8px', fontSize: '13px' }}>
          <span>•</span>
          <span>{renderFormattedInline(cleanLine)}</span>
        </div>
      );
    }
    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      return (
        <div key={idx} style={{ margin: '3px 0 3px 8px', fontSize: '13px' }}>
          {renderFormattedInline(line.trim())}
        </div>
      );
    }
    // Normal paragraph
    return (
      <p key={idx} style={{ margin: line.trim() ? '4px 0' : '6px 0', fontSize: '13px', lineHeight: 1.5 }}>
        {renderFormattedInline(line)}
      </p>
    );
  });
}

function renderFormattedInline(str: string) {
  // Simple bold tag replacement for **word**
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// Styles
const containerStyle: React.CSSProperties = {
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 160px)',
  minHeight: '600px',
};

const headerCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-lg)',
  padding: '16px 20px',
  boxShadow: 'var(--shadow-sm)',
  marginBottom: '16px',
  flexShrink: 0,
};

const engineDisclosureBadgeStyle = (isLive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: isLive ? 'var(--status-success-bg)' : 'var(--color-primary-light)',
  border: `1px solid ${isLive ? 'var(--status-success)' : 'var(--color-primary)'}`,
});

const legendRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '12px',
  paddingTop: '10px',
  borderTop: '1px solid var(--border-color)',
};

const legendChipStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
  backgroundColor: 'var(--bg-card-muted)',
  padding: '2px 8px',
  borderRadius: '4px',
};

const chatLogContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  backgroundColor: 'var(--bg-card-muted)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  marginBottom: '12px',
};

const messageBubbleStyle: React.CSSProperties = {
  maxWidth: '82%',
  padding: '14px 18px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-sm)',
};

const markdownContentStyle: React.CSSProperties = {
  lineHeight: 1.5,
};

const actionCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid transparent',
  marginTop: '10px',
};

const suggestedBarWrapperStyle: React.CSSProperties = {
  marginBottom: '10px',
  flexShrink: 0,
};

const suggestedChipButtonStyle: React.CSSProperties = {
  fontSize: '12px',
  padding: '6px 12px',
  borderRadius: '16px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: 'var(--shadow-sm)',
};

const inputFormStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  flexShrink: 0,
};

const chatInputFieldStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 18px',
  fontSize: '14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  boxShadow: 'var(--shadow-sm)',
};

const sendButtonStyle: React.CSSProperties = {
  padding: '0 20px',
  backgroundColor: 'var(--color-primary)',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
};
