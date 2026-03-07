import { useState , useEffect } from 'react';
import { Library } from '../types';
import { ICONS } from '../utils/icons';
import { Button, Input, Modal, Table, PageHeader, EmptyState, ConfirmDelete } from '../components/UI';

interface LibrariesPageProps {
  libraries: Library[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function LibrariesPage({ libraries, onSave, onDelete }: LibrariesPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Library }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Library | null>(null);
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm({ name: '' }); setModal({ open: true }); };
  const openEdit = (item: Library) => { setForm({ name: item.name }); setModal({ open: true, item }); };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.name.trim()) return;
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

  const columns = [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Library Name' }];

  return (
    <div>
      <PageHeader icon={ICONS.libraries()} title="Libraries" count={libraries.length} onAdd={openCreate} />
      {libraries.length === 0 ? <EmptyState message="No libraries yet." /> : (
        <Table columns={columns} data={libraries} onEdit={openEdit} onDelete={(id) => setDeleteTarget(libraries.find(l => l.id === id) || null)} />
      )}
      {modal.open && (
        <Modal title={modal.item ? 'Edit Library' : 'Add Library'} onClose={handleClose}>
          <Input label="Library Name" value={form.name} onChange={v => setForm({ name: v })} placeholder="e.g. National Library" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete itemName={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}