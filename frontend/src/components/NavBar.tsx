import { COLORS, FONTS, TAB_CONFIG } from '../utils/theme';
import { Tab } from '../types';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  counts: Record<Tab, number>;
}

export default function Navbar({ activeTab, onTabChange, counts }: NavbarProps) {
  return (
    <header style={{ background: COLORS.surface, borderBottom: `2px solid ${COLORS.gold}`, position: 'sticky', top: 0, zIndex: 40 }}>
      {/* Top bar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${COLORS.border}` }}>
        <span style={{ fontSize: '28px' }}>📚</span>
        <div>
          <h1 style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '0.12em' }}>BIBLIOTECA</h1>
          <p style={{ color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Library Management System</p>
        </div>

        {/* Stats */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
          {TAB_CONFIG.map(t => (
            <div key={t.key} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px' }}>{t.icon}</div>
              <div style={{ color: counts[t.key] > 0 ? COLORS.gold : COLORS.borderLight, fontSize: '12px', fontFamily: FONTS.body, fontWeight: 600 }}>
                {counts[t.key]}
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: FONTS.body }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', gap: '2px' }}>
        {TAB_CONFIG.map(t => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              style={{
                padding: '12px 24px',
                fontFamily: FONTS.body,
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: isActive ? COLORS.gold : 'transparent',
                color: isActive ? COLORS.surface : COLORS.textMuted,
                border: 'none',
                borderBottom: isActive ? 'none' : `2px solid transparent`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderRadius: '6px 6px 0 0',
              }}
              onMouseEnter={e => !isActive && ((e.target as HTMLElement).style.color = COLORS.parchment)}
              onMouseLeave={e => !isActive && ((e.target as HTMLElement).style.color = COLORS.textMuted)}
            >
              {t.icon} {t.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}