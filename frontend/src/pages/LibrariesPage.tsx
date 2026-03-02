import { useState } from 'react';
import { Library } from '../types';
import { Button, Input, Modal, Table, PageHeader, EmptyState } from '../components/UI';

interface LibrariesPageProps {
  libraries: Library[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function LibrariesPage({ libraries, onSave, onDelete }: LibrariesPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Library }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setForm({ name: '' }); setModal({ open: true }); };
  const openEdit = (item: Library) => { setForm({ name: item.name }); setModal({ open: true, item }); };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave(form, modal.item?.id);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => setDeleteConfirm(id);

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

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Library Name' },
  ];

  return (
    <div>
      <PageHeader icon="🏛️" title="Libraries" count={libraries.length} onAdd={openCreate} />

      {libraries.length === 0 ? (
        <EmptyState message="No libraries yet. Add your first library!" />
      ) : (
        <Table columns={columns} data={libraries} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {modal.open && (
        <Modal title={modal.item ? 'Edit Library' : 'Add Library'} onClose={handleClose} hideClose>
          <Input label="Library Name" value={form.name} onChange={v => setForm({ name: v })} placeholder="e.g. National Library" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}

      {deleteConfirm !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)} hideClose>
          <p style={{ marginBottom: '16px' }}>Are you sure you want to delete this library?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={confirmDelete} disabled={deleting} variant="crimson">{deleting ? 'Deleting...' : 'Delete'}</Button>
            <Button onClick={() => setDeleteConfirm(null)} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}