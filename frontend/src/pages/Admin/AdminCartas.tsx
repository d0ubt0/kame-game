import { useState, useEffect } from 'react';
import SingleTable from '../../components/Admin/Carta/CartaTable';
import SingleForm from '../../components/Admin/Carta/CartaForm';
import { PageTitle } from '../../components/PageTitle';
import type { Carta, CartaFormData } from '../../db/yugioh';

// URL base de tu API
const API_URL = 'http://localhost:3001/api/cards';

function ManageSingles() {
  const [singles, setSingles] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [singleToEdit, setSingleToEdit] = useState<Carta | null>(null);

  // 1. CARGAR CARTAS (GET)
  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSingles(data);
    } catch (error) {
      console.error("Error cargando cartas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // 2. GUARDAR (CREAR O EDITAR)
  const handleFormSubmit = async (formData: CartaFormData) => {
    try {
      if (singleToEdit) {
        // --- MODO EDICIÓN (PUT) ---
        const response = await fetch(`${API_URL}/${singleToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          alert('¡Carta actualizada!');
          fetchCards(); // Recargamos la lista
        }
      } else {
        // --- MODO CREACIÓN (POST) ---
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('¡Carta creada con éxito!');
          fetchCards(); // Recargamos la lista
        }
      }
      // Cerramos formulario
      setIsFormVisible(false);
      setSingleToEdit(null);
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Hubo un error al guardar la carta.");
    }
  };

  // 3. ELIMINAR (DELETE)
  const handleDelete = async (singleId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta? ¡Desaparecerá de todos los mazos!')) {
      try {
        const response = await fetch(`${API_URL}/${singleId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Actualizamos la lista localmente para que se vea rápido
          setSingles(singles.filter((s) => s.id !== singleId));
        } else {
          alert("No se pudo eliminar la carta.");
        }
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  };

  // === UI Helpers ===
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSingleToEdit(null);
  };

  const showCreateForm = () => {
    setSingleToEdit(null);
    setIsFormVisible(true);
  };

  const showEditForm = (card: Carta) => {
    setSingleToEdit(card);
    setIsFormVisible(true);
  };

  return (
    <div className='admin-cartas'>
      <PageTitle title="Gestión de Cartas (Admin)" />

      <div style={{ padding: '2rem', height: '100%' }}>
        <button 
          style={{ marginBottom: '16px', marginRight: '8px', backgroundColor: '#E6C200', color: 'black', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' }} 
          onClick={() => window.history.back()}
        >
            Volver
        </button>

        <hr style={{ margin: '24px 0' }} />
        
        {!isFormVisible && (
          <button 
            onClick={showCreateForm} 
            style={{ marginBottom: '16px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            + Agregar Nueva Carta
          </button>
        )}

        {isFormVisible ? (
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', color: 'white' }}>
            <SingleForm
              initialData={singleToEdit}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <>
            <h3>Cartas en Base de Datos</h3>
            {isLoading ? (
              <p>Cargando datos...</p>
            ) : (
              <SingleTable 
                singles={singles} 
                onEdit={showEditForm} 
                onDelete={handleDelete} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManageSingles;