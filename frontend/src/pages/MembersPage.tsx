import { useState } from 'react';
import { Member } from '../types';
import { Button, Input, Modal, Table, PageHeader, EmptyState } from '../components/UI';

interface MembersPageProps {
  members: Member[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function MembersPage({ members, onSave, onDelete }: MembersPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Member }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState({ fullname: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setForm({ fullname: '' }); setModal({ open: true }); };
  const openEdit = (item: Member) => { setForm({ fullname: item.fullname }); setModal({ open: true, item }); };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.fullname.trim()) return;
    setSaving(true);
    try {
      await onSave(form, modal.item?.id);
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

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'fullname', label: 'Full Name' },
  ];

  return (
    <div>
      <PageHeader icon="👤" title="Members" count={members.length} onAdd={openCreate} />

      {members.length === 0 ? (
        <EmptyState message="No members yet. Add your first member!" />
      ) : (
        <Table columns={columns} data={members} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {modal.open && (
        <Modal title={modal.item ? 'Edit Member' : 'Add Member'} onClose={handleClose}>
          <Input label="Full Name" value={form.fullname} onChange={v => setForm({ fullname: v })} placeholder="e.g. Juan dela Cruz" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}
      {deleteConfirm !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p style={{ marginBottom: '16px' }}>Are you sure you want to delete this member?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={confirmDelete} disabled={deleting} variant="ghost">{deleting ? 'Deleting...' : 'Delete'}</Button>
            <Button onClick={() => setDeleteConfirm(null)} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}    </div>
  );
}