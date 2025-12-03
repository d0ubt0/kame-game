import "./Footer.css"

export function Footer() {
    return(
        <footer>
             <div className="footerContent">
                <div className="footerBrand">
                    <h2><span>Yu-Gi-Oh</span> Store</h2>
                    <p>Cartas, batallas y colecciones para verdaderos duelistas.</p>
                </div>

                
                <div className="footerSocial">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <img src="../public/facebook.png" alt="facebook" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    <img src="../public/instagram.png" alt="instagram" />
                </a>
                <a href="https://discord.com" target="_blank" rel="noreferrer">
                    <img src="../public/discord.png" alt="discord" />
                </a>
                </div>
            </div>

            <div className="footerBottom">
                <p>© 2025 Yu-Gi-Oh Store. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}