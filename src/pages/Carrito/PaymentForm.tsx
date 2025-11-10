import './PaymentForm.css'

export function PaymentForm({ onPay }: { onPay: () => void }) {
    return(
        <div className="formulario">
            <div className='contenedor-titulo'>
                <h3 className='titulo-formulario'>INFORMACIÓN DE PAGO</h3>
            </div>
        
            <form className='contenedor-items'>
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
                    <button className='boton-pagar' onClick={onPay}>
                    REALIZAR PAGO
                    </button>
                </div>
            </form>
        </div>
    )
}