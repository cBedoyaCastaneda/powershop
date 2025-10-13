import { useState } from 'react';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Laptop Pro', price: 1299, category: 'Electrónica', image: '💻' },
    { id: 2, name: 'Smartphone X', price: 899, category: 'Electrónica', image: '📱' },
    { id: 3, name: 'Auriculares Wireless', price: 199, category: 'Audio', image: '🎧' },
    { id: 4, name: 'Smartwatch', price: 299, category: 'Wearables', image: '⌚' },
    { id: 5, name: 'Tablet Plus', price: 649, category: 'Electrónica', image: '📱' },
    { id: 6, name: 'Cámara 4K', price: 799, category: 'Fotografía', image: '📷' },
    { id: 7, name: 'Teclado Mecánico', price: 149, category: 'Accesorios', image: '⌨️' },
    { id: 8, name: 'Mouse Gaming', price: 79, category: 'Accesorios', image: '🖱️' },
  ];

  const categories = ['Todos', 'Electrónica', 'Audio', 'Wearables', 'Fotografía', 'Accesorios'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">🛒</span>
            <h1>TechStore</h1>
          </div>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍</button>
          </div>

          <nav className="nav">
            <a href="#" className="nav-link">Inicio</a>
            <a href="#" className="nav-link">Ofertas</a>
            <a href="#" className="nav-link">Contacto</a>
            <button className="cart-btn">
              🛒 <span className="cart-badge">{cartCount}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Las Mejores Ofertas en Tecnología</h2>
          <p>Descubre productos de alta calidad con envío gratis</p>
          <button className="cta-btn">Ver Ofertas</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h3>Categorías</h3>
          <div className="categories">
            {categories.map(category => (
              <button 
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <h3>Productos Destacados</h3>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h4>{product.name}</h4>
                  <p className="product-price">${product.price}</p>
                  <button className="add-to-cart-btn" onClick={addToCart}>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>TechStore</h4>
              <p>Tu tienda de tecnología de confianza</p>
            </div>
            <div className="footer-section">
              <h4>Enlaces</h4>
              <a href="#">Sobre Nosotros</a>
              <a href="#">Términos y Condiciones</a>
              <a href="#">Política de Privacidad</a>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              <p>Email: info@techstore.com</p>
              <p>Tel: +51 123 456 789</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TechStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;