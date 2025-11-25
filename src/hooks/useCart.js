///AQUI van las funciones del Cart, para
///no tener que pasarlas por codigo como herencia
import { useState } from "react";
export function useCart() {
	const [cartItems, setCartItems] = useState([]);
	
	// Función para agregar al carrito
	const addToCart = (product) => {
		setCartItems(prevItems => {
			const existingItem = prevItems.find(item => item.id === product.id);
			
			if (existingItem) {
				return prevItems.map(item =>
					item.id === product.id
					? { ...item, quantity: item.quantity + 1 }
					: item
				);
			}
			
			return [...prevItems, { ...product, quantity: 1 }];
		});
	};
	
	const updateQuantity = (id, newQuantity) => {
		if (newQuantity <= 0) {
			removeItem(id);
			return;
		}
		
		setCartItems(prevItems =>
			prevItems.map(item =>
				item.id === id ? { ...item, quantity: newQuantity } : item
			)
		);
	};
	
	const removeItem = (id) => {
		setCartItems(prevItems => prevItems.filter(item => item.id !== id));
	};

	return {cartItems, addToCart, updateQuantity, removeItem}
}