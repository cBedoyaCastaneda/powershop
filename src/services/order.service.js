const LS_ORDERS = "ps_orders_v1";

const ensureOrders = () => {
  const raw = localStorage.getItem(LS_ORDERS);
  if (!raw) {
    const seed = [
      {
        id: "o1",
        userId: "u1",
        userEmail: "ana@site.com",
        status: "CREATED",
        createdAt: "07/10/2025",
        items: [],
        totals: {
          subtotal: 0,
          igv: 0,
          shipping: 0,
          total: 0
        },
        shipping: {
          fullName: "",
          address: "",
          city: "",
          zipCode: "",
          email: ""
        }
      },
      {
        id: "o2",
        userId: "u3",
        userEmail: "carmen@site.com",
        status: "PAID",
        createdAt: "07/10/2025",
        items: [],
        totals: {
          subtotal: 0,
          igv: 0,
          shipping: 0,
          total: 0
        },
        shipping: {
          fullName: "",
          address: "",
          city: "",
          zipCode: "",
          email: ""
        }
      }
    ];

    localStorage.setItem(LS_ORDERS, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
};

const saveOrders = (orders) => {
  localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
};

export const orderService = {
  list() {
    return Promise.resolve(ensureOrders());
  },

  getById(id) {
    const orders = ensureOrders();
    return Promise.resolve(orders.find((o) => o.id === id) || null);
  },

  cancel(id) {
    const orders = ensureOrders().map((o) =>
      o.id === id ? { ...o, status: "CANCELLED" } : o
    );
    saveOrders(orders);
    return Promise.resolve(orders.find((o) => o.id === id) || null);
  },

  // 🔹 Crear una orden nueva desde el checkout
  createFromCheckout({
    userId,
    userEmail,
    fullName,
    address,
    city,
    zipCode,
    email,
    cartItems,
    summary
  }) {
    const orders = ensureOrders();

    const newId = `o${orders.length + 1}`;

    const newOrder = {
      id: newId,
      userId,
      userEmail,
      status: "PAID",
      createdAt: new Date().toLocaleString(),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      totals: {
        subtotal: summary.subtotal,
        igv: summary.tax,
        shipping: summary.shipping,
        total: summary.total
      },
      shipping: {
        fullName,
        address,
        city,
        zipCode,
        email
      }
    };

    const updated = [...orders, newOrder];
    saveOrders(updated);
    return Promise.resolve(newOrder);
  }
};
