import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = login(form.email, form.password);
    if (success) navigate("/");
    else setError("Correo o contraseña incorrectos. Regístrate si no tienes cuenta.");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-card">
          <div className="logo-section">
            <h1 className="login-title">Yu-Gi-Oh Store</h1>
            <p className="login-subtitle">Inicia sesión para comenzar tu duelo</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn">
              Entrar al duelo
            </button>
          </form>

          <p className="login-footer">
            ¿No tienes cuenta?{" "}
            <span onClick={() => navigate("/registro")} className="link">
              Regístrate
            </span>
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="overlay"></div>
        <div className="right-content">
          <img src="/logo-p.png" alt="Yu-Gi-Oh!" className="yugioh-logo" />
          <h3 className="tagline">"Libera el poder de tus cartas."</h3>
          <p className="copyright">© 2025 Yu-Gi-Oh Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}