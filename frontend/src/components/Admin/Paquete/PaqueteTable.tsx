import React from 'react';
import type { Paquete }
from '../../../db/yugioh';

interface PaqueteTableProps {
  paquetes: Paquete[];
  onEdit: (paquete: Paquete) => void;
  onDelete: (id: number | string) => void;
}

const PaqueteTable: React.FC<PaqueteTableProps> = ({ paquetes = [], onEdit, onDelete }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid black' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>Imagen</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Nombre del Paquete</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Nº de Cartas</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Precio</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {paquetes.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ padding: '16px', textAlign: 'center' }}>
              No hay paquetes registrados.
            </td>
          </tr>
        ) : (
          paquetes.map((paquete) => (
            <tr key={paquete.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>
                <img 
                  src={paquete.image} 
                  alt={paquete.name} 
                  style={{ width: '40px', height: 'auto', verticalAlign: 'middle' }} 
                />
              </td>
              <td style={{ padding: '8px' }}>{paquete.name}</td>
              <td style={{ padding: '8px' }}>{paquete.cards.length}</td>
              <td style={{ padding: '8px' }}>${paquete.price}</td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => onEdit(paquete)}>Editar</button>
                <button 
                  onClick={() => onDelete(paquete.id)} 
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

export default PaqueteTable;