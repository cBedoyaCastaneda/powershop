// src/services/order.service.js

const API_URL = 'http://localhost:3000';

export const orderService = {
  /**
   * Crea una nueva orden desde el checkout
   * @param {Object} orderData - Datos de la orden
   * @param {number} orderData.usuarioId - ID del usuario
   * @param {Array} orderData.items - Array de items [{productoId, cantidad}]
   * @returns {Promise<Object>} - Orden creada
   */
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la orden');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createOrder:', error);
      throw error;
    }
  },

  /**
   * Crea una orden desde los datos del checkout
   * @param {Object} checkoutData - Datos del formulario de checkout
   * @returns {Promise<Object>} - Orden creada
   */
  async createFromCheckout(checkoutData) {
    const { userId, cartItems } = checkoutData;

    // Validar que haya items en el carrito
    if (!cartItems || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const orderPayload = {
      usuarioId: userId || 1, // Usuario invitado por defecto
      items: cartItems.map(item => ({
        productoId: item.id,
        cantidad: item.quantity || 1
      }))
    };

    console.log('Creando orden con payload:', orderPayload);

    return await this.createOrder(orderPayload);
  },

  /**
   * Obtiene todas las órdenes
   * @returns {Promise<Array>} - Lista de órdenes
   */
  async getAllOrders() {
    try {
      const response = await fetch(`${API_URL}/ordenes`);

      if (!response.ok) {
        throw new Error('Error al obtener las órdenes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAllOrders:', error);
      throw error;
    }
  },

  /**
   * Obtiene una orden por ID
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} - Orden encontrada
   */
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_URL}/ordenes/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Orden con ID ${orderId} no encontrada`);
        }
        throw new Error('Error al obtener la orden');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getOrderById:', error);
      throw error;
    }
  },

  /**
   * Elimina una orden
   * @param {number} orderId - ID de la orden a eliminar
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  async deleteOrder(orderId) {
    try {
      const response = await fetch(`${API_URL}/ordenes/${orderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Orden con ID ${orderId} no encontrada`);
        }
        throw new Error('Error al eliminar la orden');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deleteOrder:', error);
      throw error;
    }
  },

  /**
   * Obtiene las órdenes desde localStorage (historial local)
   * @returns {Array} - Lista de órdenes guardadas localmente
   */
  getLocalOrderHistory() {
    try {
      const history = localStorage.getItem('orderHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error al obtener historial local:', error);
      return [];
    }
  },

  /**
   * Guarda una orden en el historial local
   * @param {Object} orderData - Datos de la orden a guardar
   */
  saveToLocalHistory(orderData) {
    try {
      const history = this.getLocalOrderHistory();
      history.unshift({
        ...orderData,
        timestamp: new Date().toISOString()
      });

      // Mantener solo las últimas 20 órdenes
      if (history.length > 20) {
        history.pop();
      }

      localStorage.setItem('orderHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error al guardar en historial local:', error);
    }
  },

  /**
   * Limpia el historial local de órdenes
   */
  clearLocalHistory() {
    localStorage.removeItem('orderHistory');
  }
};