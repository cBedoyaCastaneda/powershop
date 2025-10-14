import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'src/pages/css/Cart.css';

function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'cart-overlay') {
      onClose();
    }
  };

  const handleCheckout = () => {
    onClose(); // Cierra el modal del carrito
    navigate('/checkout'); // ✅ Con minúscula
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
                      <p className="item-price">${item.price}</p>
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
                  <span>${calculateTotal().toFixed(2)}</span>
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