// src/pages/admin/ManageSingles.tsx
import  { useState, useEffect } from 'react';
import SingleTable from '../../components/Admin/Carta/CartaTable';
import SingleForm from '../../components/Admin/Carta/CartaForm';
import { PageTitle } from '../../components/PageTitle';
// Importamos los tipos
// Importamos los tipos
import type { Carta, CartaFormData } from '../../types/yugioh';

// --- DATOS DE EJEMPLO (Actualizados) ---

const FAKE_API_DATA: Carta[] = [
  { 
    id: 101, 
    name: 'Blue-Eyes White Dragon', 
    image: 'https://tse2.mm.bing.net/th/id/OIP.abaj7EF12lTTHqQY73454gHaK_?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3', 
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
];
// -------------------------------------

function ManageSingles() {
  
  // === ESTADO (STATE) ===
  const [singles, setSingles] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [singleToEdit, setSingleToEdit] = useState<Carta | null>(null);

  // === EFECTOS (EFFECTS) ===
  // Simula la carga de datos de la API al montar el componente
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSingles(FAKE_API_DATA);
      setIsLoading(false);
    }, 1000); // Simula 1 segundo de carga
  }, []);

  // === MANEJADORES DE LÓGICA (Funciones) ===
  
  const handleFormSubmit = (formData: CartaFormData) => {
    if (singleToEdit) {
      // --- Lógica de Actualizar (UPDATE) ---
      console.log('Actualizando carta:', singleToEdit.id, formData);
      setSingles(singles.map(s => 
        s.id === singleToEdit.id ? { id: singleToEdit.id, ...formData } : s
      ));
    } else {
      // --- Lógica de Crear (CREATE) ---
      console.log('Creando nueva carta:', formData);
      const newSingle: Carta = { ...formData, id: Date.now() }; // ID falso
      setSingles([...singles, newSingle]);
    }
    setIsFormVisible(false);
    setSingleToEdit(null);
  };

  const handleEditClick = (single: Carta) => {
    setSingleToEdit(single);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (singleId: number) => {
    // Confirmación en español
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      console.log('Eliminando carta:', singleId);
      setSingles(singles.filter(s => s.id !== singleId));
    }
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSingleToEdit(null);
  };

  const showCreateForm = () => {
    setSingleToEdit(null);
    setIsFormVisible(true);
  };

  // === RENDERIZADO ===
  return (
    <div >
      {/* Títulos en español */}
      <PageTitle title="Gestión de Cartas" />
      <div style={{ padding: '2rem',  height: '100%' }}>
        {!isFormVisible && (
          <button onClick={showCreateForm} style={{ marginBottom: '16px' }}>
            + Agregar Nueva Carta
          </button>
        )}

        {isFormVisible && (
          <SingleForm 
            initialData={singleToEdit} 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}
        
        <hr style={{ margin: '24px 0' }} />

        <h3>Cartas Existentes</h3>
        
        {isLoading ? (
          <p>Cargando cartas...</p> // Texto de carga en español
        ) : (
          <SingleTable 
            singles={singles} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
        )}
      </div>
    </div>
  );
}

export default ManageSingles;