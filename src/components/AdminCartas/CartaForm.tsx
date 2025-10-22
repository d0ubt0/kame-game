// src/components/singles/SingleForm.tsx
import React, { useState, useEffect } from 'react';
// Importamos los tipos actualizados
import type { Carta, CartaFormData } from '../../types/cartas';

// Props que espera el formulario
interface SingleFormProps {
  initialData: Carta | null; // Puede ser un objeto (editar) o null (crear)
  onSubmit: (formData: CartaFormData) => void;
  onCancel?: () => void; // '?' significa que es opcional
}

// Estado inicial del formulario con los nuevos campos
const defaultFormState: CartaFormData = {
  name: '',
  image: '', // URL
  description: '',
  attack: 0,
  defense: 0,
  price: 0
};

const SingleForm: React.FC<SingleFormProps> = ({ initialData, onSubmit, onCancel }) => {
  
  // Tipamos el hook useState con CartaFormData
  const [formData, setFormData] = useState<CartaFormData>(defaultFormState);

  const isEditing = Boolean(initialData);
  // Título dinámico en español
  const title = isEditing ? 'Editar Carta' : 'Crear Nueva Carta';

  // Este efecto se usa para llenar el formulario si estamos editando
  useEffect(() => {
    if (isEditing && initialData) {
      const { id, ...formData } = initialData; // Excluye el 'id'
      setFormData(formData);
    } else {
      setFormData(defaultFormState); // Resetea al estado inicial si es "crear"
    }
  }, [initialData, isEditing]);

  // Manejador de cambios para <input> y <textarea>
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      // Convertimos a número si el campo es 'price', 'attack' o 'defense'
      [name]: (name === 'price') ? parseFloat(value) || 0 :
             (name === 'attack' || name === 'defense') ? parseInt(value, 10) || 0 :
             value // El resto (name, image, description) son strings
    }));
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="name">Nombre:</label><br />
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '300px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="image">URL de la Imagen:</label><br />
          <input type="text" id="image" name="image" placeholder="https://ejemplo.com/imagen.jpg" value={formData.image} onChange={handleChange} required style={{ width: '300px' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="description">Descripción:</label><br />
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows={4} 
            style={{ width: '300px' }} 
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="attack">Ataque (ATK):</label><br />
          <input type="number" id="attack" name="attack" value={formData.attack} onChange={handleChange} required min="0" />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="defense">Defensa (DEF):</label><br />
          <input type="number" id="defense" name="defense" value={formData.defense} onChange={handleChange} required min="0" />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="price">Precio:</label><br />
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
        </div>

        {/* Botones en español */}
        <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}

export default SingleForm;