import { useState, useEffect } from 'react'
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Download, Share2 } from 'lucide-react'
import './orderSuccess.css'

export default function OrderSuccess() {
  const [confettiActive, setConfettiActive] = useState(true)
  const [progress, setProgress] = useState(0)
  const [checkoutData, setCheckoutData] = useState(null)

  useEffect(() => {
    // Cargar datos desde sessionStorage
    const savedData = sessionStorage.getItem('checkoutData')
    if (savedData) {
      try {
        setCheckoutData(JSON.parse(savedData))
      } catch {
        console.error('❌ Error al leer los datos desde sessionStorage')
      }
    }

    // Animación de progreso
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Desactivar confetti
    setTimeout(() => setConfettiActive(false), 5000)

    return () => clearInterval(interval)
  }, [])

  if (!checkoutData) return <div className="loading">Cargando datos del pedido...</div>

  const { formData, cartItems, summary, date } = checkoutData

  const handleDownloadReceipt = () => alert('📄 Descargando comprobante...')
  const handleShareOrder = () => alert('📤 Compartiendo pedido...')
  const handleTrackOrder = () => alert('🚚 Redirigiendo a seguimiento...')

  return (
    <div className="success-wrapper">
      {/* 🎉 Confetti */}
      {confettiActive && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff0080', '#00d4ff', '#ffe600', '#00ff88', '#ff00ff'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* ✅ Header */}
      <div className="success-header">
        <div className="success-icon-container">
          <CheckCircle className="success-icon" size={80} />
          <div className="success-ring"></div>
          <div className="success-ring" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <h1 className="success-title">¡Compra Finalizada!</h1>
        <p className="success-subtitle">
          Gracias {formData.fullName || 'cliente'}, tu pedido ha sido procesado correctamente.
        </p>
        <div className="success-order-number">
          <span className="order-label">Fecha:</span>
          <span className="order-number">{date}</span>
        </div>
      </div>

      {/* 📦 Estado del Pedido */}
      <div className="success-container">
        <div className="order-progress-card">
          <h2 className="section-title">📦 Estado del Pedido</h2>
          <div className="progress-timeline">
            <div className="progress-step active">
              <div className="progress-icon">✓</div>
              <span>Confirmado</span>
            </div>
            <div className="progress-line active" style={{ width: `${progress}%` }}></div>
            <div className={`progress-step ${progress > 33 ? 'active' : ''}`}>
              <div className="progress-icon">📦</div>
              <span>Preparando</span>
            </div>
            <div className={`progress-line ${progress > 33 ? 'active' : ''}`} style={{ width: progress > 33 ? `${(progress - 33) * 1.5}%` : '0%' }}></div>
            <div className={`progress-step ${progress > 66 ? 'active' : ''}`}>
              <div className="progress-icon">🚚</div>
              <span>En Camino</span>
            </div>
            <div className={`progress-line ${progress > 66 ? 'active' : ''}`} style={{ width: progress > 66 ? `${(progress - 66) * 3}%` : '0%' }}></div>
            <div className={`progress-step ${progress === 100 ? 'active' : ''}`}>
              <div className="progress-icon">🎉</div>
              <span>Entregado</span>
            </div>
          </div>
        </div>

        {/* 🔹 Contenido principal */}
        <div className="success-grid">
          {/* 🧾 Detalles de envío y productos */}
          <div className="order-details-section">
            {/* Información de entrega */}
            <div className="info-card">
              <div className="card-header">
                <Truck size={24} />
                <h3>Información de Entrega</h3>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Destinatario:</span>
                  <span className="info-value">{formData.fullName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Dirección:</span>
                  <span className="info-value">
                    {formData.address}, {formData.city}, {formData.zipCode}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{formData.email}</span>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="info-card">
              <div className="card-header">
                <Package size={24} />
                <h3>Productos ({cartItems.length})</h3>
              </div>
              <div className="card-content">
                <div className="order-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-image-success">{item.image}</div>
                      <div className="item-info-success">
                        <h4>{item.name}</h4>
                        <p className="item-quantity">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="item-price-success">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="action-buttons">
              <button onClick={handleTrackOrder} className="action-btn primary">
                <Truck size={20} /> Rastrear Pedido <ArrowRight size={18} />
              </button>
              <button onClick={handleDownloadReceipt} className="action-btn secondary">
                <Download size={20} /> Descargar Comprobante
              </button>
              <button onClick={handleShareOrder} className="action-btn secondary">
                <Share2 size={20} /> Compartir
              </button>
            </div>
          </div>

          {/* 💰 Resumen del pago */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h3 className="summary-title">💰 Resumen del Pago</h3>
              <div className="summary-details">
                <div className="summary-row"><span>Subtotal</span><span>S/ {summary.subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>IGV (18%)</span><span>S/ {summary.tax.toFixed(2)}</span></div>
                <div className="summary-row"><span>Envío</span><span>{summary.shipping === 0 ? '🎉 GRATIS' : `S/ ${summary.shipping.toFixed(2)}`}</span></div>
                <div className="summary-divider"></div>
                <div className="summary-total"><span>TOTAL PAGADO</span><span>S/ {summary.total.toFixed(2)}</span></div>
              </div>

              <div className="order-date">
                <span>📅 Fecha del pedido:</span>
                <span>{date}</span>
              </div>
            </div>

            {/* Mensaje final */}
            <div className="thank-you-card">
              <div className="thank-you-icon">🎊</div>
              <h3>¡Gracias por tu Compra!</h3>
              <p>Te mantendremos informado sobre el estado de tu pedido.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
