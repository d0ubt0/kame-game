import { useState, useEffect } from 'react';
import PaqueteTable from '../../components/Admin/Paquete/PaqueteTable';
import PaqueteForm from '../../components/Admin/Paquete/PaqueteForm';
import { PageTitle } from '../../components/PageTitle';
import type { Carta, Paquete, PaqueteFormData } from '../../db/yugioh';

// Endpoints
const API_PACKS = 'http://localhost:3001/api/packs';
const API_CARDS = 'http://localhost:3001/api/cards';

function ManagePaquetes() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [allCartas, setAllCartas] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [paqueteToEdit, setPaqueteToEdit] = useState<Paquete | null>(null);

  // 1. CARGAR DATOS (Paquetes y Cartas)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Hacemos las dos peticiones en paralelo
      const [packsRes, cardsRes] = await Promise.all([
        fetch(API_PACKS, { headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: "include"}),
        fetch(API_CARDS, { headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },credentials: "include"})
      ]);

      if (packsRes.ok && cardsRes.ok) {
        const packsData = await packsRes.json();
        const cardsData = await cardsRes.json();
        
        setPaquetes(packsData);
        setAllCartas(cardsData);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. GUARDAR (CREAR O EDITAR)
  const handleFormSubmit = async (formData: PaqueteFormData) => {
    try {
      // Convertimos el array de strings ["1", "2"] que manda el formulario
      // a lo que espera el backend (aunque el backend ya hace un casteo,
      // es bueno asegurarse de enviar la estructura correcta).
      const payload = {
        name: formData.name,
        image: formData.image,
        price: formData.price,
        cards: formData.cards // Array de IDs
      };

      if (paqueteToEdit) {
        // --- EDITAR (PUT) ---
        const response = await fetch(`${API_PACKS}/${paqueteToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json',"Authorization": "Bearer " + localStorage.getItem("token")?.toString()}, 
          body: JSON.stringify(payload),
          credentials: "include"
        });

        if (response.ok) {
          alert("Paquete actualizado correctamente");
          fetchData();
        }
      } else {
        // --- CREAR (POST) ---
        const response = await fetch(API_PACKS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' , "Authorization": "Bearer " + localStorage.getItem("token")?.toString() },
          body: JSON.stringify(payload),
          credentials: "include"
        });

        if (response.ok) {
          alert("Paquete creado correctamente");
          fetchData();
        }
      }

      setIsFormVisible(false);
      setPaqueteToEdit(null);

    } catch (error) {
      console.error("Error guardando paquete:", error);
      alert("Error al guardar.");
    }
  };

  // 3. ELIMINAR (DELETE)
  const handleDelete = async (paqueteId: number | string) => {
    if (window.confirm('¿Estás seguro de eliminar este paquete?')) {
      try {
        const response = await fetch(`${API_PACKS}/${paqueteId}`, {
          method: 'DELETE',
          headers: {"Authorization": "Bearer " + localStorage.getItem("token")?.toString() },
          credentials: "include"
        });

        if (response.ok) {
          // Filtramos localmente para actualizar rápido
          setPaquetes(prev => prev.filter((p) => p.id !== Number(paqueteId)));
        } else {
          alert("No se pudo eliminar el paquete.");
        }
      } catch (error) {
        console.error("Error eliminando:", error);
      }
    }
  };

  // === UI Helpers ===
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setPaqueteToEdit(null);
  };

  const showCreateForm = () => {
    setPaqueteToEdit(null);
    setIsFormVisible(true);
  };

  const handleEditPaquete = (pack: Paquete) => {
    // Necesitamos pasar el objeto completo al formulario para que
    // pueda pre-llenar las cartas seleccionadas
    setPaqueteToEdit(pack);
    setIsFormVisible(true);
  };

  return (
    <div>
      <PageTitle title="Gestión de Paquetes (Base de Datos)" />
      
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
            + Agregar Nuevo Paquete
          </button>
        )}

        {isFormVisible ? (
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', color: 'white' }}>
            <PaqueteForm
              initialData={paqueteToEdit}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              allCartas={allCartas} // Pasamos las cartas reales de la DB
            />
          </div>
        ) : (
          <>
            <h3>Paquetes Existentes</h3>
            {isLoading ? (
              <p>Cargando paquetes...</p>
            ) : (
              <PaqueteTable 
                paquetes={paquetes} 
                onEdit={handleEditPaquete} 
                onDelete={handleDelete} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ManagePaquetes;