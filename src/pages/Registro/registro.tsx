import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./registro.css";

export default function Registro() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const ok = register(form.email, form.password);
    if (ok) {
      setSuccess("Usuario registrado con éxito. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError("El correo ya está registrado.");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-left">
        <div className="registro-card">
          <div className="logo-section">
            <h1 className="registro-title">Únete a Duel Shop</h1>
            <p className="registro-subtitle">Crea tu cuenta y comienza tu aventura</p>
          </div>

          <form onSubmit={handleSubmit} className="registro-form">
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

            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <button type="submit" className="registro-btn">
              Registrarme
            </button>
          </form>

          <p className="registro-footer">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Inicia sesión
            </span>
          </p>
        </div>
      </div>

      <div className="registro-right">
        <div className="overlay"></div>
        <div className="right-content">
          <img src="/yugioh-logo.png" alt="Yu-Gi-Oh!" className="yugioh-logo" />
          <h3 className="tagline">"Tu viaje como duelista comienza aquí."</h3>
          <p className="copyright">© 2025 Duel Shop. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}