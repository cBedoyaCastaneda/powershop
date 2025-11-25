import { useState, useEffect } from 'react';
import products from "../components/products/productList/productList.jsx";
import CartDrawer from "../components/cart/cartDrawer/cartDrawer.jsx";
import categories from "./category.jsx";
import UserMenu from '../components/user/userMenuHome.jsx';
import { useCart } from '../hooks/useCart.js';
import ProductGrid from '../components/products/productGrid.jsx';

function Home() {
    // Función para el carrito
    const { cartItems, addToCart, updateQuantity, removeItem } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;


    // Obtener productos destacados
    const featuredProducts = products.filter(product => product.featured === true);

    // Resetear a página 1 cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);


    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Calcular páginas
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Obtener productos para la página actual
    const getCurrentPageProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    };

    // Cambiar de página
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // Ir a página anterior
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Ir a página siguiente
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

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
                        <a href="#ofertas" className="nav-link">Ofertas</a>
                        <UserMenu/>
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
                    <p id='ofertas'></p>
                </div>
            </section>

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <section className="featured-section">
                    <div className="container">
                        <h3>⭐ Productos Destacados</h3>
                        <div className="featured-products-scroll">
                            {featuredProducts.map(product => (
                                <div key={product.id} className="product-card featured-card">
                                    <div className="featured-badge">Destacado</div>
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
            )}

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
                    <h3>Todos los Productos</h3>

                    {/* Información de paginación */}
                    <div className="pagination-info">
                        <p>
                            Mostrando {getCurrentPageProducts().length} de {filteredProducts.length} productos
                            (Página {currentPage} de {totalPages})
                        </p>
                    </div>

                    {/* El Grid y las Cards de los productos, aun funciona con la barra */}
                    <ProductGrid getCurrentPageProducts={getCurrentPageProducts} addToCart={addToCart}/>

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                            >
                                ← Anterior
                            </button>

                            <div className="page-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="pagination-btn"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
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
                            <h4>PowerShop</h4>
                            <p>El poder del sol en la palma de tu mano.</p>
                        </div>
                        <div className="footer-section">
                            <h4>Enlaces</h4>
                            <a href="#">Sobre Nosotros</a>
                            <a href="#">Términos y Condiciones</a>
                            <a href="#">Política de Privacidad</a>
                        </div>
                        <div className="footer-section">
                            <h4>Contacto</h4>
                            <p>Email: info@powershop.com</p>
                            <p>Tel: +51 123 456 789</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 PowerShop. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;