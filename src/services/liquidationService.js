// liquidationService.js
let liquidations = [
  { id: 1, customer: 'Jean Dupont', amount: 5000, status: 'En cours' },
  { id: 2, customer: 'Marie Kaboré', amount: 12000, status: 'Payée' },
];

export async function getLiquidations() {
  // simule un délai réseau
  return new Promise(resolve => setTimeout(() => resolve(liquidations), 500));
}

export async function addLiquidation(item) {
  const id = liquidations.length + 1;
  liquidations.push({ id, ...item });
  return new Promise(resolve => setTimeout(() => resolve({ id, ...item }), 300));
}

export async function updateLiquidation(id, updatedItem) {
  liquidations = liquidations.map(l => l.id === id ? { ...l, ...updatedItem } : l);
  return new Promise(resolve => setTimeout(() => resolve(updatedItem), 300));
}

export async function deleteLiquidation(id) {
  liquidations = liquidations.filter(l => l.id !== id);
  return new Promise(resolve => setTimeout(() => resolve(true), 300));
}
