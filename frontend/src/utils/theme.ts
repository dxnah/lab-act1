export const COLORS = {
  bg: '#65412c',
  surface: '#311b10',
  surfaceHover: '#2a1a10',
  border: '#3a2214',
  borderLight: '#5c3d2a',
  gold: '#c9a84c',
  goldHover: '#e0c060',
  parchment: '#e8d5b7',
  parchmentMuted: '#a88c6e',
  crimson: '#7a1a24',
  crimsonHover: '#9e2230',
  slate: '#4a6785',
  slateHover: '#5c7fa0',
  textMuted: '#8a6a4a',
  text: '#e8d5b7', 
};

export const FONTS = {
  display: "'Noto Serif', serif",
  body: "'Noto Serif', serif",
};

export const TAB_CONFIG = [
  { key: 'authors' as const, label: 'Authors', icon: '✒️', singular: 'Author' },
  { key: 'libraries' as const, label: 'Libraries', icon: '🏛️', singular: 'Library' },
  { key: 'members' as const, label: 'Members', icon: '👤', singular: 'Member' },
  { key: 'books' as const, label: 'Books', icon: '📖', singular: 'Book' },
  { key: 'borrows' as const, label: 'Borrows', icon: '📋', singular: 'Borrow' },
];

