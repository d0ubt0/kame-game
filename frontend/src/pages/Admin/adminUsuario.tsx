import { useState, useEffect } from "react";
import UsuarioTable from "../../components/Admin/Usuario/UsuarioTable";
import UsuarioForm from "../../components/Admin/Usuario/UsuarioForm";
import { PageTitle } from "../../components/PageTitle";
import type { Usuario, UsuarioFormData } from "../../db/yugioh";

// URL de tu Backend
const API_URL = "http://localhost:3001/api/users";

function ManageUsers() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

  // 1. CARGAR USUARIOS (GET)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error conectando con el servidor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. GUARDAR (CREAR O EDITAR)
  const handleFormSubmit = async (formData: UsuarioFormData) => {
    try {
      if (usuarioEditar) {
        // --- EDITAR (PUT) ---
        const response = await fetch(`${API_URL}/${usuarioEditar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Usuario actualizado correctamente");
          fetchUsers();
        } else {
          alert("Error al actualizar (quizás el email ya existe)");
        }

      } else {
        // --- CREAR (POST) ---
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Usuario creado correctamente");
          fetchUsers();
        } else {
          alert("Error al crear usuario. Verifica los datos.");
        }
      }
      
      setIsFormVisible(false);
      setUsuarioEditar(null);

    } catch (error) {
      console.error("Error enviando formulario:", error);
    }
  };

  // 3. ELIMINAR (DELETE)
  const handleDelete = async (userId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario? Se perderá toda su colección.")) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsuarios(prev => prev.filter(u => u.id !== userId));
        } else {
          alert("No se pudo eliminar el usuario.");
        }
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  };

  // === UI Helpers ===
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setUsuarioEditar(null);
  };

  const handleShowCreateForm = () => {
    setUsuarioEditar(null);
    setIsFormVisible(true);
  };

  const handleEditUser = (user: Usuario) => {
    setUsuarioEditar(user);
    setIsFormVisible(true);
  };

  return (
    <div>
      <PageTitle title="Gestión de Usuarios (Base de Datos)" />
      
      <div style={{ padding: "2rem", height: "100%" }}>
        <button
          style={{
            marginBottom: "16px",
            marginRight: "8px",
            backgroundColor: "#E6C200",
            color: "black",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "4px"
          }}
          onClick={() => window.history.back()}
        >
          Volver
        </button>

        <hr style={{ margin: "24px 0" }} />

        {!isFormVisible && (
          <button
            onClick={handleShowCreateForm}
            style={{ 
              marginBottom: "16px",
              padding: "10px 20px", 
              backgroundColor: "#4CAF50", 
              color: "white", 
              border: "none", 
              cursor: "pointer", 
              borderRadius: "4px"
            }}
          >
            + Agregar Nuevo Usuario
          </button>
        )}

        {isFormVisible ? (
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', color: 'white' }}>
            <UsuarioForm
              initialData={usuarioEditar}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <>
            <h3>Lista de Usuarios</h3>
            {isLoading ? (
              <p>Cargando usuarios desde Neon DB...</p>
            ) : (
            
              <UsuarioTable
                users={usuarios}  
                onEdit={handleEditUser}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;