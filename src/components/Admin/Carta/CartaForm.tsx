import React, { useState, useEffect } from 'react';
import type { Carta, CartaFormData } from '../../../db/yugioh';

interface SingleFormProps {
  initialData: Carta | null; 
  onSubmit: (formData: CartaFormData) => void;
  onCancel?: () => void; 
}

const defaultFormState: CartaFormData = {
  name: '',
  image: '',
  description: '',
  attack: 0,
  defense: 0,
  price: 0
};

const SingleForm: React.FC<SingleFormProps> = ({ initialData, onSubmit, onCancel }) => {
  
  const [formData, setFormData] = useState<CartaFormData>(defaultFormState);

  const isEditing = Boolean(initialData);
  const title = isEditing ? 'Editar Carta' : 'Crear Nueva Carta';

  useEffect(() => {
    if (isEditing && initialData) {
      const { id, ...formData } = initialData; 
      setFormData(formData);
    } else {
      setFormData(defaultFormState); 
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price') ? parseFloat(value) || 0 :
             (name === 'attack' || name === 'defense') ? parseInt(value, 10) || 0 :
             value 
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px', justifyContent: 'center' }}>
      <h3 style={{ fontSize: '2rem', color: '#E6C200'}}>{title}</h3>
      <form onSubmit={handleSubmit} style={{ justifyContent: 'center'}}>  

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="name">Nombre:</label><br />
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '300px', height: '2rem', border: '1px solid #ccc', borderRadius: '4px', padding: '4px' }} />
        </div>

        <div style={{ marginBottom: '12px'}}>
          <label htmlFor="image" style={{  }}>URL de la Imagen:</label><br />
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