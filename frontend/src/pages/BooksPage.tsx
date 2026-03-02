import { useState } from 'react';
import { Book, Author, Library } from '../types';
import { Button, Input, Select, Modal, Table, PageHeader, EmptyState } from '../components/UI';

interface BooksPageProps {
  books: Book[];
  authors: Author[];
  libraries: Library[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const EMPTY_FORM = { title: '', author: '', library: '' };

export default function BooksPage({ books, authors, libraries, onSave, onDelete }: BooksPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Book }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ open: true }); };
  const openEdit = (item: Book) => {
    setForm({ title: item.title, author: String(item.author), library: String(item.library) });
    setModal({ open: true, item });
  };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.title.trim() || !form.author || !form.library) return;
    setSaving(true);
    try {
      await onSave({ title: form.title, author: Number(form.author), library: Number(form.library) }, modal.item?.id);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm === null) return;
    setDeleting(true);
    try {
      await onDelete(deleteConfirm);
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const getAuthorName = (id: number) => authors.find(a => a.id === id)?.fullname || `Author #${id}`;
  const getLibraryName = (id: number) => libraries.find(l => l.id === id)?.name || `Library #${id}`;

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author', render: (row: Book) => getAuthorName(row.author) },
    { key: 'library', label: 'Library', render: (row: Book) => getLibraryName(row.library) },
  ];

  return (
    <div>
      <PageHeader icon="📖" title="Books" count={books.length} onAdd={openCreate} />

      {books.length === 0 ? (
        <EmptyState message="No books yet. Add your first book!" />
      ) : (
        <Table columns={columns} data={books} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {modal.open && (
        <Modal title={modal.item ? 'Edit Book' : 'Add Book'} onClose={handleClose}>
          <Input label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="e.g. Noli Me Tángere" />
          <Select
            label="Author"
            value={form.author}
            onChange={v => setForm({ ...form, author: v })}
            options={authors.map(a => ({ value: String(a.id), label: a.fullname }))}
          />
          <Select
            label="Library"
            value={form.library}
            onChange={v => setForm({ ...form, library: v })}
            options={libraries.map(l => ({ value: String(l.id), label: l.name }))}
          />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}

      {deleteConfirm !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p style={{ marginBottom: '16px' }}>Are you sure you want to delete this book?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={confirmDelete} disabled={deleting} variant="ghost">{deleting ? 'Deleting...' : 'Delete'}</Button>
            <Button onClick={() => setDeleteConfirm(null)} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}