import { useEffect, useMemo, useState } from "react";
import { orderService } from "../../services/order.service";

export function useOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    orderService.list().then((o) => { setOrders(o); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return orders;
    return orders.filter(o =>
      o.id.toLowerCase().includes(t) ||
      o.status.toLowerCase().includes(t) ||
      o.userId.toLowerCase().includes(t)
    );
  }, [orders, q]);

  const cancel = async (id) => {
    const upd = await orderService.cancel(id);
    setOrders(prev => prev.map(o => (o.id === upd.id ? upd : o)));
  };

  
  async function CreateOrder(payload) {
    const orderResponse = await fetch('http://localhost:3000/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.error || 'Error al crear la orden');
    }

    const orderData = await orderResponse.json();
    return orderData
  }

  return { loading, orders: filtered, setQ, q, cancel, CreateOrder };
}
