import React from "react";
import type { Usuario } from "../../../db/yugioh";

interface UsuarioTableProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (id: number) => void;
}

const UsuarioTable: React.FC<UsuarioTableProps> = ({
  users = [],
  onEdit,
  onDelete,
}) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid black" }}>
          <th style={{ padding: "8px", textAlign: "left" }}>Nombre de Usuario</th>
          <th style={{ padding: "8px", textAlign: "left" }}>Email</th>
          <th style={{ padding: "8px", textAlign: "left" }}>Rol</th>
          <th style={{ padding: "8px", textAlign: "left" }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ padding: "16px", textAlign: "center" }}>
              No hay usuarios registrados.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "8px" }}>{user.username}</td>
              <td style={{ padding: "8px" }}>{user.email}</td>
              <td style={{ padding: "8px" }}>
                <span
                  style={{
                    background: user.role === "admin" ? "#E6C200" : "#eee",
                    color: user.role === "admin" ? "black" : "#333",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {user.role}
                </span>
              </td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => onEdit(user)}>Editar</button>
                <button
                  onClick={() => onDelete(user.id)}
                  style={{ marginLeft: "8px", backgroundColor: "tomato" }}
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
};

export default UsuarioTable;
