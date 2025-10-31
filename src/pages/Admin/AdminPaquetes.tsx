// src/pages/admin/ManagePaquetes.tsx
import { useState, useEffect } from 'react';
import PaqueteTable from '../../components/Admin/Paquete/PaqueteTable';
import PaqueteForm from '../../components/Admin/Paquete/PaqueteForm';
import { PageTitle } from '../../components/PageTitle';
// Importamos todos los tipos que necesitamos
import type { Carta, Paquete, PaqueteFormData } from '../../types/yugioh';

// --- DATOS DE EJEMPLO (CARTAS) ---
// (Necesitamos esto para pasarlo al formulario)
const FAKE_API_CARTAS: Carta[] = [
  { 
    id: 101, 
    name: 'Blue-Eyes White Dragon', 
    image: 'https://th.bing.com/th/id/OIP.abaj7EF12lTTHqQY73454gHaK_?w=128&h=190&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3', 
    description: 'This legendary dragon is a powerful engine of destruction...', 
    attack: 3000, 
    defense: 2500, 
    price: 150 
  },
  { 
    id: 102, 
    name: 'Dark Magician', 
    image: 'https://tse3.mm.bing.net/th/id/OIP.7YwniWnmWosV61hKmohUjAHaKy?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3', 
    description: 'The ultimate wizard in terms of attack and defense.', 
    attack: 2500, 
    defense: 2100, 
    price: 120 
  },
  {
    id: 103,
    name: 'Exodia the Forbidden One',
    image: 'https://tse3.mm.bing.net/th/id/OIP.aQHfvjkwZWafIcaE2Mg5VgHaK0?rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'The one who will bring destruction to the world.',
    attack: 1000,
    defense: 1000,
    price: 500
  }
];

// --- DATOS DE EJEMPLO (PAQUETES) ---
const FAKE_API_PAQUETES: Paquete[] = [
  {
    id: 1,
    name: 'Paquete de Inicio Clásico',
    image: 'https://tse3.mm.bing.net/th/id/OIP.HGvStPacQXIIZrnD8O-xOgHaMW?rs=1&pid=ImgDetMain&o=7&rm=3',
    price: 29.99,
    cards: ['101', '102'] // Array de IDs de las cartas
  }
];
// -------------------------------------

function ManagePaquetes() {
  
  // === ESTADO (STATE) ===
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [allCartas, setAllCartas] = useState<Carta[]>([]); // ¡NUEVO ESTADO!
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [paqueteToEdit, setPaqueteToEdit] = useState<Paquete | null>(null);

  // === EFECTOS (EFFECTS) ===
  // Simula la carga de datos (¡ahora carga cartas Y paquetes!)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPaquetes(FAKE_API_PAQUETES);
      setAllCartas(FAKE_API_CARTAS); // Carga todas las cartas disponibles
      setIsLoading(false);
    }, 1000); // Simula 1 segundo de carga
  }, []);

  // === MANEJADORES DE LÓGICA (Funciones) ===
  
  const handleFormSubmit = (formData: PaqueteFormData) => {
    if (paqueteToEdit) {
      // --- Lógica de Actualizar (UPDATE) ---
      console.log('Actualizando paquete:', paqueteToEdit.id, formData);
      setPaquetes(paquetes.map(p => 
        p.id === paqueteToEdit.id ? { id: paqueteToEdit.id, ...formData } : p
      ));
    } else {
      // --- Lógica de Crear (CREATE) ---
      console.log('Creando nuevo paquete:', formData);
      const newPaquete: Paquete = { ...formData, id: 2 }; // ID falso
      setPaquetes([...paquetes, newPaquete]);
    }
    setIsFormVisible(false);
    setPaqueteToEdit(null);
  };

  const handleEditClick = (paquete: Paquete) => {
    setPaqueteToEdit(paquete);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (paqueteId: number | string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
      console.log('Eliminando paquete:', paqueteId);
      setPaquetes(paquetes.filter(p => p.id !== paqueteId));
    }
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setPaqueteToEdit(null);
  };

  const showCreateForm = () => {
    setPaqueteToEdit(null);
    setIsFormVisible(true);
  };

  // === RENDERIZADO ===
  return (
    <div>
      <PageTitle title="Gestión de Paquetes" />
      <div style={{ padding: '2rem', height: '100%' }}>
        
        {!isFormVisible && (
          <button onClick={showCreateForm} style={{ marginBottom: '16px' }}>
            + Agregar Nuevo Paquete
          </button>
        )}

        {isFormVisible && (
          <PaqueteForm 
            initialData={paqueteToEdit} 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            // ¡AQUÍ ESTÁ LA MAGIA!
            // Pasamos la lista de todas las cartas al formulario
            allCartas={allCartas} 
          />
        )}
        
        <hr style={{ margin: '24px 0' }} />

        <h3>Paquetes Existentes</h3>
        
        {isLoading ? (
          <p>Cargando paquetes y cartas...</p>
        ) : (
          <PaqueteTable 
            paquetes={paquetes} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
        )}
      </div>
    </div>
  );
}

export default ManagePaquetes;