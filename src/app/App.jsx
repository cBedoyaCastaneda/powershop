import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "../pages/home.jsx";  // Cambié "Home" por "home.jsx"
import ProductDetail from "../components/products/productDetail/productDetail.jsx";
import Checkout from "../pages/checkout.jsx"
import "./App.css";

function App() {
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

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/home"
            element={
              <Home
                cartItems={cartItems}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                cartItems={cartItems}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cartItems={cartItems}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;