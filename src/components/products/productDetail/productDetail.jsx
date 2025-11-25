import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart.js';
import products from "../productList/productList.jsx";

function ProductDetail() {
    // Función para el carrito
    const { addToCart } = useCart();

    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    const product = products.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (!product) {
            navigate('/');
        }
    }, [product, navigate]);

    if (!product) {
        return null;
    }

    // Productos relacionados de la misma categoría
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 3000);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    // Simulación de imágenes múltiples (puedes expandir esto)
    const productImages = [product.image];

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="container">
                    <span onClick={() => navigate('/')} className="breadcrumb-link">Inicio</span>
                    <span className="breadcrumb-separator">›</span>
                    <span onClick={() => navigate('/')} className="breadcrumb-link">{product.category}</span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </div>
            </div>

            {/* Producto Principal */}
            <section className="product-main">
                <div className="container">
                    <div className="product-layout">
                        {/* Galería de Imágenes */}
                        <div className="product-gallery">
                            <div className="main-image">
                                <div className="image-container">
                                    {product.featured && <div className="featured-badge-detail">⭐ Destacado</div>}
                                    <div className="product-image-large">{productImages[selectedImage]}</div>
                                </div>
                            </div>
                            {productImages.length > 1 && (
                                <div className="thumbnail-images">
                                    {productImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            {img}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Información del Producto */}
                        <div className="product-info-detail">
                            <span className="product-category-badge">{product.category}</span>
                            <h1 className="product-title">{product.name}</h1>

                            {/* Rating (simulado) */}
                            <div className="product-rating">
                                <div className="stars">
                                    {'⭐'.repeat(5)}
                                </div>
                                <span className="rating-text">(4.8 / 5 - 127 reseñas)</span>
                            </div>

                            <div className="product-price-large">${product.price}</div>

                            {/* Descripción */}
                            <div className="product-description">
                                <h3>Descripción</h3>
                                <p>
                                    {product.description || `Descubre el increíble poder de ${product.name}. Este superpoder de categoría ${product.category} te permitirá alcanzar nuevas alturas y superar cualquier desafío. Perfectamente diseñado para maximizar tu potencial y llevar tus habilidades al siguiente nivel.`}
                                </p>
                            </div>

                            {/* Características */}
                            <div className="product-features">
                                <h3>Características</h3>
                                <ul>
                                    <li>✓ Activación instantánea</li>
                                    <li>✓ Compatible con otros poderes</li>
                                    <li>✓ Garantía de por vida</li>
                                    <li>✓ Sin efectos secundarios</li>
                                    <li>✓ Entrenamiento incluido</li>
                                </ul>
                            </div>

                            {/* Selector de Cantidad y Botón */}
                            <div className="purchase-section">
                                <div className="quantity-selector">
                                    <label>Cantidad:</label>
                                    <div className="quantity-controls">
                                        <button onClick={decrementQuantity} className="qty-btn">−</button>
                                        <span className="qty-value">{quantity}</span>
                                        <button onClick={incrementQuantity} className="qty-btn">+</button>
                                    </div>
                                </div>

                                <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                                    🛒 Agregar al Carrito
                                </button>

                                {showAddedMessage && (
                                    <div className="added-message">
                                        ✓ ¡Producto agregado al carrito!
                                    </div>
                                )}
                            </div>

                            {/* Información Adicional */}
                            <div className="additional-info">
                                <div className="info-item">
                                    <span className="info-icon">🚚</span>
                                    <div>
                                        <strong>Envío Gratis</strong>
                                        <p>En compras mayores a $500</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">🔒</span>
                                    <div>
                                        <strong>Compra Segura</strong>
                                        <p>Tus datos están protegidos</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">↩️</span>
                                    <div>
                                        <strong>30 Días Devolución</strong>
                                        <p>Sin preguntas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Productos Relacionados */}
            {relatedProducts.length > 0 && (
                <section className="related-products">
                    <div className="container">
                        <h2>Productos Relacionados</h2>
                        <div className="related-grid">
                            {relatedProducts.map(relatedProduct => (
                                <div
                                    key={relatedProduct.id}
                                    className="related-card"
                                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                                >
                                    {relatedProduct.featured && <div className="featured-badge">Destacado</div>}
                                    <div className="product-image">{relatedProduct.image}</div>
                                    <div className="product-info">
                                        <span className="product-category">{relatedProduct.category}</span>
                                        <h4>{relatedProduct.name}</h4>
                                        <p className="product-price">${relatedProduct.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Botón Volver */}
            <div className="back-button-container">
                <button className="mini-cta-btn" onClick={() => navigate('/')}>
                    ← Volver a la tienda
                </button>
            </div>
        </div>
    );
}

export default ProductDetail;