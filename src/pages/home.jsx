import { useState } from 'react';
import products from "../components/products/productList/productList.jsx";
import CartDrawer from "../components/cart/cartDrawer/cartDrawer.jsx";

function Home() {
    const [cartItems, setCartItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const categories = ['Todos', 'Telekinesis', 'Elementales', 'Velocidad', 'Fuerza', 'Invisibilidad', 'Teletransportación'];

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

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
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
                        <h1>Powershop</h1>
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
                        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
                            🛒 <span className="cart-badge">{getTotalItems()}</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h2>Las Mejores Ofertas en Superpoderes!</h2>
                    <p>Atrévete a ver el mundo con una perspectiva que no imaginas!</p>
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
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => addToCart(product)}
                                    >
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cart Modal */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
            />

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

export default Home;