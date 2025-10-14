const LS_ORDERS = "ps_orders_v1";

const ensureOrders = () => {
  const raw = localStorage.getItem(LS_ORDERS);
  if (!raw) {
    const seed = [
      {
        id: "o1",
        userId: "u1",
        status: "CREATED",
        createdAt: "2025-10-10",
        items: [
          { productId: "p1", name: "Auriculares Pro", qty: 1, price: 199 },
          { productId: "p2", name: "Mouse Gamer", qty: 2, price: 59 }
        ],
        totals: { subtotal: 317, shipping: 10, grand: 327 }
      },
      {
        id: "o2",
        userId: "u3",
        status: "PAID",
        createdAt: "2025-10-11",
        items: [{ productId: "p2", name: "Mouse Gamer", qty: 1, price: 59 }],
        totals: { subtotal: 59, shipping: 10, grand: 69 }
      }
    ];
    localStorage.setItem(LS_ORDERS, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
};

const save = (orders) => localStorage.setItem(LS_ORDERS, JSON.stringify(orders));

export const orderService = {
  list() {
    return Promise.resolve(ensureOrders());
  },
  getById(id) {
    const orders = ensureOrders();
    return Promise.resolve(orders.find(o => o.id === id) || null);
  },
  cancel(id) {
    const orders = ensureOrders().map(o => (o.id === id ? { ...o, status: "CANCELLED" } : o));
    save(orders);
    return Promise.resolve(orders.find(o => o.id === id));
  }
};
