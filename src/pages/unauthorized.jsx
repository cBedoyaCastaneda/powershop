export default function Unauthorized() {
  return (
    <div className="app">

      <div style={{ textAlign: "center" }}>
          <h1>401</h1>
          <h2>Página no autorizada</h2>
          <a href="/admin" className="">Volver al inicio</a>

        <h3>
            No pudimos encontrar lo que buscabas
        </h3>
      </div>

    </div>
  );
}
