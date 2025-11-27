import { useState, useEffect } from 'react';
import { useCart } from '@hooks/useCart.js';
import CartDrawer from "@components/cart/cartDrawer/cartDrawer.jsx";
import ProductGrid from '@components/products/productGrid.jsx';
import PageHeader from '../components/layout/header/header';

function Home() {
    // Estado del carrito
    const { cartItems, addToCart, updateQuantity, removeItem } = useCart();

    // Estados de la UI
    const [searchTerm, setSearchTerm] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Estados para productos y categorías desde la API
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['Todos']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar productos desde la API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/products');
                
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                
                const data = await response.json();
                
                // Transformar los datos de la API al formato esperado
                const transformedProducts = data.map(producto => ({
                    id: producto.id,
                    name: producto.nombre,
                    price: producto.precio,
                    category: producto.Categorium?.nombre || 'Sin categoría',
                    image: producto.imagen || '📦',
                    featured: producto.destacado || false,
                    description: producto.descripcion || ''
                }));
                
                setProducts(transformedProducts);
                
                // Extraer categorías únicas
                const uniqueCategories = ['Todos', ...new Set(transformedProducts.map(p => p.category))];
                setCategories(uniqueCategories);
                
                setError(null);
            } catch (err) {
                console.error('Error al cargar productos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="app">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Cargando productos...</h2>
                    <p>⏳ Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    // Mostrar error si ocurre
    if (error) {
        return (
            <div className="app">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>❌ Error al cargar productos</h2>
                    <p>{error}</p>
                    <button 
                        className="cta-btn" 
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px' }}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            {/* Header */}
            <PageHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsCartOpen={setIsCartOpen} getTotalItems={getTotalItems} />

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
                            {totalPages > 0 && ` (Página ${currentPage} de ${totalPages})`}
                        </p>
                    </div>

                    {/* Grid de productos */}
                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                        </div>
                    ) : (
                        <ProductGrid getCurrentPageProducts={getCurrentPageProducts} addToCart={addToCart}/>
                    )}

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