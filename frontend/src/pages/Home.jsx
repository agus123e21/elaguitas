import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getMyOrders } from '../services/orders.js'
import { getProducts } from '../services/products.js'
import {
  MapPinIcon,
  ShoppingBagIcon,
  RefreshCwIcon,
  TruckIcon,
  PhoneIcon,
  WhatsAppIcon,
  ShieldIcon,
  ChevronRightIcon,
  CheckIcon,
  AlertCircleIcon,
  DropletIcon,
} from '../components/Icons.jsx'

export default function Home() {
  const { user, token } = useAuth()
  const { addItem, count: cartCount } = useCart()
  const navigate = useNavigate()

  const [activeOrder, setActiveOrder] = useState(null)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    if (!token) return
    setLoadingOrder(true)
    getMyOrders(token)
      .then((orders) => {
        if (Array.isArray(orders)) {
          // Buscar pedido en curso (OUT_FOR_DELIVERY o PENDING)
          const inProgress = orders.find(
            (o) => o.status === 'OUT_FOR_DELIVERY' || o.status === 'PENDING'
          )
          setActiveOrder(inProgress || null)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOrder(false))
  }, [token])

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2400)
  }

  // Acción rápida: Recambio express 2x 20L directo al checkout
  async function handleQuickReorder() {
    try {
      const products = await getProducts({ token })
      const bottle20 = Array.isArray(products)
        ? products.find((p) => p.name.includes('20') || p.volume_liters === 20) || products[0]
        : null

      if (bottle20) {
        addItem(bottle20, 2)
        showToast('Agregaste 2x Bidón 20L. Dirigiendo a confirmación...')
        setTimeout(() => navigate('/checkout'), 700)
      } else {
        navigate('/productos')
      }
    } catch {
      navigate('/productos')
    }
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'vecino'

  return (
    <div className="page page--home">
      {/* Toast Feedback Táctil */}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '64px',
            left: '1rem',
            right: '1rem',
            maxWidth: '380px',
            margin: '0 auto',
            zIndex: 9999,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: '#fff',
            padding: '0.65rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 10px 25px rgba(2, 132, 199, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.86rem',
            fontWeight: 800,
            animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <CheckIcon size={16} color="#ffffff" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Saludo y Ubicación en San Rafael */}
      <div style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
          <MapPinIcon size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            San Rafael, Mendoza
          </span>
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0 0 0.15rem', color: '#0f172a', letterSpacing: '-0.025em' }}>
          Buen día, {firstName}
        </h1>
        <p className="muted" style={{ margin: 0, fontSize: '0.84rem' }}>
          Agua pura microfiltrada en planta San Rafael
        </p>
      </div>

      <div className="home-desktop-layout">
        <div>
          {/* Tarjeta de Pedido en Curso o Bienvenida Activa */}
          {activeOrder ? (
        <section
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            color: '#ffffff',
            boxShadow: '0 14px 30px rgba(2, 132, 199, 0.35)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              {activeOrder.status === 'OUT_FOR_DELIVERY' ? 'EN REPARTO' : 'EN PREPARACIÓN'}
            </span>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, opacity: 0.9 }}>
              ORD-#{activeOrder.id}
            </span>
          </div>

          <strong style={{ fontSize: '1.1rem', fontWeight: 900, display: 'block', lineHeight: 1.25, margin: '0.25rem 0' }}>
            {activeOrder.status === 'OUT_FOR_DELIVERY' ? 'En camino a tu dirección' : 'Preparando tu pedido'}
          </strong>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.3)', borderRadius: 'var(--radius-pill)', margin: '0.75rem 0 0.4rem', overflow: 'hidden' }}>
            <div style={{ width: activeOrder.status === 'OUT_FOR_DELIVERY' ? '75%' : '40%', height: '100%', background: '#34d399', borderRadius: 'var(--radius-pill)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', opacity: 0.92 }}>
            <span>{activeOrder.driver_name ? `Chofer: ${activeOrder.driver_name}` : 'Reparto en camino'}</span>
            <Link to={`/pedidos/${activeOrder.id}`} style={{ color: '#bae6fd', fontWeight: 800, textDecoration: 'none' }}>
              Ver estado →
            </Link>
          </div>
        </section>
      ) : (
        <section
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.35rem 1.25rem',
            color: '#ffffff',
            boxShadow: '0 14px 32px rgba(2, 132, 199, 0.28)',
            marginBottom: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.5rem',
            }}
          >
            San Rafael
          </span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 0.35rem', color: '#ffffff' }}>
            Agua pura en tu puerta
          </h2>
          <p style={{ fontSize: '0.82rem', margin: '0 0 1rem', opacity: 0.92, lineHeight: 1.4 }}>
            Entregas en el día. Recambio directo de envases retornables.
          </p>

          <Link
            to="/productos"
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0f172a',
              color: '#ffffff',
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <span>Pedir Ahora</span>
            <ChevronRightIcon size={14} color="#ffffff" />
          </Link>
        </section>
      )}

      {/* Grilla de Accesos Directos 2x2 Curvos (Inspirado en Prototipo Prime) */}
      <section style={{ marginBottom: '1.35rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
          Accesos Rápidos
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* Tile 1: Pedir Agua (Catálogo) */}
          <Link
            to="/productos"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: 'var(--shadow-card)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '110px',
              transition: 'transform 0.15s ease',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <ShoppingBagIcon size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                Pedir Agua
              </strong>
              <span className="muted" style={{ fontSize: '0.72rem' }}>Ver catálogo completo</span>
            </div>
          </Link>

          {/* Tile 2: Recambio Express (2x 20L a 1 Toque) */}
          <div
            onClick={handleQuickReorder}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '110px',
              transition: 'transform 0.15s ease',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <RefreshCwIcon size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-dark)', display: 'block' }}>
                Recambio Rápido
              </strong>
              <span className="muted" style={{ fontSize: '0.72rem' }}>2x 20L en 1 toque</span>
            </div>
          </div>

          {/* Tile 3: Retiro de Vacíos */}
          <a
            href="https://wa.me/5492604322659?text=Hola%20El%20Agüitas,%20quisiera%20coordinar%20el%20retiro%20de%20envases%20vacíos%20en%20San%20Rafael"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: 'var(--shadow-card)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '110px',
              transition: 'transform 0.15s ease',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b45309',
              }}
            >
              <TruckIcon size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                Retiro Vacíos
              </strong>
              <span className="muted" style={{ fontSize: '0.72rem' }}>Coordinar recogida</span>
            </div>
          </a>

          {/* Tile 4: Llamar a Planta */}
          <a
            href="tel:+5492604322659"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: 'var(--shadow-card)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '110px',
              transition: 'transform 0.15s ease',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4338ca',
              }}
            >
              <PhoneIcon size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                Llamar a Planta
              </strong>
              <span className="muted" style={{ fontSize: '0.72rem' }}>+54 9 2604 32-2659</span>
            </div>
          </a>
        </div>
      </section>

      {/* Sello Oficial de Pureza Certificada */}
      <section
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <ShieldIcon size={20} color="var(--primary)" />
              <strong style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text)' }}>
                Pureza Certificada
              </strong>
            </div>
            <p className="muted" style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', lineHeight: 1.5, maxWidth: '420px' }}>
              Agua purificada bajo normas bromatológicas de San Rafael: ósmosis inversa, ozono y desinfección UV. 100% libre de cloro y 0% sodio.
            </p>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, background: 'var(--surface-raised)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'var(--text)' }}>
                ✓ 0% Sodio
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, background: 'var(--surface-raised)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'var(--text)' }}>
                ✓ Ósmosis Inversa
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, background: 'var(--surface-raised)', border: '1px solid var(--border)', padding: '0.25rem 0.6rem', borderRadius: '8px', color: 'var(--text)' }}>
                ✓ Bromatología San Rafael
              </span>
            </div>
          </div>

          {/* Sellito Gráfico de Garantía */}
          <div
            style={{
              flexShrink: 0,
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              border: '2px dashed var(--primary)',
              background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 75%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '4px',
              boxShadow: '0 4px 14px rgba(11, 125, 194, 0.15)',
              transform: 'rotate(-6deg)',
            }}
          >
            <ShieldIcon size={18} color="var(--primary)" />
            <span
              style={{
                fontSize: '0.52rem',
                fontWeight: 900,
                color: 'var(--primary)',
                lineHeight: 1.1,
                marginTop: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              SELLO CALIDAD
            </span>
            <span style={{ fontSize: '0.46rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              100% PURA
            </span>
          </div>
        </div>
      </section>

      </div>
      </div>

      {/* Dock Flotante de Resumen si hay Items en Carrito */}
      {cartCount > 0 && (
        <aside
          aria-label="Resumen de pedido"
          style={{
            position: 'fixed',
            bottom: '76px',
            left: '1rem',
            right: '1rem',
            maxWidth: '480px',
            margin: '0 auto',
            zIndex: 80,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: '#fff',
            padding: '0.75rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 12px 30px rgba(2, 132, 199, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'} seleccionados
            </div>
          </div>

          <Link
            to="/checkout"
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#ffffff',
              color: 'var(--primary-dark)',
              fontWeight: 900,
              minHeight: '38px',
              padding: '0.45rem 1.15rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
              textDecoration: 'none',
            }}
          >
            <span>Confirmar Pedido</span>
            <ChevronRightIcon size={14} color="var(--primary-dark)" />
          </Link>
        </aside>
      )}
    </div>
  )
}
