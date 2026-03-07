import { useState , useEffect } from 'react';
import { Author } from '../types';
import { ICONS } from '../utils/icons';
import { Button, Input, Modal, Table, PageHeader, EmptyState, ConfirmDelete } from '../components/UI';

interface AuthorsPageProps {
  authors: Author[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function AuthorsPage({ authors, onSave, onDelete }: AuthorsPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Author }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null);
  const [form, setForm] = useState({ fullname: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm({ fullname: '' }); setModal({ open: true }); };
  const openEdit = (item: Author) => { setForm({ fullname: item.fullname }); setModal({ open: true, item }); };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.fullname.trim()) return;
    setSaving(true);
    try { await onSave(form, modal.item?.id); handleClose(); } finally { setSaving(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (modal.open) handleSave();
    if (deleteTarget) handleDeleteConfirm();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [modal.open, deleteTarget, form]);

  const columns = [{ key: 'id', label: 'ID' }, { key: 'fullname', label: 'Full Name' }];

  return (
    <div>
      <PageHeader icon={ICONS.authors()} title="Authors" count={authors.length} onAdd={openCreate} />
      {authors.length === 0 ? <EmptyState message="No authors yet." /> : (
        <Table columns={columns} data={authors} onEdit={openEdit} onDelete={(id) => setDeleteTarget(authors.find(a => a.id === id) || null)} />
      )}
      {modal.open && (
        <Modal title={modal.item ? 'Edit Author' : 'Add Author'} onClose={handleClose}>
          <Input label="Full Name" value={form.fullname} onChange={v => setForm({ fullname: v })} placeholder="e.g. José Rizal" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete itemName={deleteTarget.fullname} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}