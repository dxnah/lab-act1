export const COLORS = {
  bg: '#65412c',
  surface: '#311b10',
  surfaceHover: '#2a1a10',
  border: '#3a2214',
  borderLight: '#5c3d2a',
  gold: '#bd9f4e',
  goldHover: '#e0c060a4',
  parchment: '#e8d5b7',
  parchmentMuted: '#a88c6e',
  crimson: '#7a1a24',
  crimsonHover: '#7a1a249e',
  slate: '#bd9f4e',
  slateHover: '#e0c060a4',
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

