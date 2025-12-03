// src/pages/admin/ManageUsers.tsx
import { useState, useEffect } from "react";
import UsuarioTable from "../../components/Admin/Usuario/UsuarioTable";
import UsuarioForm from "../../components/Admin/Usuario/UsuarioForm";
import { PageTitle } from "../../components/PageTitle";
import type { Usuario, UsuarioFormData } from "../../db/yugioh";

const LOCAL_STORAGE_USERS = "users";

function ManageUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setUsuarios(parsed);
        } else {
          console.warn("⚠️ Datos inválidos en localStorage. Reiniciando...");
          localStorage.removeItem(LOCAL_STORAGE_USERS);
          setUsuarios([]);
        }
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar usuarios desde localStorage:", error);
      setUsuarios([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(usuarios));
    }
  }, [usuarios, isLoading]);

  // === Crear o actualizar usuario ===
  const handleFormSubmit = (formData: UsuarioFormData) => {
    if (usuarioEditar) {
      // --- Actualizar usuario existente ---
      const actualizados = usuarios.map((u) =>
        u.id === usuarioEditar.id ? { ...u, ...formData } : u
      );
      setUsuarios(actualizados);
    } else {
      // --- Crear nuevo usuario ---
      const { email, password } = formData;
      const username = email.split("@")[0];

      const nuevoUsuario: Usuario = {
        id: Date.now(),
        username,
        email,
        password,
        role: "cliente",
      };

      setUsuarios([...usuarios, nuevoUsuario]);
    }

    setIsFormVisible(false);
    setUsuarioEditar(null);
  };

  // === Editar usuario ===
  const handleEditClick = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    setIsFormVisible(true);
  };

  // === Eliminar usuario ===
  const handleDeleteClick = (idUsuario: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== idUsuario));
    }
  };

  // === Cancelar formulario ===
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setUsuarioEditar(null);
  };

  // === Mostrar formulario ===
  const handleShowCreateForm = () => {
    setUsuarioEditar(null);
    setIsFormVisible(true);
  };

  return (
    <div>
      <PageTitle title="Gestión de Usuarios" />
      <div style={{ padding: "2rem", height: "100%" }}>
        <button
          style={{
            marginBottom: "16px",
            marginRight: "8px",
            backgroundColor: "#E6C200",
            color: "black",
          }}
          onClick={() => window.history.back()}
        >
          Volver
        </button>

        <hr style={{ margin: "24px 0" }} />

        {!isFormVisible && (
          <button
            onClick={handleShowCreateForm}
            style={{ marginBottom: "16px" }}
          >
            + Agregar Nuevo Usuario
          </button>
        )}

        {isFormVisible && (
          <UsuarioForm
            initialData={usuarioEditar}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}

        <h3>Usuarios Existentes</h3>

        {isLoading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <UsuarioTable
            users={usuarios}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
