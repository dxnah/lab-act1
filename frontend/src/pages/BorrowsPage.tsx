import { useState } from 'react';
import { Borrow, Member, Book } from '../types';
import { Button, Input, Select, Modal, Table, PageHeader, EmptyState } from '../components/UI';
import { COLORS, FONTS } from '../utils/theme';

interface BorrowsPageProps {
  borrows: Borrow[];
  members: Member[];
  books: Book[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const EMPTY_FORM = { member: '', book: '', borrowdate: '', returndate: '' };

export default function BorrowsPage({ borrows, members, books, onSave, onDelete }: BorrowsPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Borrow }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ open: true }); };
  const openEdit = (item: Borrow) => {
    setForm({
      member: String(item.member), book: String(item.book),
      borrowdate: item.borrowdate || '', returndate: item.returndate || '',
    });
    setModal({ open: true, item });
  };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.member || !form.book) return;
    setSaving(true);
    try {
      await onSave({
        member: Number(form.member), book: Number(form.book),
        borrowdate: form.borrowdate || null, returndate: form.returndate || null,
      }, modal.item?.id);
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

  const getMemberName = (id: number) => members.find(m => m.id === id)?.fullname || `Member #${id}`;
  const getBookTitle = (id: number) => books.find(b => b.id === id)?.title || `Book #${id}`;

  const isOverdue = (borrow: Borrow) => {
    if (!borrow.returndate) return false;
    return new Date(borrow.returndate) < new Date();
  };

  const isActive = (borrow: Borrow) => {
    return !borrow.returndate || new Date(borrow.returndate) >= new Date();
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member', render: (row: Borrow) => getMemberName(row.member) },
    { key: 'book', label: 'Book', render: (row: Borrow) => getBookTitle(row.book) },
    { key: 'borrowdate', label: 'Borrow Date', render: (row: Borrow) => row.borrowdate || '—' },
    {
      key: 'returndate', label: 'Return Date',
      render: (row: Borrow) => {
        if (!row.returndate) {
          return <span style={{ color: COLORS.gold, fontStyle: 'italic', fontFamily: FONTS.body }}>Active</span>;
        }
        if (isOverdue(row)) {
          return <span style={{ color: '#e05050' }}>{row.returndate}</span>;
        }
        return <span style={{ color: COLORS.parchment }}>{row.returndate}</span>;
      }
    },
    {
      key: 'status', label: 'Status',
      render: (row: Borrow) => {
        if (!row.returndate) {
          return <span style={{ color: COLORS.gold, fontStyle: 'italic', fontFamily: FONTS.body }}>Active</span>;
        }
        if (isOverdue(row)) {
          return <span style={{ color: '#e05050' }}>Overdue</span>;
        }
        return <span style={{ color: '#6abf69' }}>Returned</span>;
      }
    },
  ];

  const active = borrows.filter(b => isActive(b)).length;

  return (
    <div>
      <PageHeader icon="📋" title="Borrows" count={borrows.length} onAdd={openCreate} />

      {/* Summary */}
      {borrows.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Active Borrows</div>
            <div style={{ color: COLORS.gold, fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{active}</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Returned</div>
            <div style={{ color: COLORS.parchment, fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{borrows.length - active}</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Total Records</div>
            <div style={{ color: COLORS.parchment, fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{borrows.length}</div>
          </div>
        </div>
      )}

      {borrows.length === 0 ? (
        <EmptyState message="No borrow records yet." />
      ) : (
        <Table columns={columns} data={borrows} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {modal.open && (
        <Modal title={modal.item ? 'Edit Borrow' : 'New Borrow'} onClose={handleClose}>
          <Select label="Member" value={form.member} onChange={v => setForm({ ...form, member: v })}
            options={members.map(m => ({ value: String(m.id), label: m.fullname }))} />
          <Select label="Book" value={form.book} onChange={v => setForm({ ...form, book: v })}
            options={books.map(b => ({ value: String(b.id), label: b.title }))} />
          <Input label="Borrow Date" value={form.borrowdate} onChange={v => setForm({ ...form, borrowdate: v })} type="date" />
          <Input label="Return Date (leave empty if still active)" value={form.returndate} onChange={v => setForm({ ...form, returndate: v })} type="date" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}

      {deleteConfirm !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p style={{ marginBottom: '16px' }}>Are you sure you want to delete this borrow record?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={confirmDelete} disabled={deleting} variant="crimson">{deleting ? 'Deleting...' : 'Delete'}</Button>
            <Button onClick={() => setDeleteConfirm(null)} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}