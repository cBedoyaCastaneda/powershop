import React, { useState } from 'react';
import { Users, TrendingUp, DollarSign, Package, Clipboard, Zap, MessageSquare, CheckCircle } from 'lucide-react'; 
// Reintroduciendo lucide-react para los iconos

// --- Datos Ficticios para el Dashboard ---
const mockData = {
  totalUsers: 15420,
  newUsersToday: 125,
  newUsersWeek: 780,
  totalSales: 8529,
  monthlyRevenue: 985732.50, // Ingresos del mes
  activeProducts: 50,
  pendingOrders: 32,
  completedOrders: 985,
  activeSessions: 145,
  openTickets: 12,
};

// --- Componente de Tarjeta de Métrica Principal (KPI) ---
const MetricCard = ({ title, value, icon: Icon, color, footer }) => (
  <div style={{
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Sombra más visible en oscuro
      backgroundColor: '#374151', // Fondo oscuro para la tarjeta
      borderBottom: `4px solid ${color}`, // Uso de la propiedad 'color' para el borde inferior
      transition: 'transform 0.3s',
      marginBottom: '20px',
      flex: '1 1 220px', // Responsive flex basis para la cuadrícula
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase' }}> {/* Texto gris claro */}
        {title}
      </div>
      <Icon size={24} color="#9ca3af" /> {/* Icono gris claro */}
    </div>
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '36px', fontWeight: '800', color: '#f9fafb' }}> {/* Valor en blanco */}
        {value}
      </div>
      <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}> {/* Footer en gris claro */}
        {footer}
      </div>
    </div>
  </div>
);

// --- Componente de Lista Operacional ---
const OperationalList = ({ title, children }) => (
  <div style={{
    backgroundColor: '#374151', // Fondo oscuro
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    border: '1px solid #4b5563', // Borde oscuro y sutil
    height: '100%',
    flex: '1 1 300px', // Responsive flex basis para la cuadrícula
  }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f9fafb', borderBottom: '1px solid #4b5563', paddingBottom: '8px', marginBottom: '16px' }}>{title}</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {children}
    </div>
  </div>
);

// --- Componente Auxiliar para ítems de lista ---
const DetailItem = ({ title, value, icon: Icon, color }) => (
  <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '12px', 
      backgroundColor: '#4b5563', // Fondo más oscuro para el ítem
      borderRadius: '8px', 
      border: '1px solid #6b7280' // Borde más oscuro
    }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icon size={20} color={color} /> 
      <span style={{ fontWeight: '500', color: '#f3f4f6' }}>{title}</span> {/* Texto en blanco */}
    </div>
    <span style={{ fontSize: '20px', fontWeight: '700', color: color }}>{value.toLocaleString('es-ES')}</span>
  </div>
);


// --- Componente Principal del Dashboard ---
const AdminDashboard = () => {
  const [data, setData] = useState(mockData);

  const formatCurrency = (value) => {
    // Usando el estilo estándar de moneda
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
  };

  const style = {
      container: {
          minHeight: '100vh', 
          backgroundColor: '#1f2937', // Fondo principal muy oscuro
          padding: '32px', 
          fontFamily: 'sans-serif'
      },
      header: {
          marginBottom: '32px'
      },
      h1: {
          fontSize: '28px',
          fontWeight: '700',
          color: '#f9fafb' // Título en blanco
      },
      p: {
          color: '#9ca3af' // Subtítulo en gris claro
      },
      kpiGrid: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
      },
      operationalGrid: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px'
      }
  };


  return (
    <div style={style.container}>
      <header style={style.header}>
        <h1 style={style.h1}>
          Panel de Superpoderes del Negocio
        </h1>
        <p style={style.p}>Métricas clave y estado operativo en tiempo real.</p>
      </header>

      {/* --- Sección de Métricas Clave (KPIs) --- */}
      <section style={style.kpiGrid}>
        <MetricCard
          title="Total de Usuarios"
          value={data.totalUsers.toLocaleString('es-ES')}
          icon={Users} // Icono de lucide-react
          color="#6366f1" // Indigo 500 (ligeramente más brillante)
          footer={`+${data.newUsersToday} Hoy / +${data.newUsersWeek} Semana`}
        />
        <MetricCard
          title="Ingresos del Mes"
          value={formatCurrency(data.monthlyRevenue)}
          icon={DollarSign} // Icono de lucide-react
          color="#34d399" // Green 500 (ligeramente más brillante)
          footer="Proyección positiva vs. mes pasado"
        />
        <MetricCard
          title="Ventas Totales"
          value={data.totalSales.toLocaleString('es-ES')}
          icon={TrendingUp} // Icono de lucide-react
          color="#fcd34d" // Yellow 500 (ligeramente más brillante)
          footer="Número total de transacciones completadas."
        />
        <MetricCard
          title="Productos Activos"
          value={data.activeProducts.toLocaleString('es-ES')}
          icon={Package} // Icono de lucide-react
          color="#f87171" // Red 500 (ligeramente más brillante)
          footer="Disponibles en la tienda de superpoderes."
        />
      </section>

      {/* --- Sección de Estado Operacional (Listas Detalladas) --- */}
      <section style={style.operationalGrid}>
        
        {/* Órdenes */}
        <OperationalList title="Gestión de Órdenes">
          <DetailItem 
            title="Órdenes Pendientes" 
            value={data.pendingOrders} 
            color="#ef4444" // Red 600
            icon={Clipboard} // Icono de lucide-react
          />
          <DetailItem 
            title="Órdenes Completadas" 
            value={data.completedOrders} 
            color="#10b981" // Green 600
            icon={CheckCircle} // Icono de lucide-react
          />
        </OperationalList>

        {/* Sesiones y Sistema */}
        <OperationalList title="Estado del Sistema">
          <DetailItem 
            title="Sesiones Activas" 
            value={data.activeSessions} 
            color="#3b82f6" // Blue 600
            icon={Zap} // Icono de lucide-react
          />
          <DetailItem 
            title="Productos Disponibles" 
            value={data.activeProducts} 
            color="#f59e0b" // Yellow 700
            icon={Package} // Icono de lucide-react
          />
        </OperationalList>

        {/* Soporte */}
        <OperationalList title="Soporte y Atención">
          <DetailItem 
            title="Tickets de Soporte Abiertos" 
            value={data.openTickets} 
            color="#a855f7" // Purple 600
            icon={MessageSquare} // Icono de lucide-react
          />
          <p style={{fontSize: '12px', color: '#9ca3af', paddingTop: '8px'}}> {/* Texto en gris claro */}
            Revisar la cola de soporte es prioridad para asegurar la satisfacción del cliente.
          </p>
        </OperationalList>
      </section>
    </div>
  );
};

export default AdminDashboard;