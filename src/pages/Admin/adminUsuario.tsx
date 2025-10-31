// src/pages/admin/ManageUsers.tsx
import { useState, useEffect } from 'react';
import UserTable from '../../components/Admin/Usuario/UsuarioTable';
import UserForm from '../../components/Admin/Usuario/UsuarioForm';
import { PageTitle } from '../../components/PageTitle';
// Importamos los tipos necesarios
import type { Usuario, UsuarioFormData } from '../../types/yugioh';

// --- DATOS DE EJEMPLO ---
const FAKE_API_USERS: Usuario[] = [
  { 
    id: 1, 
    username: 'admin_user', 
    email: 'admin@yugioh.com', 
    role: 'admin'
  },
  { 
    id: 2, 
    username: 'duelista_24', 
    email: 'user1@yugioh.com', 
    role: 'user'
  },
];
// -------------------------------------

function ManageUsers() {
  
  // === ESTADO (STATE) ===
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  // === EFECTOS (EFFECTS) ===
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(FAKE_API_USERS);
      setIsLoading(false);
    }, 1000); // Simula carga
  }, []);

  // === MANEJADORES DE LÓGICA (Funciones) ===

  const handleFormSubmit = (formData: UsuarioFormData) => {
    if (userToEdit) {
      // --- Lógica de Actualizar (UPDATE) ---
      // formData no incluye 'password' aquí (gracias a la lógica del form)
      console.log('Actualizando usuario:', userToEdit.id, formData);
      setUsers(users.map(u => 
        u.id === userToEdit.id ? { ...u, ...formData } : u
      ));
    } else {
      // --- Lógica de Crear (CREATE) ---
      // formData SÍ incluye 'password' aquí
      console.log('Creando nuevo usuario:', formData);
      
      // En una app real:
      // 1. Enviarías formData al backend.
      // 2. El backend SÍ guardaría la contraseña (hasheada).
      // 3. El backend te devolvería el OBJETO 'User' (sin la contraseña)
      
      // Simulación:
      const { password, ...rest } = formData; // Quitamos el password
      const newUser: Usuario = { 
        ...rest, 
        id: Date.now() // ID falso
      };
      setUsers([...users, newUser]);
    }
    setIsFormVisible(false);
    setUserToEdit(null);
  };

  const handleEditClick = (user: Usuario) => {
    setUserToEdit(user);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (userId: number | string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      console.log('Eliminando usuario:', userId);
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setUserToEdit(null);
  };

  const showCreateForm = () => {
    setUserToEdit(null);
    setIsFormVisible(true);
  };

  // === RENDERIZADO ===
  return (
    <div>
      <PageTitle title="Gestión de Usuarios" />
      <div style={{ padding: '2rem', height: '100%' }}>
        {!isFormVisible && (
          <button onClick={showCreateForm} style={{ marginBottom: '16px' }}>
            + Agregar Nuevo Usuario
          </button>
        )}

        {isFormVisible && (
          <UserForm 
            initialData={userToEdit} 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}
        
        <hr style={{ margin: '24px 0' }} />

        <h3>Usuarios Existentes</h3>
        
        {isLoading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <UserTable 
            users={users} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
        )}
      </div>
    </div>
  );
}

export default ManageUsers;