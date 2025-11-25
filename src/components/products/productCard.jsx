import { useNavigate } from "react-router-dom"


export default function ProductCard({product, addToCart}) {
    const navigate = useNavigate()
    return (<div className="product-card">
        {product.featured && <div className="featured-badge">Destacado</div>}
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
            <button
                className="mini-cta-btn"
                onClick={() => navigate( `product/${product.id}` )}
            >
                Ver informacion
            </button>
        </div>
    </div>)
}