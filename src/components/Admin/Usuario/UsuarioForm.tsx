// src/components/Admin/Usuario/UsuarioForm.tsx
import React, { useState, useEffect } from "react";
import type { Usuario, UsuarioFormData } from "../../../types/yugioh";

interface UsuarioFormProps {
  initialData: Usuario | null;
  onSubmit: (formData: UsuarioFormData) => void;
  onCancel?: () => void;
}

const defaultFormState: UsuarioFormData = {
  username: "",
  email: "",
  password: "",
  role: "cliente",
};

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UsuarioFormData>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(initialData);
  const title = isEditing ? "Editar Usuario" : "Crear Nuevo Usuario";

  // === Cargar datos iniciales ===
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        username: initialData.username,
        email: initialData.email,
        role: initialData.role,
        password: "",
      });
    } else {
      setFormData(defaultFormState);
    }
    setError(null);
  }, [initialData, isEditing]);

  // === Manejar cambios en los inputs ===
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // === Enviar formulario ===
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Si se crea o se edita a otro usuario con el mismo correo
    const emailExists = existingUsers.some(
      (u: Usuario) =>
        u.email === formData.email &&
        (!isEditing || u.id !== initialData?.id)
    );

    if (emailExists) {
      setError("⚠️ Ya existe un usuario registrado con este correo.");
      return;
    }

    const payload: UsuarioFormData = {
      ...formData,
      username: formData.email.split("@")[0], // generado automáticamente
    };

    if (isEditing && !formData.password) {
      const { password, ...rest } = payload;
      onSubmit(rest);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        marginTop: "16px",
      }}
    >
      <h3 style={{ fontSize: "2rem", color: "#E6C200" }}>{title}</h3>

      <form onSubmit={handleSubmit}>
        {/* Campo de correo */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="email">Correo electrónico:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "300px" }}
          />
        </div>

        {/* Campo de contraseña (solo al crear) */}
        {!isEditing && (
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="password">Contraseña:</label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "300px" }}
            />
          </div>
        )}

        {/* Campo de rol */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="role">Rol:</label>
          <br />
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "300px" }}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Mostrar error si el correo ya existe */}
        {error && (
          <p style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        {/* Botones */}
        <div style={{ marginTop: "20px" }}>
          <button type="submit">
            {isEditing ? "Actualizar" : "Guardar"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{ marginLeft: "8px" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
