import { customerService } from './customerService';

const STORAGE_KEY = 'liquidations_data_v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function initIfEmpty() {
  const existing = load();
  if (existing && Array.isArray(existing)) return enrich(existing);

  const customers = customerService.getAll();
  const findC = (i) => customers[i % customers.length];
  const seed = Array.from({ length: 12 }).map((_, i) => {
    const c = findC(i);
    const statuses = ['PENDING', 'PAID', 'CANCELLED'];
    const status = statuses[i % statuses.length];
    return {
      id: i + 1,
      code: `LQ-${String(i + 1).padStart(4, '0')}`,
      customerId: c.id,
      amount: 20000 + i * 3500,
      status,
      date: Date.now() - 86400000 * (i + 1),
    };
  });
  save(seed);
  return enrich(seed);
}

function nextId(items) {
  return items.length ? Math.max(...items.map(x => x.id)) + 1 : 1;
}

function enrich(items) {
  const customers = customerService.getAll();
  const byId = new Map(customers.map(c => [c.id, c]));
  return items.map(l => ({
    ...l,
    customerName: byId.get(l.customerId)?.fullName || 'Client inconnu',
  }));
}

export const liquidationService = {
  getAll() {
    return initIfEmpty();
  },

  getById(id) {
    const items = this.getAll();
    const l = items.find(x => x.id === Number(id));
    return l || null;
  },

  search({ text = '', status, fromDate, toDate } = {}) {
    const q = (text || '').trim().toLowerCase();
    const items = this.getAll();

    const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    return items.filter(l => {
      if (status && status !== 'ALL' && l.status !== status) return false;
      const d = l.date;
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (!q) return true;
      return (
        (l.code && l.code.toLowerCase().includes(q)) ||
        (l.customerName && l.customerName.toLowerCase().includes(q))
      );
    });
  },

  create({ customerId, amount, status = 'PENDING', date = Date.now() }) {
    const items = this.getAll();
    const newItem = {
      id: nextId(items),
      code: `LQ-${String(nextId(items)).padStart(4, '0')}`,
      customerId: Number(customerId),
      amount: Number(amount),
      status,
      date: typeof date === 'string' ? new Date(date).getTime() : date,
    };
    const updated = [newItem, ...items];
    save(updated);
    return enrich([newItem])[0];
  },

  update(id, payload) {
    const items = this.getAll();
    const idx = items.findIndex(x => x.id === Number(id));
    if (idx === -1) return null;
    const updatedItem = {
      ...items[idx],
      ...payload,
      customerId: payload.customerId ? Number(payload.customerId) : items[idx].customerId,
      amount: payload.amount ? Number(payload.amount) : items[idx].amount,
      date: payload.date ? (typeof payload.date === 'string' ? new Date(payload.date).getTime() : payload.date) : items[idx].date,
    };
    const updated = [...items];
    updated[idx] = updatedItem;
    save(updated);
    return enrich([updatedItem])[0];
  },

  markPaid(id) {
    return this.update(id, { status: 'PAID' });
  },

  remove(id) {
    const items = this.getAll();
    const updated = items.filter(x => x.id !== Number(id));
    save(updated);
    return true;
  },
};

export default liquidationService;
