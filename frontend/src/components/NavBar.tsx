import { COLORS, FONTS, TAB_CONFIG } from '../utils/theme';
import { ICONS } from '../utils/icons';
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
        <img src="/images/logots.png" alt="Biblioteca Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
        <div>
          <h1 style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '0.12em' }}>BIBLIOTECA</h1>
          <p style={{ color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Library Management System</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', gap: '2px' }}>
        {TAB_CONFIG.map(t => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key as Tab)}
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',}}
              onMouseEnter={e => !isActive && ((e.target as HTMLElement).style.color = COLORS.parchment)}
              onMouseLeave={e => !isActive && ((e.target as HTMLElement).style.color = COLORS.textMuted)}>
             
              {ICONS[t.key](isActive ? COLORS.surface : COLORS.gold)}
              {t.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}