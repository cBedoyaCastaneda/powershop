import { useState, useEffect } from 'react';

export function useCart() {
  // Inicializar el carrito desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Validar que sea un array
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
      return [];
    }
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    try {
      if (cartItems && cartItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      // Asegurar que el precio sea un número
      const productWithNumericPrice = {
        ...product,
        price: parseFloat(product.price) || 0
      };
      
      if (existingItem) {
        // Si el producto ya existe, aumentar cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo con cantidad 1
        return [...prevItems, { ...productWithNumericPrice, quantity: 1 }];
      }
    });
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el producto
      removeItem(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Eliminar un producto del carrito
  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Vaciar el carrito completamente
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Obtener el total de items en el carrito
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener el total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getCartTotal
  };
}