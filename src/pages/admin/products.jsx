import { useState, useEffect } from "react";
import { usePagination } from "../../hooks/usePagination";

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkData, setBulkData] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoriaId: "",
    destacado: false
  });

  // Categorías por defecto
  const defaultCategories = [
    { id: 1, nombre: "Electrónica" },
    { id: 2, nombre: "Ropa" },
    { id: 3, nombre: "Hogar" }
  ];

  const filteredProducts = products.filter(p =>
    p.id.toString().includes(q.toLowerCase()) ||
    (p.nombre && p.nombre.toLowerCase().includes(q.toLowerCase())) ||
    (p.Categorium?.nombre && p.Categorium.nombre.toLowerCase().includes(q.toLowerCase()))
  );

  const { data, page, pages, setPage, total } = usePagination(filteredProducts, 10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        alert("Producto eliminado correctamente");
        fetchProducts();
      } else {
        alert("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar producto");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio || !formData.categoriaId) {
      alert("Por favor completa los campos requeridos: nombre, precio y categoría");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio),
          categoriaId: parseInt(formData.categoriaId)
        })
      });

      if (response.ok) {
        alert("Producto creado correctamente");
        setShowCreateModal(false);
        setFormData({
          nombre: "",
          descripcion: "",
          precio: "",
          imagen: "",
          categoriaId: "",
          destacado: false
        });
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear producto");
    }
  };

  const handleBulkCreate = async () => {
    try {
      const lines = bulkData.trim().split('\n');
      let created = 0;
      let errors = 0;

      for (const line of lines) {
        if (!line.trim()) continue;

        const [nombre, descripcion, precio, imagen, categoriaId, destacado] = line.split('|').map(s => s.trim());

        if (!nombre || !precio || !categoriaId) {
          errors++;
          continue;
        }

        try {
          const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              nombre,
              descripcion: descripcion || null,
              precio: parseFloat(precio),
              imagen: imagen || null,
              categoriaId: parseInt(categoriaId),
              destacado: destacado === 'true' || destacado === '1'
            })
          });

          if (response.ok) {
            created++;
          } else {
            errors++;
          }
        } catch {
          errors++;
        }
      }

      alert(`Productos creados: ${created}\nErrores: ${errors}`);
      setShowBulkModal(false);
      setBulkData("");
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear productos en masa");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px" }}>Productos</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowBulkModal(true)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(90deg, #f59e0b, #d97706)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            📋 Carga Masiva
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(90deg, #22c55e, #06b6d4)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            ➕ Crear Producto
          </button>
        </div>
      </div>

      <input
        placeholder="Filtrar por ID / nombre / categoría"
        value={q}
        onChange={handleFilterChange}
        style={{
          marginBottom: "15px",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #888",
          minWidth: "260px",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
        }}
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Imagen</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Nombre</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Precio</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Categoría</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Destacado</th>
                <th style={{ borderBottom: "1px solid #555", padding: "8px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "12px", textAlign: "center" }}>
                    No hay productos
                  </td>
                </tr>
              )}

              {data.map((p) => (
                <tr key={p.id}>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                    ) : (
                      <div style={{ width: "50px", height: "50px", background: "#444", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>📦</div>
                    )}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {p.nombre}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    ${Number(p.precio).toFixed(2)}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {p.Categorium?.nombre || "Sin categoría"}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    {p.destacado ? "⭐ Sí" : "No"}
                  </td>
                  <td style={{ borderBottom: "1px solid #333", padding: "8px" }}>
                    <button
                      onClick={() => handleViewProduct(p)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: "#3b82f6",
                        color: "#fff",
                        marginRight: "8px",
                        fontSize: "13px",
                      }}
                    >
                      👁️ Ver
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                disabled={n === page}
                onClick={() => setPage(n)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: n === page ? "default" : "pointer",
                  background: n === page ? "#4b5563" : "#1f2937",
                  color: "#fff",
                  opacity: n === page ? 0.6 : 1,
                }}
              >
                {n}
              </button>
            ))}
            <span style={{ marginLeft: "auto" }}>Total: {total}</span>
          </div>
        </>
      )}

      {/* Modal Ver Producto */}
      {showViewModal && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowViewModal(false)}
        >
          <div
            style={{
              background: "#1f2937",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "500px",
              maxWidth: "600px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
              Detalles del Producto
            </h2>

            {selectedProduct.imagen && (
              <img 
                src={selectedProduct.imagen} 
                alt={selectedProduct.nombre}
                style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "8px", marginBottom: "20px" }}
              />
            )}

            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>ID:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>{selectedProduct.id}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Nombre:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>{selectedProduct.nombre}</p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Descripción:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>
                {selectedProduct.descripcion || "Sin descripción"}
              </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Precio:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>
                ${selectedProduct.precio ? Number(selectedProduct.precio).toFixed(2) : ""}
              </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Categoría:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>
                {selectedProduct.Categorium?.nombre || "Sin categoría"}
              </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#9ca3af" }}>Destacado:</strong>
              <p style={{ marginTop: "5px", fontSize: "16px" }}>
                {selectedProduct.destacado ? "⭐ Sí" : "No"}
              </p>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#4b5563",
                color: "#fff",
                width: "100%",
                fontSize: "14px",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Crear Producto */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: "#1f2937",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "500px",
              maxWidth: "600px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
              Crear Nuevo Producto
            </h2>

            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Nombre: *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Descripción:
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Precio: *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  URL Imagen:
                </label>
                <input
                  type="text"
                  name="imagen"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#9ca3af" }}>
                  Categoría: *
                </label>
                <select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #4b5563",
                    background: "#374151",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Selecciona una categoría</option>
                  {defaultCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleInputChange}
                    style={{ marginRight: "8px" }}
                  />
                  <span style={{ color: "#9ca3af" }}>⭐ Producto destacado</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(90deg, #22c55e, #06b6d4)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: "#4b5563",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Carga Masiva */}
      {showBulkModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowBulkModal(false)}
        >
          <div
            style={{
              background: "#1f2937",
              padding: "30px",
              borderRadius: "12px",
              minWidth: "600px",
              maxWidth: "800px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>
              📋 Carga Masiva de Productos
            </h2>
            <p style={{ marginBottom: "20px", color: "#9ca3af", fontSize: "14px" }}>
              Ingresa un producto por línea con el formato:<br/>
              <code style={{ background: "#374151", padding: "4px 8px", borderRadius: "4px", display: "inline-block", marginTop: "5px" }}>
                nombre | descripcion | precio | url_imagen | categoriaId | destacado
              </code>
            </p>

            <div style={{ marginBottom: "15px", padding: "10px", background: "#374151", borderRadius: "6px", fontSize: "13px" }}>
              <strong>Ejemplo:</strong><br/>
              <code>PlayStation 5 | Consola de última generación | 499.99 | https://example.com/ps5.jpg | 1 | true</code><br/>
              <code>Camiseta Básica | Algodón 100% | 19.99 | https://example.com/shirt.jpg | 2 | false</code><br/>
              <code>Lámpara LED | Iluminación moderna | 29.99 | https://example.com/lamp.jpg | 3 | false</code>
            </div>

            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              placeholder="Pega aquí los productos..."
              rows={10}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #4b5563",
                background: "#374151",
                color: "#fff",
                fontSize: "14px",
                fontFamily: "monospace",
                resize: "vertical"
              }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={handleBulkCreate}
                disabled={!bulkData.trim()}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: bulkData.trim() ? "pointer" : "not-allowed",
                  background: bulkData.trim() ? "linear-gradient(90deg, #f59e0b, #d97706)" : "#4b5563",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  opacity: bulkData.trim() ? 1 : 0.5
                }}
              >
                Crear Productos
              </button>
              <button
                onClick={() => setShowBulkModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: "#4b5563",
                  color: "#fff",
                  fontSize: "14px",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}