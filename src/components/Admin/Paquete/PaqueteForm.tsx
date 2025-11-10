import React, { useState, useEffect } from 'react';
import type { Paquete, PaqueteFormData, Carta } from '../../../db/yugioh';

interface PaqueteFormProps {
  initialData: Paquete | null;
  onSubmit: (formData: PaqueteFormData) => void;
  onCancel?: () => void;
  allCartas: Carta[];
}

const defaultFormState: PaqueteFormData = {
  name: '',
  image: '', 
  price: 0,
  cards: [] 
};

const PaqueteForm: React.FC<PaqueteFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  allCartas = [] 
}) => {
  
  const [formData, setFormData] = useState<PaqueteFormData>(defaultFormState);
  
  const [cardToAdd, setCardToAdd] = useState<string>('');

  const isEditing = Boolean(initialData);
  const title = isEditing ? 'Editar Paquete' : 'Crear Nuevo Paquete';

  useEffect(() => {
    if (isEditing && initialData) {
      const data = { ...initialData, cards: initialData.cards || [] };
      const { id, ...formData } = data; 
      setFormData(formData);
    } else {
      setFormData(defaultFormState);
    }
  }, [initialData, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };


  const handleAddCard = () => {
    if (cardToAdd && !formData.cards.includes(cardToAdd)) {
      setFormData(prev => ({
        ...prev,
        cards: [...prev.cards, cardToAdd]
      }));
    }
    setCardToAdd('');
  };

  const handleRemoveCard = (cardIdToRemove: string | number) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter(id => id.toString() !== cardIdToRemove.toString())
    }));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availableCartas = allCartas.filter(
    carta => !formData.cards.includes(carta.id.toString())
  );
  
  const cartasEnPaquete = formData.cards.map(id => 
    allCartas.find(carta => carta.id.toString() === id.toString())
  ).filter(Boolean) as Carta[]; 

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
      <h3 style={{ fontSize: '2rem', color: '#E6C200'}}>{title}</h3>
      <form onSubmit={handleSubmit}>

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