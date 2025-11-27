import UserMenu from '@components/layout/header/userMenu.jsx';

export default function PageHeader({searchTerm, setSearchTerm, setIsCartOpen, getTotalItems}) {
    return (
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
    )
}