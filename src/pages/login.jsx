import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Usar el endpoint de login que valida con bcrypt
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      const usuario = await response.json();


      // Guardar usuario en localStorage
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      
      // Redirigir según el tipo de usuario
      if (usuario.esAdmin) {
        console.log("login:es admin")
        navigate('/admin');
      } else {
        console.log("login:NO es admin")
        navigate('/home');
      }

    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🎮</div>
          <h1>Login Neon</h1>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <button
            className="forgot-btn"
            onClick={() => navigate('/recuperar-contraseña')}
            disabled={loading}
          >
            ¿Olvidaste tu contraseña?
          </button>
          <p>
            ¿No tienes cuenta?{' '}
            <button
              className="register-link"
              onClick={() => navigate('/registro')}
              disabled={loading}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>

      <div className="login-background">
        <div className="bg-element">✨</div>
        <div className="bg-element">💫</div>
        <div className="bg-element">⚡</div>
      </div>
    </div>
  );
}