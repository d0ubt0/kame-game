// src/pages/admin/ManageSingles.tsx
import { useState, useEffect } from 'react';
import SingleTable from '../../components/Admin/Carta/CartaTable';
import SingleForm from '../../components/Admin/Carta/CartaForm';
import { PageTitle } from '../../components/PageTitle';
import type { Carta, CartaFormData } from '../../types/yugioh';

const LOCAL_STORAGE_KEY = 'cartas';

function ManageSingles() {
  const [singles, setSingles] = useState<Carta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [singleToEdit, setSingleToEdit] = useState<Carta | null>(null);

  // === Cargar cartas desde localStorage al iniciar ===
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed)) {
          setSingles(parsed);
        } else {
          console.warn('⚠️ Datos inválidos en localStorage, reseteando.');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error('❌ Error al leer localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // === Guardar en localStorage cada vez que cambian las cartas ===
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(singles));
    }
  }, [singles, isLoading]);

  // === Crear o actualizar carta ===
  const handleFormSubmit = (formData: CartaFormData) => {
    if (singleToEdit) {
      const updated = singles.map((s) =>
        s.id === singleToEdit.id ? { ...singleToEdit, ...formData } : s
      );
      setSingles(updated);
    } else {
      const newSingle: Carta = { ...formData, id: Date.now() };
      setSingles([...singles, newSingle]);
    }
    setIsFormVisible(false);
    setSingleToEdit(null);
  };

  // === Editar ===
  const handleEditClick = (single: Carta) => {
    setSingleToEdit(single);
    setIsFormVisible(true);
  };

  // === Eliminar ===
  const handleDeleteClick = (singleId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      setSingles(singles.filter((s) => s.id !== singleId));
    }
  };

  // === Cancelar formulario ===
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSingleToEdit(null);
  };

  // === Mostrar formulario de nueva carta ===
  const showCreateForm = () => {
    setSingleToEdit(null);
    setIsFormVisible(true);
  };

  // === Renderizado ===
  return (
    <div>
      <PageTitle title="Gestión de Cartas" />

      <div style={{ padding: '2rem', height: '100%' }}>
        <button style={{ marginBottom: '16px', marginRight: '8px', backgroundColor: '#E6C200', color: 'black' }} onClick={() => window.history.back()}>
            Volver
        </button>


        <hr style={{ margin: '24px 0' }} />
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
        <h3>Cartas Existentes</h3>

        {isLoading ? (
          <p>Cargando cartas...</p>
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
