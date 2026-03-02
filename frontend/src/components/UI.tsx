import React from 'react';
import { COLORS, FONTS } from '../utils/theme';

// ─── Button ────────────────────────────────────────────────────────────────
type ButtonVariant = 'gold' | 'crimson' | 'slate' | 'ghost';

const BUTTON_STYLES: Record<ButtonVariant, { bg: string; hover: string; text: string }> = {
  gold:    { bg: COLORS.gold,    hover: COLORS.goldHover,    text: COLORS.surface },
  crimson: { bg: COLORS.crimson, hover: COLORS.crimsonHover, text: '#f5ede0' },
  slate:   { bg: COLORS.slate,   hover: COLORS.slateHover,   text: '#f5ede0' },
  ghost:   { bg: 'transparent',  hover: COLORS.surfaceHover, text: COLORS.textMuted },
};

interface ButtonProps {
  onClick: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  disabled?: boolean;
  children: React.ReactNode;
}

export function Button({ onClick, variant = 'gold', size = 'md', disabled, children }: ButtonProps) {
  const s = BUTTON_STYLES[variant];
  const padding = size === 'sm' ? '6px 14px' : '10px 22px';
  const fontSize = size === 'sm' ? '11px' : '13px';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: s.bg,
        color: s.text,
        padding,
        fontSize,
        fontFamily: FONTS.body,
        border: variant === 'ghost' ? `1px solid ${COLORS.borderLight}` : 'none',
        borderRadius: '8px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => !disabled && ((e.target as HTMLElement).style.background = s.hover)}
      onMouseLeave={e => !disabled && ((e.target as HTMLElement).style.background = s.bg)}
    >
      {children}
    </button>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────
interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

export function Input({ label, value, onChange, type = 'text', placeholder }: InputProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', color: COLORS.gold, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: FONTS.body }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px',
          background: COLORS.bg, color: COLORS.parchment,
          border: `1px solid ${COLORS.borderLight}`, borderRadius: '8px',
          fontFamily: FONTS.body, fontSize: '15px', outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = COLORS.gold)}
        onBlur={e => (e.target.style.borderColor = COLORS.borderLight)}
      />
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────
interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', color: COLORS.gold, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: FONTS.body }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px',
          background: COLORS.bg, color: COLORS.parchment,
          border: `1px solid ${COLORS.borderLight}`, borderRadius: '8px',
          fontFamily: FONTS.body, fontSize: '15px', outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,5,2,0.8)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: COLORS.surfaceHover, border: `1px solid ${COLORS.gold}`, borderRadius: '16px', width: '100%', maxWidth: '480px', margin: '0 16px', overflow: 'hidden', boxShadow: `0 25px 60px rgba(0,0,0,0.7)` }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.gold}` }}>
          <h2 style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ color: COLORS.gold, background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', lineHeight: 1, opacity: 0.8 }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: '24px', color: COLORS.parchment, fontFamily: FONTS.body }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: COLORS.surfaceHover, color: COLORS.gold, border: `1px solid ${COLORS.borderLight}`, borderRadius: '999px', padding: '2px 10px', fontSize: '12px', fontFamily: FONTS.body }}>
      {children}
    </span>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
export function EmptyState({ message = 'No records found' }: { message?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 0', color: COLORS.textMuted }}>
      <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>📭</div>
      <p style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.body }}>{message}</p>
    </div>
  );
}

// ─── Loading Spinner ────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 0' }}>
      <div style={{ width: '36px', height: '36px', border: `3px solid ${COLORS.borderLight}`, borderTop: `3px solid ${COLORS.gold}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Page Header ───────────────────────────────────────────────────────────
interface PageHeaderProps {
  icon: string;
  title: string;
  count: number;
  onAdd: () => void;
}

export function PageHeader({ icon, title, count, onAdd }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
      <div>
        <h1 style={{ color: COLORS.parchment, fontFamily: FONTS.display, fontSize: '26px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{icon}</span> {title}
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: '13px', fontFamily: FONTS.body, margin: '4px 0 0', letterSpacing: '0.05em' }}>
          {count} record{count !== 1 ? 's' : ''}
        </p>
      </div>
      <Button onClick={onAdd} variant="gold">+ Add New</Button>
    </div>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────
interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onEdit: (row: any) => void;
  onDelete: (id: number) => void;
}

export function Table({ columns, data, onEdit, onDelete }: TableProps) {
  const thStyle: React.CSSProperties = {
    color: COLORS.gold, padding: '12px 16px', fontSize: '11px',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    textAlign: 'left', fontFamily: FONTS.body, fontWeight: 600,
    borderBottom: `1px solid ${COLORS.border}`,
  };
  const tdStyle: React.CSSProperties = {
    color: COLORS.parchment, padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
    fontFamily: FONTS.body, fontSize: '15px',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => <th key={col.key} style={thStyle}>{col.label}</th>)}
            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} style={{ transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = COLORS.surfaceHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {columns.map(col => (
                <td key={col.key} style={tdStyle}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button size="sm" variant="slate" onClick={() => onEdit(row)}>Edit</Button>
                  <Button size="sm" variant="crimson" onClick={() => onDelete(row.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}