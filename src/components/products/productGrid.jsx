import ProductCard from "./productCard";

export default function ProductGrid({getCurrentPageProducts}) {
    const products = getCurrentPageProducts()
    console.log(products)
    return (
    <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p}/>
      ))}
    </div>)
}