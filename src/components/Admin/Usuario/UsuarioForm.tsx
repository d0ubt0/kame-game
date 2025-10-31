// src/components/Admin/User/UserForm.tsx
import React, { useState, useEffect } from 'react';
// Asumo que 'User' y 'UserFormData' están definidos en tus tipos
import type { Usuario, UsuarioFormData } from '../../../types/yugioh';

// Props que espera el formulario
interface UserFormProps {
  initialData: Usuario | null;
  onSubmit: (formData: UsuarioFormData) => void;
  onCancel?: () => void;
}

// Estado inicial del formulario
const defaultFormState: UsuarioFormData = {
  username: '',
  email: '',
  password: '', // La contraseña solo se usa al crear
  role: 'user'  // Rol por defecto
};

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {

  const [formData, setFormData] = useState<UsuarioFormData>(defaultFormState);
  const isEditing = Boolean(initialData);
  const title = isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario';

  useEffect(() => {
    if (isEditing && initialData) {
      // Al editar, cargamos los datos PERO OMITIMOS la contraseña
      setFormData({
        username: initialData.username,
        email: initialData.email,
        role: initialData.role,
        password: '' // El campo de contraseña permanece vacío
      });
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData, isEditing]);

  // Manejador de cambios genérico
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isEditing) {
      // Si estamos editando, no queremos enviar la contraseña
      // (incluso si el usuario escribió algo por error)
      const { password, ...updateData } = formData;
      onSubmit(updateData);
    } else {
      // Si estamos creando, enviamos todo el formulario
      onSubmit(formData);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
      <h3 style={{ fontSize: '2rem', color: '#E6C200'}}>{title}</h3>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="username">Nombre de Usuario:</label><br />
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required style={{ width: '300px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="email">Email:</label><br />
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '300px' }} />
        </div>

        {/* --- CAMPO DE CONTRASEÑA (SOLO AL CREAR) --- */}
        {!isEditing && (
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="password">Contraseña:</label><br />
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required={!isEditing} // Requerido solo al crear
              style={{ width: '300px' }} 
            />
          </div>
        )}

        {/* --- CAMPO DE ROL --- */}
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="role">Rol de Usuario:</label><br />
          <select 
            id="role" 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            style={{ width: '300px' }}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botones */}
        <div style={{ marginTop: '20px' }}>
          <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UserForm;