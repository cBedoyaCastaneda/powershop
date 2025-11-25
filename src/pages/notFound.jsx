import { AlignCenter } from "lucide-react";

export default function NotFound() {
  return (
    <div className="app">

      <section className="hero">
        <div className="hero-content">
          <h2>404</h2>
          <p>Página no encontrada</p>
          <a href="/" className="cta-btn">Volver al inicio</a>
        </div>
      </section>

      <div className="">
        <section className="categories-section">
            <h3 style={{ textAlign: "center" }}>
                No pudimos encontrar lo que buscabas
            </h3>
        </section>
      </div>

    </div>
  );
}
