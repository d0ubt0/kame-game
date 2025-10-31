// src/components/Admin/Paquete/PaqueteForm.tsx
import React, { useState, useEffect } from 'react';
// Importamos los tipos de Paquete y Carta
import type { Paquete, PaqueteFormData, Carta } from '../../../types/yugioh';

// Props que espera el formulario
interface PaqueteFormProps {
  initialData: Paquete | null;
  onSubmit: (formData: PaqueteFormData) => void;
  onCancel?: () => void;
  allCartas: Carta[]; // ¡NUEVO! Necesitamos la lista de todas las cartas
}

// Estado inicial del formulario
const defaultFormState: PaqueteFormData = {
  name: '',
  image: '', // URL
  price: 0,
  cards: [] // Array de IDs (ej: ['101', '102'])
};

const PaqueteForm: React.FC<PaqueteFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  allCartas = [] // Valor por defecto
}) => {
  
  const [formData, setFormData] = useState<PaqueteFormData>(defaultFormState);
  
  // Estado local para manejar el <select>
  const [cardToAdd, setCardToAdd] = useState<string>('');

  const isEditing = Boolean(initialData);
  const title = isEditing ? 'Editar Paquete' : 'Crear Nuevo Paquete';

  useEffect(() => {
    if (isEditing && initialData) {
      // Aseguramos que 'cards' sea siempre un array (incluso si es null o undefined)
      const data = { ...initialData, cards: initialData.cards || [] };
      const { id, ...formData } = data; // Excluye el 'id'
      setFormData(formData);
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData, isEditing]);

  // Manejador de cambios genérico
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // --- Lógica del Selector de Cartas ---

  // Añade la carta seleccionada en el <select> al array 'formData.cards'
  const handleAddCard = () => {
    // Evita IDs vacíos o duplicados
    if (cardToAdd && !formData.cards.includes(cardToAdd)) {
      setFormData(prev => ({
        ...prev,
        cards: [...prev.cards, cardToAdd]
      }));
    }
    setCardToAdd(''); // Resetea el select
  };

  // Elimina una carta del array 'formData.cards'
  const handleRemoveCard = (cardIdToRemove: string | number) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter(id => id.toString() !== cardIdToRemove.toString())
    }));
  };

  // --- Fin de la lógica del Selector ---

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Listas calculadas para la UI
  // Filtra las cartas que ya están en el paquete
  const availableCartas = allCartas.filter(
    carta => !formData.cards.includes(carta.id.toString())
  );
  
  // Obtiene los objetos completos de las cartas que están en el paquete (para mostrar los nombres)
  const cartasEnPaquete = formData.cards.map(id => 
    allCartas.find(carta => carta.id.toString() === id.toString())
  ).filter(Boolean) as Carta[]; // .filter(Boolean) elimina undefined

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
      <h3 style={{ fontSize: '2rem', color: '#E6C200'}}>{title}</h3>
      <form onSubmit={handleSubmit}>

        {/* Campos estándar */}
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="name">Nombre del Paquete:</label><br />
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '300px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="image">URL de la Imagen:</label><br />
          <input type="text" id="image" name="image" placeholder="https://ejemplo.com/imagen.jpg" value={formData.image} onChange={handleChange} required style={{ width: '300px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="price">Precio:</label><br />
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
        </div>

        {/* --- Sección del Selector de Cartas --- */}
        <div style={{ borderTop: '1px solid #444', paddingTop: '16px', marginTop: '16px' }}>
          <h4 style={{ marginTop: 0, color: '#E6C200' }}>Cartas del Paquete</h4>
          
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="card-select">Añadir Carta:</label><br />
            <select 
              id="card-select"
              value={cardToAdd}
              onChange={e => setCardToAdd(e.target.value)}
              style={{ width: '300px', marginRight: '8px' }}
            >
              <option value="">-- Selecciona una carta --</option>
              {availableCartas.map(carta => (
                <option key={carta.id} value={carta.id}>
                  {carta.name} (ATK: {carta.attack})
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAddCard}>
              Añadir
            </button>
          </div>

          {/* Lista de cartas ya añadidas */}
          <div>
            {cartasEnPaquete.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>Este paquete aún no tiene cartas.</p>
            ) : (
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {cartasEnPaquete.map(carta => (
                  <li key={carta.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#333', padding: '8px', borderRadius: '4px', marginBottom: '4px', color: 'white' }}>
                    <span>{carta.name}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCard(carta.id)}
                      style={{ background: '#e91e63', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* --- FIN Sección Selector --- */}

        {/* Botones */}
        <div style={{ marginTop: '20px' }}>
          <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PaqueteForm;