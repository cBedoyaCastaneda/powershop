import { useState, useEffect } from 'react'
import { CreditCard, Lock, ShoppingCart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'
import { useCart } from '../hooks/useCart'
import '../pages/checkout.css'

export default function Checkout() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

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
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del checkout desde localStorage si existen
  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('checkoutData');
    if (savedCheckoutData) {
      const data = JSON.parse(savedCheckoutData);
      // Puedes pre-llenar el formulario si lo deseas
    }
  }, []);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Cálculos
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Validar que todos los campos estén completos
      if (!formData.email || !formData.fullName || !formData.address || 
          !formData.city || !formData.zipCode || !formData.cardNumber || 
          !formData.cardName || !formData.expiry || !formData.cvv) {
        throw new Error('Por favor completa todos los campos');
      }

      // 2. Crear o actualizar usuario
      let user;
      try {
        user = await userService.createOrUpdateFromCheckout(formData);
      } catch (userError) {
        console.error('Error al crear usuario:', userError);
        // Si falla la creación del usuario, continuar como invitado
        user = { id: null, email: formData.email };
      }

      // 3. Preparar items para la orden (formato requerido por la API)
      const orderItems = cartItems.map(item => ({
        productoId: item.id,
        cantidad: item.quantity
      }));

      // 4. Crear la orden en la base de datos
      const orderPayload = {
        usuarioId: user?.id || 1, // Si no hay usuario, usar ID 1 como invitado
        items: orderItems
      };

      const orderResponse = await fetch('http://localhost:3000/api/ordenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Error al crear la orden');
      }

      const orderData = await orderResponse.json();
      console.log('Orden creada exitosamente:', orderData);

      // 5. Preparar resumen de compra
      const summary = { 
        subtotal, 
        tax, 
        shipping, 
        total 
      };

      // 6. Datos completos para la página de confirmación
      const checkoutData = {
        orderNumber: orderData.orden?.id || `ORD-${Date.now()}`,
        orderDetails: orderData.orden,
        cartItems,
        formData: {
          email: formData.email,
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        summary,
        date: new Date().toLocaleString(),
        status: 'completed'
      };

      // 7. Guardar en sessionStorage (para la página Compra-Finalizada)
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      // 8. Guardar en localStorage (historial de órdenes)
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.unshift({
        ...checkoutData,
        timestamp: new Date().toISOString()
      });
      
      // Mantener solo las últimas 20 órdenes
      if (orderHistory.length > 20) {
        orderHistory.pop();
      }
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      // 9. Limpiar el carrito después de la compra exitosa
      clearCart();
      localStorage.removeItem('cartItems');

      // 10. Simular procesamiento de pago y redirigir
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/compra-finalizada');
      }, 1500);

    } catch (error) {
      console.error('Error procesando la compra:', error);
      setError(error.message || 'Ocurrió un error al procesar la compra. Por favor intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // El useEffect redirigirá
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
        {/* Mostrar error si existe */}
        {error && (
          <div style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

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
                  required
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
                  required
                />
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Dirección" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  className="checkout-input"
                  required
                />
                <div className="checkout-form-row">
                  <input 
                    type="text" 
                    name="city" 
                    placeholder="Ciudad" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    className="checkout-input"
                    required
                  />
                  <input 
                    type="text" 
                    name="zipCode" 
                    placeholder="Código Postal" 
                    value={formData.zipCode} 
                    onChange={handleInputChange} 
                    className="checkout-input"
                    required
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
                  required
                />
                <input 
                  type="text" 
                  name="cardName" 
                  placeholder="Nombre en la tarjeta" 
                  value={formData.cardName} 
                  onChange={handleInputChange} 
                  className="checkout-input"
                  required
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
                    required
                  />
                  <input 
                    type="text" 
                    name="cvv" 
                    placeholder="CVV" 
                    value={formData.cvv} 
                    onChange={handleInputChange} 
                    maxLength="4" 
                    className="checkout-input"
                    required
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
                          disabled={isProcessing}
                        >
                          −
                        </button>
                        <span className="checkout-quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="checkout-qty-btn"
                          disabled={isProcessing}
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="checkout-remove-btn"
                          disabled={isProcessing}
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
  );
}