import { useState , useEffect } from 'react';
import { Borrow, Member, Book } from '../types';
import { COLORS, FONTS } from '../utils/theme';
import { ICONS } from '../utils/icons';
import { Button, Input, Select, Modal, Table, PageHeader, EmptyState, ConfirmDelete } from '../components/UI';

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
  const [deleteTarget, setDeleteTarget] = useState<Borrow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ open: true }); };
  const openEdit = (item: Borrow) => {
    setForm({ member: String(item.member), book: String(item.book), borrowdate: item.borrowdate || '', returndate: item.returndate || '' });
    setModal({ open: true, item });
  };
  const handleClose = () => setModal({ open: false });

  const handleSave = async () => {
    if (!form.member || !form.book) return;
    setSaving(true);
    try {
      await onSave({ member: Number(form.member), book: Number(form.book), borrowdate: form.borrowdate || null, returndate: form.returndate || null }, modal.item?.id);
      handleClose();
    } finally {
      setSaving(false);
    }
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

  const getMemberName = (id: number) => members.find(m => m.id === id)?.fullname || `Member #${id}`;
  const getBookTitle = (id: number) => books.find(b => b.id === id)?.title || `Book #${id}`;
  const getDeleteLabel = (b: Borrow) => `${getMemberName(b.member)} — ${getBookTitle(b.book)}`;

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member', render: (row: Borrow) => getMemberName(row.member) },
    { key: 'book', label: 'Book', render: (row: Borrow) => getBookTitle(row.book) },
    { key: 'borrowdate', label: 'Borrow Date', render: (row: Borrow) => row.borrowdate || '—' },
    { key: 'returndate', label: 'Return Date', render: (row: Borrow) => row.returndate
      ? <span style={{ color: '#6abf69', fontFamily: FONTS.body }}>{row.returndate}</span>
      : <span style={{ color: COLORS.gold, fontStyle: 'italic', fontFamily: FONTS.body }}>Not yet returned</span>
    },
  ];

  const active = borrows.filter(b => !b.returndate).length;
  const returned = borrows.filter(b => !!b.returndate).length;

  return (
    <div>
      <PageHeader icon={ICONS.borrows()} title="Borrows" count={borrows.length} onAdd={openCreate} />

      {borrows.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Active', value: active, color: COLORS.gold },
            { label: 'Returned', value: returned, color: '#6abf69' },
            { label: 'Total', value: borrows.length, color: COLORS.parchment },
          ].map(s => (
            <div key={s.label} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
              <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {borrows.length === 0 ? (
        <EmptyState message="No borrow records yet." />
      ) : (
        <Table columns={columns} data={borrows} onEdit={openEdit} onDelete={(id) => setDeleteTarget(borrows.find(b => b.id === id) || null)} />
      )}

      {modal.open && (
        <Modal title={modal.item ? 'Edit Borrow' : 'New Borrow'} onClose={handleClose}>
          <Select label="Member" value={form.member} onChange={v => setForm({ ...form, member: v })}
            options={members.map(m => ({ value: String(m.id), label: m.fullname }))} />
          <Select label="Book" value={form.book} onChange={v => setForm({ ...form, book: v })}
            options={books.map(b => ({ value: String(b.id), label: b.title }))} />
          <Input label="Borrow Date" value={form.borrowdate} onChange={v => setForm({ ...form, borrowdate: v })} type="date" />
          <Input label="Return Date" value={form.returndate} onChange={v => setForm({ ...form, returndate: v })} type="date" />
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete itemName={getDeleteLabel(deleteTarget)} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />)}
    </div>
  );
}