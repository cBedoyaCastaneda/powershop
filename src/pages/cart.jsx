import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'src/pages/css/Cart.css';

function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  const navigate = useNavigate();

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

  if (!isOpen) return null;

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // Aquí puedes agregar impuestos o descuentos si es necesario
    return subtotal;
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'cart-overlay') {
      onClose();
    }
  };

  const handleCheckout = () => {
    // Preparar datos para el checkout
    const checkoutData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category
      })),
      subtotal: calculateSubtotal(),
      shipping: 0, // Envío gratis
      total: calculateTotal(),
      timestamp: new Date().toISOString(),
      itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
    };

    // Guardar datos del checkout en localStorage
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

    // También guardar en el historial (útil para ver pedidos anteriores)
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const orderNumber = `ORD-${Date.now()}`;
    
    const orderRecord = {
      orderNumber,
      ...checkoutData,
      status: 'pending' // pending, processing, completed, cancelled
    };

    // Agregar al historial (mantener últimas 10 órdenes)
    orderHistory.unshift(orderRecord);
    if (orderHistory.length > 10) {
      orderHistory.pop();
    }
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    console.log('Datos guardados para checkout:', checkoutData);
    console.log('Número de orden:', orderNumber);

    onClose(); // Cierra el modal del carrito
    navigate('/checkout'); // Navega al checkout
  };

  return (
    <div className="cart-overlay" onClick={handleOverlayClick}>
      <div className="cart-modal">
        <div className="cart-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p className="empty-icon">🛒</p>
              <p>Tu carrito está vacío</p>
              <p className="empty-subtitle">¡Agrega productos para comenzar!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">{item.image}</div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-price">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span className="free-shipping">Gratis</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceder al Pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;