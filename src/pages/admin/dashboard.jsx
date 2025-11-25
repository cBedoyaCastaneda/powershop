// import { useEffect, useMemo, useState } from "react";
// import { userService } from "../../services/user.service";
// import { orderService } from "../../services/order.service";
// import { todayISO, between } from "../../services/seed.service";
// import { formatCurrency } from "../../utils/formatters";

export default function AdminDashboard(){}
//   const [from, setFrom] = useState(todayISO());
//   const [to, setTo] = useState(todayISO());
//   const [users, setUsers] = useState([]);
//   const [orders, setOrders] = useState([]);

//   useEffect(()=>{ userService.list().then(setUsers); orderService.list().then(setOrders); },[]);

//   const kpis = useMemo(()=>{
//     const ords = orders.filter(o => between(o.createdAt, from, to));
//     const revenue = ords.reduce((acc, o) => acc + (o.totals?.grand || 0), 0);
//     const newUsers = users.filter(u => between(u.createdAt, from, to)).length;
//     return { orders: ords.length, newUsers, revenue };
//   }, [orders, users, from, to]);

//   return (
//     <div>
//       <h1>Panel del administrador</h1>
//       <div style={{ display:"flex", gap:12, margin:"12px 0" }}>
//         <label>Desde <input type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
//         <label>Hasta <input type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
//         <Kpi title="Órdenes" value={kpis.orders} />
//         <Kpi title="Usuarios nuevos" value={kpis.newUsers} />
//         <Kpi title="Ingresos" value={formatCurrency(kpis.revenue)} />
//       </div>
//     </div>
//   );
// }

// function Kpi({title, value}) {
//   return (
//     <div style={{ border:"1px solid #ddd", borderRadius:12, padding:16 }}>
//       <div style={{ opacity:.7 }}>{title}</div>
//       <div style={{ fontSize:28, fontWeight:700 }}>{value}</div>
//     </div>
//   );
// }
