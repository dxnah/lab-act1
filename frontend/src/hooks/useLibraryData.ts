import { useState, useCallback } from 'react';
import {
  getAuthors, getLibraries, getMembers, getBooks, getBorrows,
  createAuthor, updateAuthor, deleteAuthor,
  createLibrary, updateLibrary, deleteLibrary,
  createMember, updateMember, deleteMember,
  createBook, updateBook, deleteBook,
  createBorrow, updateBorrow, deleteBorrow,
} from '../utils/api';
import { Author, Library, Member, Book, Borrow, Tab } from '../types';

export function useLibraryData() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, l, m, b, br] = await Promise.all([
        getAuthors(), getLibraries(), getMembers(), getBooks(), getBorrows(),
      ]);
      setAuthors(a.data);
      setLibraries(l.data);
      setMembers(m.data);
      setBooks(b.data);
      setBorrows(br.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = async (tab: Tab, data: any, id?: number) => {
    const ops: Record<Tab, { create: (d: any) => any; update: (id: number, d: any) => any }> = {
      authors:   { create: createAuthor,  update: updateAuthor },
      libraries: { create: createLibrary, update: updateLibrary },
      members:   { create: createMember,  update: updateMember },
      books:     { create: createBook,    update: updateBook },
      borrows:   { create: createBorrow,  update: updateBorrow },
    };
    if (id) {
      await ops[tab].update(id, data);
    } else {
      await ops[tab].create(data);
    }
    await fetchAll();
  };

  const remove = async (tab: Tab, id: number) => {
    const ops: Record<Tab, (id: number) => any> = {
      authors: deleteAuthor, libraries: deleteLibrary,
      members: deleteMember, books: deleteBook, borrows: deleteBorrow,
    };
    await ops[tab](id);
    await fetchAll();
  };

  return { authors, libraries, members, books, borrows, loading, fetchAll, save, remove };
}