import ProductCard from "./productCard";

export default function ProductGrid({getCurrentPageProducts,addToCart}) {
    const products = getCurrentPageProducts()
    return (
    <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart}/>
      ))}
    </div>)
}