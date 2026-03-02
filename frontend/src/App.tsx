import { useEffect, useState } from 'react';
import { Tab } from './types';
import { useLibraryData } from './hooks/useLibraryData';
import { COLORS, FONTS } from './utils/theme';
import Navbar from './components/NavBar';
import AuthorsPage from './pages/AuthorsPage';
import LibrariesPage from './pages/LibrariesPage';
import MembersPage from './pages/MembersPage';
import BooksPage from './pages/BooksPage';
import BorrowsPage from './pages/BorrowsPage';
import { Spinner } from './components/UI';

export default function App() {
  const [tab, setTab] = useState<Tab>('authors');
  const { authors, libraries, members, books, borrows, loading, fetchAll, save, remove } = useLibraryData();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const counts = {
    authors: authors.length,
    libraries: libraries.length,
    members: members.length,
    books: books.length,
    borrows: borrows.length,
  };

  const handleSave = async (data: any, id?: number) => {
    await save(tab, data, id);
  };

  const handleDelete = async (id: number) => {
    await remove(tab, id);
  };

  const renderPage = () => {
    if (loading) return <Spinner />;
    switch (tab) {
      case 'authors':   return <AuthorsPage authors={authors} onSave={handleSave} onDelete={handleDelete} />;
      case 'libraries': return <LibrariesPage libraries={libraries} onSave={handleSave} onDelete={handleDelete} />;
      case 'members':   return <MembersPage members={members} onSave={handleSave} onDelete={handleDelete} />;
      case 'books':     return <BooksPage books={books} authors={authors} libraries={libraries} onSave={handleSave} onDelete={handleDelete} />;
      case 'borrows':   return <BorrowsPage borrows={borrows} members={members} books={books} onSave={handleSave} onDelete={handleDelete} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: "'Noto Serif', serif" }}>
      {/* Google Fonts — Noto Serif */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

      <Navbar activeTab={tab} onTabChange={setTab} counts={counts} />

      {/* Main content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>
        {/* Content card */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '32px', minHeight: '500px' }}>
          {renderPage()}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: COLORS.textMuted, fontSize: '12px', fontFamily: "'Noto Serif', serif", letterSpacing: '0.1em' }}>
        BIBLIOTECA © {new Date().getFullYear()} — Library Management System
      </footer>
    </div>
  );
}