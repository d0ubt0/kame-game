import './CartItem.css';

export interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ id, name, price, image, quantity, onRemove, onIncrease, onDecrease }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <img src={image} alt={name} className="cart-item-image" />

        <div className="cart-item-details">
            <h3 className='cart-item-name'>{name}</h3>
            <p className='cart-item-price'>{price.toLocaleString()} COP</p>
        </div>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => onDecrease(id)} className="quantity-btn">−</button>
        <span className="quantity">{quantity}</span>
        <button onClick={() => onIncrease(id)} className="quantity-btn">+</button>
      </div>
      <div className="eliminar-item">
        <button className="cart-item-remove" onClick={() => onRemove(id)}>
          <img src="../public/eliminar.png" alt="eliminar" className='eliminar-cart-item'/>
        </button>
      </div>
    </div>
  );
};