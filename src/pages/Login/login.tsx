import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 👈 importamos el contexto
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 obtenemos la función login del contexto

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // 🚀 Aquí podrías validar usuario/contraseña contra un backend o JSON server
    if (form.email && form.password) {
      login(); // ✅ activa el estado de autenticación global
      navigate("/"); // 🔁 redirige al inicio (puedes cambiarlo a /Arena, /Coleccion, etc.)
    } else {
      alert("Por favor ingresa tus credenciales");
    }
};

return (
    <div className="login-container">
        <div className="login-card">
        <h2 className="login-title">Inicio de Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
