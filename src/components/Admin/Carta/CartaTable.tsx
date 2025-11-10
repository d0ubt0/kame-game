import React from 'react';
import type { Carta } from '../../../db/yugioh'; 

interface SingleTableProps {
  singles: Carta[];
  onEdit: (single: Carta) => void;
  onDelete: (id: number) => void;
}

const SingleTable: React.FC<SingleTableProps> = ({ singles = [], onEdit, onDelete }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid black' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>Imagen</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Nombre</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>ATK</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>DEF</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Precio</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {singles.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '16px', textAlign: 'center' }}>
              No hay cartas registradas.
            </td>
          </tr>
        ) : (
          singles.map((single) => (
            <tr key={single.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>
                <img 
                  src={single.image} 
                  alt={single.name} 
                  style={{ width: '40px', height: 'auto', verticalAlign: 'middle' }} 
                />
              </td>
              <td style={{ padding: '8px' }}>{single.name}</td>
              <td style={{ padding: '8px' }}>{single.attack}</td>
              <td style={{ padding: '8px' }}>{single.defense}</td>
              <td style={{ padding: '8px' }}>${single.price}</td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => onEdit(single)}>Editar</button>
                <button 
                  onClick={() => onDelete(single.id)} 
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

export default SingleTable;