import './PaymentForm.css'

export function PaymentForm({ onPay }: { onPay: () => void }) {
    
    // Función intermedia para evitar que el formulario recargue la página
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // <--- ¡ESTO ES LA CLAVE! Detiene la recarga
        onPay();            // Ejecuta tu lógica de pago
    };

    return(
        <div className="formulario">
            <div className='contenedor-titulo'>
                <h3 className='titulo-formulario'>INFORMACIÓN DE PAGO</h3>
            </div>
        
            {/* Agregamos onSubmit preventDefault por seguridad extra */}
            <form className='contenedor-items' onSubmit={(e) => e.preventDefault()}>
                <div className='items'>
                    <label htmlFor="">NOMBRE DEL TITULAR</label>
                    <input type="text" />
                </div>
                <div className='items'>
                    <label htmlFor="">DOCUMENTO DEL TITULAR</label>
                    <input type="text" />
                </div>
                <div className='items'>
                    <label htmlFor="">NÚMERO DE TARJETA</label>
                    <input type="text" />
                </div>
                <div className='datos-tarjeta'>
                    <div className='expiracion'>
                        <label htmlFor="">F. EXPIRACIÓN</label>
                        <input type="text" />
                    </div>
                    <div className='cvv'>
                        <label htmlFor="">CVV</label>
                        <input type="text" />
                    </div>
                </div>
                <div className='contenedor-boton'>
                    {/* Cambiamos a type="button" y usamos nuestro handleClick */}
                    <button 
                        type="button" 
                        className='boton-pagar' 
                        onClick={handleClick}
                    >
                    REALIZAR PAGO
                    </button>
                </div>
            </form>
        </div>
    )
}