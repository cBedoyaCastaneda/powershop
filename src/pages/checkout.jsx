import { useState } from 'react'
import { CreditCard, Lock, ShoppingCart, Trash2 } from 'lucide-react'
import '../pages/checkout.css'

export default function Checkout() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Laptop Pro 15"', price: 1299.99, quantity: 1, image: '💻' },
    { id: 2, name: 'Mouse Inalámbrico', price: 29.99, quantity: 2, image: '🖱️' },
    { id: 3, name: 'Teclado Mecánico', price: 89.99, quantity: 1, image: '⌨️' }
  ])

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    )
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    setTimeout(() => {
      alert('¡Compra procesada exitosamente! 🎉')
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <>
      {/* Header */}
      <div className="checkout-header">
        <div className="checkout-header-container">
          <ShoppingCart size={40} style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }} />
          <h1>Finalizar Compra</h1>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="checkout-container">
        <div className="checkout-grid">
          {/* Formulario */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Información de Contacto */}
            <div className="checkout-card">
              <h2 className="checkout-card h2" style={{ marginBottom: '1.2rem' }}>
                📧 Información de Contacto
              </h2>
              <div className="checkout-form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="checkout-input"
                />
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="checkout-card">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: '1.2rem', textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                📍 Dirección de Envío
              </h2>
              <div className="checkout-form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nombre completo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="checkout-input"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="checkout-input"
                />
                <div className="checkout-form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="checkout-input"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Código Postal"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="checkout-input"
                  />
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="checkout-card">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: '1.2rem', textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} />
                Información de Pago
              </h2>
              <form onSubmit={handleSubmit} className="checkout-form-group">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Número de tarjeta"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  className="checkout-input"
                />
                <input
                  type="text"
                  name="cardName"
                  placeholder="Nombre en la tarjeta"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className="checkout-input"
                />
                <div className="checkout-form-row">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/AA"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    maxLength="5"
                    className="checkout-input"
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength="4"
                    className="checkout-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="checkout-btn-pay"
                  style={{ opacity: isProcessing ? 0.6 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                  {isProcessing ? (
                    <>⏳ Procesando...</>
                  ) : (
                    <>
                      <Lock size={20} />
                      Pagar S/ {total.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="checkout-summary-section">
            <div className="checkout-summary-card">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: '1.2rem', textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                📦 Resumen del Pedido
              </h2>
              
              <div className="checkout-items-container">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-image">{item.image}</div>
                    <div className="checkout-item-details">
                      <h3 className="checkout-item-name">{item.name}</h3>
                      <p className="checkout-item-price">S/ {item.price.toFixed(2)}</p>
                      <div className="checkout-quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="checkout-qty-btn"
                        >
                          −
                        </button>
                        <span className="checkout-quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="checkout-qty-btn"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="checkout-remove-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-details">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>IGV (18%)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Envío</span>
                  <span>{shipping === 0 ? '🎉 GRATIS' : `S/ ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="checkout-total-row">
                  <span>TOTAL</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="checkout-free-shipping">
                  💡 ¡Envío gratis en compras mayores a S/ 100!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}