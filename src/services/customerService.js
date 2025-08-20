const STORAGE_KEY = 'customers_data_v1';

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
  if (existing && Array.isArray(existing)) return existing;
  const seed = [
    { id: 1, fullName: 'Alice Martin', email: 'alice@example.com', phone: '+33 6 12 34 56 78', city: 'Paris', createdAt: Date.now() - 86400000 * 5 },
    { id: 2, fullName: 'Bob Dupont', email: 'bob@example.com', phone: '+33 6 22 33 44 55', city: 'Lyon', createdAt: Date.now() - 86400000 * 2 },
    { id: 3, fullName: 'Camille Leroy', email: 'camille@example.com', phone: '+33 7 55 44 33 22', city: 'Marseille', createdAt: Date.now() - 86400000 * 8 },
    { id: 4, fullName: 'David Morel', email: 'david@example.com', phone: '+33 6 98 76 54 32', city: 'Lille', createdAt: Date.now() - 86400000 * 1 },
  ];
  save(seed);
  return seed;
}

function nextId(items) {
  return items.length ? Math.max(...items.map(c => c.id)) + 1 : 1;
}

export const customerService = {
  getAll() {
    return initIfEmpty();
  },

  search(query) {
    const q = (query || '').trim().toLowerCase();
    const items = this.getAll();
    if (!q) return items;
    return items.filter(c =>
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  },

  getById(id) {
    return this.getAll().find(c => c.id === Number(id)) || null;
  },

  create(payload) {
    const items = this.getAll();
    const newItem = {
      id: nextId(items),
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      city: payload.city.trim(),
      createdAt: Date.now(),
    };
    const updated = [newItem, ...items];
    save(updated);
    return newItem;
  },

  update(id, payload) {
    const items = this.getAll();
    const index = items.findIndex(c => c.id === Number(id));
    if (index === -1) return null;
    const updatedItem = { ...items[index], ...payload };
    const updated = [...items];
    updated[index] = updatedItem;
    save(updated);
    return updatedItem;
  },

  remove(id) {
    const items = this.getAll();
    const updated = items.filter(c => c.id !== Number(id));
    save(updated);
    return true;
  },
};

export default customerService;
