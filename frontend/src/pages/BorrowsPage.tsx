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

const EMPTY_FORM = { member: '', book: '', borrowdate: '', returndate: '', returned: false };
const BORROW_DAYS = 4;

export default function BorrowsPage({ borrows, members, books, onSave, onDelete }: BorrowsPageProps) {
  const [modal, setModal] = useState<{ open: boolean; item?: Borrow }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEditing = !!modal.item;

  // Status logic:
  // - Has returndate → Returned
  // - No returndate, within 4 days of borrowdate → Active
  // - No returndate, past 4 days → Overdue
  const getStatus = (borrow: Borrow): 'returned' | 'overdue' | 'active' => {
    if (borrow.returndate) return 'returned';
    if (!borrow.borrowdate) return 'active';
    const due = new Date(borrow.borrowdate);
    due.setDate(due.getDate() + BORROW_DAYS);
    due.setHours(23, 59, 59, 999);
    return new Date() > due ? 'overdue' : 'active';
  };

  const getDueDate = (borrowdate: string): string => {
    const d = new Date(borrowdate);
    d.setDate(d.getDate() + BORROW_DAYS);
    return d.toISOString().split('T')[0];
  };

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ open: true }); };

  const openEdit = (item: Borrow) => {
    setForm({
      member: String(item.member),
      book: String(item.book),
      borrowdate: item.borrowdate || '',
      returndate: item.returndate || '',
      returned: !!item.returndate,
    });
    setModal({ open: true, item });
  };

  const handleClose = () => setModal({ open: false });

  const handleReturnedToggle = (checked: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    setForm({
      ...form,
      returned: checked,
      returndate: checked ? (form.returndate || today) : '',
    });
  };

  const handleSave = async () => {
    if (!form.member || !form.book) return;
    setSaving(true);
    try {
      await onSave({
        member: Number(form.member),
        book: Number(form.book),
        borrowdate: form.borrowdate || null,
        returndate: form.returned
          ? (form.returndate || new Date().toISOString().split('T')[0])
          : null,
      }, modal.item?.id);
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

  const getMemberName = (id: number) => members.find(m => m.id === id)?.fullname || `Member #${id}`;
  const getBookTitle = (id: number) => books.find(b => b.id === id)?.title || `Book #${id}`;

  const StatusBadge = ({ status }: { status: 'returned' | 'overdue' | 'active' }) => {
    if (status === 'returned') return <span style={{ color: '#6abf69', fontFamily: FONTS.body }}>Returned</span>;
    if (status === 'overdue')  return <span style={{ color: '#e05050', fontFamily: FONTS.body, fontWeight: 700 }}>⚠ Overdue</span>;
    return <span style={{ color: COLORS.gold, fontStyle: 'italic', fontFamily: FONTS.body }}>Active</span>;
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'member', label: 'Member', render: (row: Borrow) => getMemberName(row.member) },
    { key: 'book', label: 'Book', render: (row: Borrow) => getBookTitle(row.book) },
    { key: 'borrowdate', label: 'Borrow Date', render: (row: Borrow) => row.borrowdate || '—' },
    {
      key: 'due', label: 'Due Date',
      render: (row: Borrow) => {
        if (!row.borrowdate) return <span style={{ color: COLORS.textMuted }}>—</span>;
        if (row.returndate) return <span style={{ color: COLORS.textMuted, textDecoration: 'line-through' }}>{getDueDate(row.borrowdate)}</span>;
        const status = getStatus(row);
        return (
          <span style={{ color: status === 'overdue' ? '#e05050' : COLORS.parchment }}>
            {getDueDate(row.borrowdate)}
          </span>
        );
      }
    },
    {
      key: 'returndate', label: 'Returned On',
      render: (row: Borrow) => {
        if (!row.returndate) return <span style={{ color: COLORS.textMuted }}>—</span>;
        return <span style={{ color: '#6abf69' }}>{row.returndate}</span>;
      }
    },
    {
      key: 'status', label: 'Status',
      render: (row: Borrow) => <StatusBadge status={getStatus(row)} />
    },
  ];

  const returnedCount = borrows.filter(b => getStatus(b) === 'returned').length;
  const overdueCount  = borrows.filter(b => getStatus(b) === 'overdue').length;
  const activeCount   = borrows.filter(b => getStatus(b) === 'active').length;

  // Status badge for the modal form toggle
  const formStatus = form.returned ? 'returned' : 'active';

  return (
    <div>
      <PageHeader icon="📋" title="Borrows" count={borrows.length} onAdd={openCreate} />

      {borrows.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Active</div>
            <div style={{ color: COLORS.gold, fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{activeCount}</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Overdue</div>
            <div style={{ color: '#e05050', fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{overdueCount}</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Returned</div>
            <div style={{ color: '#6abf69', fontSize: '28px', fontFamily: FONTS.display, fontWeight: 700 }}>{returnedCount}</div>
          </div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '14px 20px', flex: 1 }}>
            <div style={{ color: COLORS.textMuted, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>Total</div>
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
        <Modal title={isEditing ? 'Edit Borrow' : 'New Borrow'} onClose={handleClose} hideClose>

          <Select
            label="Member"
            value={form.member}
            onChange={v => setForm({ ...form, member: v })}
            options={members.map(m => ({ value: String(m.id), label: m.fullname }))}
          />
          <Select
            label="Book"
            value={form.book}
            onChange={v => setForm({ ...form, book: v })}
            options={books.map(b => ({ value: String(b.id), label: b.title }))}
          />
          <Input
            label="Borrow Date"
            value={form.borrowdate}
            onChange={v => setForm({ ...form, borrowdate: v })}
            type="date"
          />

          {/* Auto due date info */}
          {form.borrowdate && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px',
              background: 'rgba(201,168,76,0.08)', border: `1px solid ${COLORS.borderLight}`,
              borderRadius: '8px', fontFamily: FONTS.body, fontSize: '13px', color: COLORS.textMuted,
            }}>
              Due date: <span style={{ color: COLORS.gold, fontWeight: 600 }}>{getDueDate(form.borrowdate)}</span>
              <span style={{ marginLeft: '8px', fontSize: '11px' }}>(books must be returned within {BORROW_DAYS} days)</span>
            </div>
          )}

          <div style={{ borderTop: `1px solid ${COLORS.border}`, margin: '16px 0' }} />

          {/* Mark as Returned toggle */}
          <div
            onClick={() => handleReturnedToggle(!form.returned)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${form.returned ? '#6abf69' : COLORS.borderLight}`,
              background: form.returned ? 'rgba(106,191,105,0.08)' : 'transparent',
              marginBottom: '16px', transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0,
              border: `2px solid ${form.returned ? '#6abf69' : COLORS.borderLight}`,
              background: form.returned ? '#6abf69' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}>
              {form.returned && <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 700 }}>✓</span>}
            </div>
            <div>
              <div style={{ color: form.returned ? '#6abf69' : COLORS.parchment, fontFamily: FONTS.body, fontSize: '14px', fontWeight: 600 }}>
                Mark as Returned
              </div>
              <div style={{ color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: '12px' }}>
                {form.returned ? 'Book has been returned' : 'Click to mark as returned'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{
                padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
                fontFamily: FONTS.body, fontWeight: 700,
                background: form.returned ? 'rgba(106,191,105,0.15)' : 'rgba(201,168,76,0.15)',
                color: form.returned ? '#6abf69' : COLORS.gold,
                border: `1px solid ${form.returned ? '#6abf69' : COLORS.gold}`,
              }}>
                {form.returned ? 'RETURNED' : 'ACTIVE'}
              </span>
            </div>
          </div>

          {form.returned && (
            <Input
              label="Return Date"
              value={form.returndate}
              onChange={v => setForm({ ...form, returndate: v })}
              type="date"
            />
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={handleClose} variant="ghost">Cancel</Button>
          </div>
        </Modal>
      )}

      {deleteConfirm !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)} hideClose>
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