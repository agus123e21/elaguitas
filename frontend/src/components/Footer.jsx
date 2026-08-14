import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <div className="footer__brand">💧 Agua</div>
          <p className="muted" style={{ color: '#8fa3b5', marginTop: '0.4rem' }}>
            Venta y reparto de agua en bidones a domicilio.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>Navegación</div>
          <div style={{ display: 'grid', gap: '0.2rem' }}>
            <Link to="/productos">Productos</Link>
            <Link to="/promociones">Promociones</Link>
            <Link to="/login">Ingresar</Link>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>Contacto</div>
          <p>📞 11 5555 0000</p>
          <p>✉️ hola@agua.com</p>
        </div>
      </div>
    </footer>
  )
}
