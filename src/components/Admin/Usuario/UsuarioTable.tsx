// src/components/Admin/User/UserTable.tsx
import React from 'react';
// Asumo que tu tipo 'User' está en /types/yugioh.ts (o donde lo definas)
import type { Usuario } from '../../../types/yugioh'; 

// Props que espera la tabla
interface UserTableProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (id: number | string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users = [], onEdit, onDelete }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid black' }}>
          {/* Cabeceras de la tabla en español */}
          <th style={{ padding: '8px', textAlign: 'left' }}>Nombre de Usuario</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Rol</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ padding: '16px', textAlign: 'center' }}>
              No hay usuarios registrados.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>{user.username}</td>
              <td style={{ padding: '8px' }}>{user.email}</td>
              <td style={{ padding: '8px' }}>
                {/* Estilo condicional para el rol */}
                <span style={{ 
                  background: user.role === 'admin' ? '#E6C200' : '#eee',
                  color: user.role === 'admin' ? 'black' : '#333',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '8px' }}>
                {/* Botones de acción en español */}
                <button onClick={() => onEdit(user)}>Editar Rol</button>
                <button 
                  onClick={() => onDelete(user.id)} 
                  style={{ marginLeft: '8px', backgroundColor: 'tomato' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default UserTable;