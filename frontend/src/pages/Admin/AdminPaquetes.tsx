import { useState, useEffect } from 'react';
import PaqueteTable from '../../components/Admin/Paquete/PaqueteTable';
import PaqueteForm from '../../components/Admin/Paquete/PaqueteForm';
import { PageTitle } from '../../components/PageTitle';
import type { Carta, Paquete, PaqueteFormData } from '../../db/yugioh';

const LOCAL_STORAGE_CARTAS = 'cartas';
const LOCAL_STORAGE_PAQUETES = 'paquetes';

function ManagePaquetes() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [allCartas, setAllCartas] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [paqueteToEdit, setPaqueteToEdit] = useState<Paquete | null>(null);

  useEffect(() => {
    try {
      const storedCartas = localStorage.getItem(LOCAL_STORAGE_CARTAS);
      const storedPaquetes = localStorage.getItem(LOCAL_STORAGE_PAQUETES);

      if (storedCartas) {
        const parsedCartas = JSON.parse(storedCartas);
        if (Array.isArray(parsedCartas)) setAllCartas(parsedCartas);
      }

      if (storedPaquetes) {
        const parsedPaquetes = JSON.parse(storedPaquetes);
        if (Array.isArray(parsedPaquetes)) setPaquetes(parsedPaquetes);
      }
    } catch (err) {
      console.error('❌ Error cargando datos de localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_PAQUETES, JSON.stringify(paquetes));
    }
  }, [paquetes, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_CARTAS, JSON.stringify(allCartas));
    }
  }, [allCartas, isLoading]);

  const handleFormSubmit = (formData: PaqueteFormData) => {
    if (paqueteToEdit) {
      const updated = paquetes.map((p) =>
        p.id === paqueteToEdit.id ? { ...paqueteToEdit, ...formData } : p
      );
      setPaquetes(updated);
    } else {
      const newPaquete: Paquete = { ...formData, id: Date.now() };
      setPaquetes([...paquetes, newPaquete]);
    }
    setIsFormVisible(false);
    setPaqueteToEdit(null);
  };

  // === Editar ===
  const handleEditClick = (paquete: Paquete) => {
    setPaqueteToEdit(paquete);
    setIsFormVisible(true);
  };

  // === Eliminar ===
  const handleDeleteClick = (paqueteId: number | string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
      setPaquetes(paquetes.filter((p) => p.id !== paqueteId));
    }
  };

  // === Cancelar formulario ===
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setPaqueteToEdit(null);
  };

  const showCreateForm = () => {
    setPaqueteToEdit(null);
    setIsFormVisible(true);
  };

  return (
    <div>
      <PageTitle title="Gestión de Paquetes" />
      <div style={{ padding: '2rem', height: '100%' }}>
        
        <button style={{ marginBottom: '16px', marginRight: '8px', backgroundColor: '#E6C200', color: 'black' }} onClick={() => window.history.back()}>
            Volver
        </button>
        <hr style={{ margin: '24px 0' }} />
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
            allCartas={allCartas}
          />
        )}

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
